# Resume

The editable Word source and exported PDF live together here:

- [Word document](/Users/alexbrodsky/GitHub/Portfolio/resume/Alexander-Brodsky-Resume.docx)
- [PDF](/Users/alexbrodsky/GitHub/Portfolio/resume/Alexander-Brodsky-Resume.pdf)

Edit the Word document and export a matching PDF with the same filename. Review the PDF layout and links before updating the site.

## Site integration

The [static file endpoint](/Users/alexbrodsky/GitHub/Portfolio/website/src/pages/Alexander-Brodsky-Resume.pdf.ts) publishes the PDF at [Alexander-Brodsky-Resume.pdf](https://albro3459.github.io/Alexander-Brodsky-Resume.pdf). Visitors can view it in their browser's PDF viewer and download it with the original filename.

During development, the endpoint reads this PDF on each request. The production build writes it into the ignored build output, so only this source PDF is committed. A missing source PDF fails the build. The GitHub Pages workflow uses the same production build.

The build publishes the exported PDF without converting Word documents. Word and PDF files must be updated together.

## Parsing review

From the repository root, install the local checker with `npm run resume:setup`, then run `npm run resume:check` after exporting a new PDF. It compares PDF text with the Word source and checks OpenResume's structured fields against the intended resume data. For an optional Docling layout and text comparison, install with `npm run resume:setup -- --with-docling`, then run `npm run resume:check -- --vendors openresume docling`. The default check runs OpenResume alone.

See [the checker documentation](/Users/alexbrodsky/GitHub/Portfolio/resume/ats-audit/README.md) for setup, supported checks, and limitations. Reports go to [the ignored artifacts directory](/Users/alexbrodsky/GitHub/Portfolio/resume/artifacts/ats-audit/current). The tool is maintained with this project and runs separately from the website build.

Resume preparation notes live in the [ignored TODO directory](/Users/alexbrodsky/GitHub/Portfolio/resume/TODO).
