import argparse
from datetime import datetime, timezone
import hashlib
from importlib.metadata import version
import json
from pathlib import Path
import re
import subprocess
import sys
import unicodedata
from xml.etree import ElementTree
from zipfile import ZipFile

from pypdf import PdfReader
import pymupdf


ROOT = Path(__file__).resolve().parent
RESUME_ROOT = ROOT.parent
DEFAULT_PDF = RESUME_ROOT / "Alexander-Brodsky-Resume.pdf"


def normalize(text):
    return re.sub(r"\s+", " ", unicodedata.normalize("NFKC", text)).strip()


def docx_paragraphs(path):
    namespace = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
    with ZipFile(path) as document:
        body = ElementTree.fromstring(document.read("word/document.xml"))
    paragraphs = []
    for paragraph in body.iter(namespace + "p"):
        parts = []
        for element in paragraph.iter():
            if element.tag == namespace + "t":
                parts.append(element.text or "")
            elif element.tag in [namespace + "tab", namespace + "br"]:
                parts.append(" ")
        text = normalize("".join(parts))
        if text:
            paragraphs.append(text)
    return paragraphs


def main():
    parser = argparse.ArgumentParser(description="Inspect local resume extraction")
    parser.add_argument("pdf", type=Path, nargs="?", default=DEFAULT_PDF)
    parser.add_argument("--docx", type=Path)
    parser.add_argument("--expected", type=Path)
    parser.add_argument("--output", type=Path, default=RESUME_ROOT / "artifacts/ats-audit/current")
    parser.add_argument("--vendors", nargs="+", choices=["openresume", "docling"], default=["openresume"])
    parser.add_argument("--docling-artifacts-path", type=Path, help="Use prefetched Docling model artifacts")
    parser.add_argument("--docling-offline", action="store_true", help="Use cached models without Hugging Face downloads")
    args = parser.parse_args()
    if (args.docling_artifacts_path or args.docling_offline) and "docling" not in args.vendors:
        parser.error("Docling options require --vendors docling (or --vendors openresume docling)")
    pdf = args.pdf.expanduser().resolve()
    output = args.output.expanduser().resolve()
    output.mkdir(parents=True, exist_ok=True)

    subprocess.run(
        [
            "npm", "run", "parse", "--", str(pdf), str(output),
            *([] if "openresume" in args.vendors else ["--text-only"]),
        ],
        cwd=ROOT,
        check=True,
    )
    reader = PdfReader(pdf)
    texts = {
        "pypdf": "\n\n".join(page.extract_text() or "" for page in reader.pages),
        "pdfjs": (output / "pdfjs-text.txt").read_text(),
    }
    with pymupdf.open(pdf) as document:
        texts["mupdf"] = "\n\n".join(page.get_text() for page in document)
        for index, page in enumerate(document):
            page.get_pixmap(matrix=pymupdf.Matrix(1.5, 1.5)).save(
                output / f"page-{index + 1}.png"
            )
    vendors = {}
    if "openresume" in args.vendors:
        vendors["openresume"] = {"status": "success", "kind": "structured-resume-parser"}
    if "docling" in args.vendors:
        (output / "docling-run.json").write_text(json.dumps({
            "status": "failed", "errors": ["Docling process did not complete"],
        }, indent=2) + "\n")
        python = ROOT / ".venv-docling" / (
            "Scripts/python.exe" if sys.platform == "win32" else "bin/python"
        )
        if not python.is_file():
            vendors["docling"] = {
                "status": "failed",
                "errors": ["Docling is not installed. Run npm run resume:setup -- --with-docling."],
            }
            (output / "docling-run.json").write_text(json.dumps(vendors["docling"], indent=2) + "\n")
        else:
            command = [str(python), str(ROOT / "docling_extract.py"), str(pdf), str(output)]
            if args.docling_artifacts_path:
                command.extend(["--artifacts-path", str(args.docling_artifacts_path)])
            if args.docling_offline:
                command.append("--offline")
            completed = subprocess.run(command, check=False)
            vendors["docling"] = json.loads((output / "docling-run.json").read_text())
            if completed.returncode and vendors["docling"]["status"] == "success":
                vendors["docling"]["status"] = "failed"
        vendors["docling"]["kind"] = "document-layout-and-text-extractor"
        if vendors["docling"]["status"] in ["success", "partial_success"]:
            texts["docling"] = (output / "docling-text.txt").read_text()
    for name, text in texts.items():
        (output / f"{name}-text.txt").write_text(text)

    docx = args.docx or pdf.with_suffix(".docx")
    paragraphs = docx_paragraphs(docx) if docx.is_file() else []
    coverage = {}
    for name, text in texts.items():
        normalized = normalize(text)
        missing = [line for line in paragraphs if normalize(line) not in normalized]
        coverage[name] = {
            "hasText": bool(normalized),
            "replacementCharacterCount": text.count("\ufffd"),
            "missingSourceParagraphs": missing,
        }
    if paragraphs:
        (output / "docx-source.txt").write_text("\n".join(paragraphs) + "\n")

    resume = (
        json.loads((output / "openresume.json").read_text())
        if "openresume" in args.vendors else None
    )
    expected_path = args.expected or (
        ROOT / "expected.json" if pdf == DEFAULT_PDF else None
    )
    checks = []

    def compare(field, actual, expected):
        checks.append({
            "field": field,
            "actual": actual,
            "expected": expected,
            "matches": actual == expected,
        })

    if expected_path and resume is not None:
        expected = json.loads(expected_path.read_text())
        for key, value in expected["profile"].items():
            compare(f"profile.{key}", resume["profile"][key], value)
        for section in ["workExperiences", "educations"]:
            compare(f"{section}.count", len(resume[section]), len(expected[section]))
            for index, item in enumerate(expected[section]):
                actual = resume[section][index] if index < len(resume[section]) else {}
                for key, value in item.items():
                    observed = (
                        len(actual.get("descriptions", []))
                        if key == "descriptionCount"
                        else actual.get(key)
                    )
                    compare(f"{section}[{index}].{key}", observed, value)
        compare("projects.count", len(resume["projects"]), expected["projectCount"])
        compare(
            "skills.descriptionCount",
            len(resume["skills"]["descriptions"]),
            expected["skillLineCount"],
        )

    package = json.loads((ROOT / "package.json").read_text())
    result = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "pdf": str(pdf),
        "sha256": hashlib.sha256(pdf.read_bytes()).hexdigest(),
        "pages": len(reader.pages),
        "docx": str(docx.resolve()) if paragraphs else None,
        "sourceParagraphCount": len(paragraphs),
        "expected": str(expected_path.resolve()) if expected_path else None,
        "selectedVendors": args.vendors,
        "vendors": vendors,
        "versions": {
            "pypdf": version("pypdf"),
            "pymupdf": version("pymupdf"),
            "pdfjs": package["dependencies"]["pdfjs-dist"],
            "openresume": subprocess.check_output(
                [
                    "git", "-C", str(ROOT / "vendor/open-resume"),
                    "log", "-1", "--format=%H",
                ],
                text=True,
            ).strip(),
        },
        "extraction": coverage,
        "structuredChecks": checks,
        "limitations": [
            "OpenResume is one open-source parser, not an employer's ATS",
            "Independent text extractors do not equal independent structured resume parsers",
            "Paragraph checks detect content changes but do not prove reading order",
            "Structured checks cover selected fields, counts, and bullet counts",
            "Manually review full output for bullet assignment, links, and reading order",
            "Expected fields must be reviewed when resume content changes",
        ],
    }
    if "docling" in vendors:
        result["versions"].update(vendors["docling"].get("versions", {}))
        result["limitations"].extend([
            "Docling extracts document layout, text, and reading order, not employer/title/date resume fields",
            "Docling paragraph coverage is text preservation, not ATS field accuracy",
            "Docling OCR is disabled, so scanned pages and image-only text are outside this configuration's scope",
        ])
    (output / "audit.json").write_text(json.dumps(result, indent=2) + "\n")

    report = [
        "# Local resume parsing report",
        "",
        f"Generated: {result['generatedAt']}",
        f"PDF: {pdf}",
        f"PDF SHA-256: {result['sha256']}",
        f"Pages: {len(reader.pages)}",
        f"Selected vendors: {', '.join(args.vendors)}",
        "",
        "## Vendors",
        "",
    ]
    for name, vendor in vendors.items():
        report.append(f"- {name}: {vendor['status']} ({vendor['kind']})")
        if name == "docling":
            report.append(
                f"  - Version: {vendor.get('versions', {}).get('docling', 'unavailable')}. "
                "Standard PDF pipeline, layout and reading order, table structure enabled, OCR disabled."
            )
            report.append(
                "  - This is document text coverage, not structured resume field accuracy. "
                "See docling-run.json for status, versions, and pipeline options. "
                "Only files listed in its artifacts array belong to this conversion."
            )
        for error in vendor.get("errors", []):
            report.append(f"  - Error: {error}")
    report.extend([
        "",
        "## Text extraction",
        "",
    ])
    for name, data in coverage.items():
        missing = data["missingSourceParagraphs"]
        if paragraphs:
            report.append(
                f"- {name}: {len(paragraphs) - len(missing)}/{len(paragraphs)} "
                "Word-source paragraphs found verbatim after whitespace normalization"
            )
        else:
            report.append(f"- {name}: {'text found' if data['hasText'] else 'no text found'}")
        for line in missing:
            report.append(f"  - Missing or changed: {line}")
        if data["replacementCharacterCount"]:
            report.append(f"  - Replacement characters: {data['replacementCharacterCount']}")
    report.extend(["", "## Structured fields (OpenResume)", ""])
    if checks:
        failures = [check for check in checks if not check["matches"]]
        report.append(
            f"{len(checks) - len(failures)}/{len(checks)} selected field and count checks match "
            "the manually recorded baseline. This is not an ATS score."
        )
        report.append("")
        for check in failures:
            report.append(
                f"- {check['field']}: expected {json.dumps(check['expected'])}; "
                f"received {json.dumps(check['actual'])}"
            )
    elif resume is not None:
        report.append("No expected-field baseline supplied. Review openresume.json manually.")
    else:
        report.append("OpenResume was not selected. No structured resume field checks ran.")
    report.extend(["", "## Limits", ""])
    report.extend(f"- {item}" for item in result["limitations"])
    report.extend([
        "",
        "The parsing code runs locally with no API keys or resume uploads. "
        "Initial dependency installation requires internet access. "
        "Docling also downloads model weights on first use unless prefetched. "
        "The report can contain personal information from the resume.",
        "",
    ])
    (output / "report.md").write_text("\n".join(report))
    print(f"Report: {output / 'report.md'}")
    if any(vendor["status"] != "success" for vendor in vendors.values()):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
