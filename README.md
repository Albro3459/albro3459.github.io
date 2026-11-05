# Alexander Brodsky’s portfolio

Projects, work experience, education, and contact information.

[Website](https://albro3459.github.io) · [Resume](https://albro3459.github.io/Alexander-Brodsky-Resume.pdf)

The project has two areas:

- [Website](/Users/alexbrodsky/GitHub/Portfolio/website): Astro site, website scripts, assets, and development docs
- [Resume](/Users/alexbrodsky/GitHub/Portfolio/resume): Word and PDF documents, resume notes, and the ATS audit tool

The root package provides commands for both areas. Their dependencies and generated files stay in their own directories.

To work on the website:

```sh
npm run website:setup
npm run dev
npm run build
```

To check resume parsing:

```sh
npm run resume:setup
npm run resume:check
```

[Website development](/Users/alexbrodsky/GitHub/Portfolio/website/docs/development.md) · [Resume checker](/Users/alexbrodsky/GitHub/Portfolio/resume/ats-audit/README.md)
