# Local resume parsing

Install the checker once from the project root:

```sh
npm run resume:setup
```

Requires Git, Node.js 24 or newer, and Python 3.12 or newer, excluding Python 3.14.1 because the pinned NetworkX package does not support it. Setup looks for another installed interpreter if the default Python is unsupported. It initializes the OpenResume submodule at the revision recorded by this repository, creates an isolated Python environment, and installs pinned Node and Python dependencies in the tool directory. The tool lives with the resume documents, separately from the Astro site. The website build does not need the submodule or these dependencies.

After exporting an updated resume PDF, run:

```sh
npm run resume:check
```

The default input is [the portfolio resume PDF](/Users/alexbrodsky/GitHub/Portfolio/resume/Alexander-Brodsky-Resume.pdf). The checker compares extracted text with the sibling Word source and checks selected structured fields against [the manually recorded baseline](/Users/alexbrodsky/GitHub/Portfolio/resume/ats-audit/expected.json). Input and output defaults resolve from the project location, so the tool works in other checkouts.

The [latest report](/Users/alexbrodsky/GitHub/Portfolio/resume/artifacts/ats-audit/current/report.md) includes extraction differences and structured field mismatches. That ignored output directory also contains raw JSON, extracted text, detected sections, PDF links, and rendered pages. Review these for job and bullet assignment, reading order, dates, and linked words. A successful command means the report was generated. Review its findings before treating the resume as ready.

To check another PDF:

```sh
npm run resume:check -- /absolute/path/resume.pdf --output /absolute/path/report-folder
```

The sibling DOCX is used if present. Use `--docx /absolute/path/source.docx` to choose a different source and `--expected /absolute/path/expected.json` to supply a field baseline. Arbitrary PDFs do not use Alexander's baseline automatically. Update the baseline from the intended source when resume facts change, then inspect the parser results. Do not copy incorrect parser output into it to clear failures.

## Parsers

- OpenResume: structured profile, work experience, education, projects, and skills
- PDF.js, pypdf, and MuPDF: independent PDF text extraction for content comparison
- MuPDF: page rendering for visual review
- Docling (optional): document layout, reading order, tables, Markdown, and text extraction

OpenResume comes from [xitanggg/open-resume](https://github.com/xitanggg/open-resume) through the [git submodule](/Users/alexbrodsky/GitHub/Portfolio/resume/ats-audit/vendor/open-resume). This repository records the upstream commit, initially `4f8255a2c763479837f69f1dccf2a3338730cd79`, instead of storing copies of its source files. Reports include the checked-out upstream commit. Its grouping and field-extraction source is unchanged. The local adapter loads PDF.js in Node and maps text items as upstream does. It enables font metadata on current PDF.js and preserves PDF item order. A small shim supplies the same default skill values without loading the Redux application.

PDF.js is newer than the upstream application's dependency, so results may differ from the hosted OpenResume playground. Three text extractors are not three ATS parsers. OpenResume documents support for single-column English resumes. Passing local checks cannot guarantee the same result in Workday, Greenhouse, Lever, or another employer's ATS, and says nothing about ranking or hiring decisions.

All parsing and rendering runs locally. There are no API keys, model services, or resume uploads. Dependencies require internet access during installation. Reports and local dependencies are ignored by git and are outside the website's published assets.

## Optional Docling vendor

Install Docling alongside the default checker from the project root:

```sh
npm run resume:setup -- --with-docling
```

This installs `docling==2.148.0` in a separate ignored `.venv-docling` environment using the setup interpreter. Setup reuses existing environments and installs dependencies again when rerun. The default setup and check do not install or import Docling. Its Python dependencies stay separate from the base checker's pins. The root commands forward arguments to setup and audit, so no extra Node dependency or root script is needed.

Select both vendors, or run Docling without OpenResume's semantic field extraction:

```sh
npm run resume:check -- --vendors openresume docling
npm run resume:check -- --vendors docling
```

The default remains `--vendors openresume`. The independent PDF.js, pypdf, and MuPDF text comparisons and page rendering run with either selection. Docling uses the full `StandardPdfPipeline` with `PdfPipelineOptions`, including the layout model, reading order, and table structure. OCR is disabled for digital resumes with embedded text. Scanned pages, image-only text, and broken text layers need a different OCR configuration, which this adapter does not expose.

Docling produces these files in the chosen output directory:

- `docling-document.json`: full exported Docling document, including structure and page provenance
- `docling.md`: Markdown export
- `docling-text.txt`: plain text export used in the shared paragraph coverage comparison
- `docling-items.json`: document items in iteration order, with hierarchy level, labels, text, and provenance where available
- `docling-run.json`: conversion status, errors, installed component versions, pipeline options, and artifacts from this conversion

The shared JSON and Markdown reports include Docling status and text coverage when selected. Docling does not assign resume employers, titles, or dates. Its paragraph coverage measures text preservation and cannot be interpreted as ATS field accuracy. Structured baseline checks belong to OpenResume and run only when OpenResume is selected. A selected vendor failure or partial conversion still writes a report and exits nonzero. Successful report generation does not mean the baseline matches or reading order is correct.

Use the artifacts list in `docling-run.json` to identify files generated by the current conversion. A reused output directory may retain files from earlier vendor selections or failed conversions. Choose a fresh `--output` directory when you need a separate record.

### Model downloads and offline use

Docling runs inference on this machine with remote services and external plugins disabled. The first conversion can download model weights from Hugging Face. Disabling remote services prevents remote inference, and does not disable model downloads. Installation alone does not prefetch models. Model licenses and initial download size depend on the pipeline components.

Docling normally reuses its Hugging Face model cache (usually `~/.cache/huggingface/hub`, configurable with Hugging Face environment variables). To populate that cache, run a selected Docling audit while online. Then request cached models only:

```sh
npm run resume:check -- --vendors docling --docling-offline
```

The offline flag sets `HF_HUB_OFFLINE=1` and `TRANSFORMERS_OFFLINE=1` for the Docling process before importing its libraries. Missing models cause a failed conversion, rather than a successful audit. This config uses local models and accepts only a local PDF path.

For a separate model directory, prefetch the layout and table models with the installed Docling utility, then pass that directory:

```sh
resume/ats-audit/.venv-docling/bin/docling-tools models download layout tableformer --output-dir /absolute/path/docling-models
npm run resume:check -- --vendors docling --docling-artifacts-path /absolute/path/docling-models --docling-offline
```

The utility's model directory and the automatic Hugging Face cache have different layouts. Pass the prefetch output directory through `--docling-artifacts-path`. Keep that directory outside published website assets and preserve it when transferring the checker to an offline machine. No resume is uploaded during model downloads.

The dependency pin and adapter follow the official [PyPI release](https://pypi.org/project/docling/2.148.0/), [pipeline options](https://docling-project.github.io/docling/reference/pipeline_options/), [Python SDK reference](https://github.com/docling-project/docling/blob/main/docling/.agents/skills/docling/references/python-sdk.md), and [model prefetch guidance](https://docling-project.github.io/docling/usage/advanced_options/).

## Maintenance

Node dependencies are pinned in the tool's package and lock files. Base Python dependencies are pinned in [the requirements file](/Users/alexbrodsky/GitHub/Portfolio/resume/ats-audit/requirements.txt). The optional direct Docling dependency is pinned separately in [requirements-docling.txt](/Users/alexbrodsky/GitHub/Portfolio/resume/ats-audit/requirements-docling.txt), with transitive versions recorded in each Docling run. Run setup again after dependency changes, adding `--with-docling` to update that environment.

Compile the adapter with:

```sh
npm run resume:build
```
