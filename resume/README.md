# Resume

The editable Word source and exported PDF live together here:

- [Word document](/Users/alexbrodsky/GitHub/Portfolio/resume/Alexander-Brodsky-Resume.docx)
- [PDF](/Users/alexbrodsky/GitHub/Portfolio/resume/Alexander-Brodsky-Resume.pdf)

Edit the Word document and export a matching PDF with the same filename. Review the PDF layout and links before updating the site.

## Site integration

```sh
npm run resume:copy
```

This copies the source PDF to the portfolio's [public download](/Users/alexbrodsky/GitHub/Portfolio/public/Alex-Brodsky-Resume.pdf). The existing website links keep their current URL.

The copy runs automatically before `npm run dev` and `npm run build`. The GitHub Pages workflow uses the production build, so deployment receives the same PDF. A missing source PDF stops the copy and build instead of publishing an older version.

The build publishes the exported PDF without converting Word documents. Word and PDF files must be updated together. If a development server is already running, run the copy command again after replacing the PDF.
