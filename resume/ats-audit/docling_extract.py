import argparse
from importlib.metadata import version
import json
import os
from pathlib import Path
import sys


def main():
    parser = argparse.ArgumentParser(description="Extract local PDF layout and text with Docling")
    parser.add_argument("pdf", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--artifacts-path", type=Path)
    parser.add_argument("--offline", action="store_true")
    args = parser.parse_args()
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    metadata = {"status": "failed", "versions": {}, "options": {}, "errors": []}
    (output / "docling-run.json").write_text(json.dumps({
        **metadata, "errors": ["Docling extraction did not complete"],
    }, indent=2) + "\n")
    if args.offline:
        os.environ["HF_HUB_OFFLINE"] = "1"
        os.environ["TRANSFORMERS_OFFLINE"] = "1"

    try:
        from docling.datamodel.base_models import ConversionStatus, InputFormat
        from docling.datamodel.pipeline_options import PdfPipelineOptions
        from docling.document_converter import DocumentConverter, PdfFormatOption
        from docling.pipeline.standard_pdf_pipeline import StandardPdfPipeline

        metadata["versions"] = {
            name: version(name)
            for name in ["docling", "docling-slim", "docling-core", "docling-ibm-models", "torch"]
        }
        options = PdfPipelineOptions(
            do_ocr=False,
            do_table_structure=True,
            enable_remote_services=False,
            allow_external_plugins=False,
            artifacts_path=args.artifacts_path.expanduser().resolve() if args.artifacts_path else None,
        )
        metadata["pipeline"] = "StandardPdfPipeline"
        metadata["options"] = options.model_dump(mode="json")
        metadata["offline"] = args.offline
        converter = DocumentConverter(
            allowed_formats=[InputFormat.PDF],
            format_options={
                InputFormat.PDF: PdfFormatOption(
                    pipeline_cls=StandardPdfPipeline, pipeline_options=options
                ),
            },
        )
        result = converter.convert(args.pdf.expanduser().resolve(), raises_on_error=False)
        metadata["status"] = result.status.value
        metadata["errors"] = [error.model_dump(mode="json") for error in result.errors]
        document = result.document
        (output / "docling-document.json").write_text(
            json.dumps(document.export_to_dict(), indent=2) + "\n"
        )
        (output / "docling.md").write_text(document.export_to_markdown() + "\n")
        (output / "docling-text.txt").write_text(document.export_to_text() + "\n")
        items = [
            {"order": index, "level": level, **item.model_dump(mode="json")}
            for index, (item, level) in enumerate(document.iterate_items())
        ]
        (output / "docling-items.json").write_text(json.dumps(items, indent=2) + "\n")
        metadata["itemCount"] = len(items)
        metadata["artifacts"] = [
            "docling-document.json", "docling.md", "docling-text.txt", "docling-items.json",
        ]
        succeeded = result.status == ConversionStatus.SUCCESS
    except Exception as error:
        metadata["status"] = "failed"
        metadata["errors"].append(f"{type(error).__name__}: {error}")
        succeeded = False

    (output / "docling-run.json").write_text(json.dumps(metadata, indent=2) + "\n")
    if not succeeded:
        print(f"Docling extraction did not succeed. See {output / 'docling-run.json'}", file=sys.stderr)
    return 0 if succeeded else 1


if __name__ == "__main__":
    sys.exit(main())
