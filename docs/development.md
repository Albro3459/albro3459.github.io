# Development

A personal portfolio built with Astro and TypeScript. Project case studies, actual app screenshots, a downloadable resume, and a resume-focused design with blue accents and light and dark themes.

## Run locally

Requires Node.js 22.23.4 or newer and npm 9.6.5 or newer.

```sh
cd /Users/alexbrodsky/GitHub/Portfolio
npm install
npm run dev
```

Open http://localhost:4321. The site needs no credentials or external API services.

## Production build

```sh
npm run build
npm run preview
```

The build runs Astro’s TypeScript checks and generates eleven static pages: the homepage, nine project pages, and a custom 404 page. No server is required for deployment.

## Content and design

Project copy and metadata live in the typed project data module. The homepage contains experience and education content from the supplied resume. Global styles define the responsive layout and both themes. All fonts, screenshots, and the resume are served locally.

The homepage features CloudGateway, StreamTrack, Shelf, AI & Developer Tools, ClipboardHistory, and The Catch. The tools page groups CodeLaunch, br0wser, t3-profile, t3-thread, codex-thread, and the maintained VS Code Debugger MCP fork. Individual CodeLaunch, br0wser, and t3-thread pages remain available. CloudLaunch is covered in CloudGateway’s history. Wordle Archive Navigation links directly to its Chrome Web Store listing.

The project cards link to full case studies. Gallery buttons open accessible native dialogs with Escape support and focus restoration. Project filters use pressed button states, experience rows use native details elements, and reveal effects respect reduced motion. Core content and navigation work without JavaScript.

Public README screenshots are compressed to WebP. The original downloads remain in the ignored artifacts directory. Asset provenance and content sources are documented with the project.

## Browser review

With the production preview running on port 4321:

```sh
npm run capture
```

This opens a dedicated headed Chrome session, visits selected case studies, exercises the interactive controls, and saves desktop, dark-theme, and mobile screenshots with a JSON review report in the ignored artifacts directory. Chrome must be installed. This is a visual review utility, not a unit test suite.

To record a short walkthrough of the site, install Playwright’s video encoder once, then run the recorder with the preview server running:

```sh
npm run record:setup
npm run record
```

The recording is saved as a WebM in the ignored artifacts directory.

## Deployment

The public address is https://albro3459.github.io/. Astro’s `site` option sets this origin for canonical URLs and social previews. This is a user Pages repository, so there is no repository prefix in its URLs.

The deployment workflow runs on pushes to `main` and can also be started manually from GitHub Actions. It uses Node.js 24 and Astro’s official action to install dependencies, run the production build, and upload the static output. A separate deployment job publishes that artifact to GitHub Pages.

In the repository’s Pages settings, select **GitHub Actions** as the source. Branch publishing invokes Jekyll on the Astro source and fails because Astro frontmatter contains TypeScript.

Each deployed page includes a version meta tag combining the package version and Actions run number, such as `1.0.0+12`. Local builds use the package version. Deployment versions advance without creating version-bump commits or changing the lockfile. Favicon URLs include a build timestamp to refresh browser caches.

The origin remote is `git@github.com:Albro3459/albro3459.github.io.git`. Keep the resume and employment details current.
