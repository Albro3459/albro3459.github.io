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

OpenResume comes from [xitanggg/open-resume](https://github.com/xitanggg/open-resume) through the [git submodule](/Users/alexbrodsky/GitHub/Portfolio/resume/ats-audit/vendor/open-resume). This repository records the upstream commit, initially `4f8255a2c763479837f69f1dccf2a3338730cd79`, instead of storing copies of its source files. Reports include the checked-out upstream commit. Its grouping and field-extraction source is unchanged. The local adapter loads PDF.js in Node and maps text items as upstream does. It enables font metadata on current PDF.js and preserves PDF item order. A small shim supplies the same default skill values without loading the Redux application.

PDF.js is newer than the upstream application's dependency, so results may differ from the hosted OpenResume playground. Three text extractors are not three ATS parsers. OpenResume documents support for single-column English resumes. Passing local checks cannot guarantee the same result in Workday, Greenhouse, Lever, or another employer's ATS, and says nothing about ranking or hiring decisions.

All parsing and rendering runs locally. There are no API keys, model services, or resume uploads. Dependencies require internet access during installation. Reports and local dependencies are ignored by git and are outside the website's published assets.

## Maintenance

Node dependencies are pinned in the tool's package and lock files. Python dependencies are pinned in [the requirements file](/Users/alexbrodsky/GitHub/Portfolio/resume/ats-audit/requirements.txt). Run setup again after dependency changes.

Compile the adapter with:

```sh
npm run resume:build
```
