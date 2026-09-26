# Personal portfolio

React + Vite + Tailwind CSS. Responsive, with project detail dialogs, reduced-motion support, and local CSS illustrations (no image downloads or remote fonts required).

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To build: `npm run build`. To inspect that build: `npm run preview`. Deploy the generated `dist/` folder to any static hosting provider.

## Edit your content

Everything is in **`src/data/portfolio.js`**:

- **Name and personal details:** change `name`, `initials`, `role`, `education`, `institution`, and `status`.
- **Hero:** change `headline` (use `\n` for a line break) and `summary`.
- **About:** change `about` and `internship`.
- **Contact:** set `email` to your email address and `github` / `linkedin` to full profile URLs.
- **CV:** place your PDF in `public/`, e.g. `public/my-cv.pdf`, then set `cvUrl: '/my-cv.pdf'`.
- **Skills:** edit the `skills` groups and their `items`. These are suggestions based on the supplied projects; review them before publishing.

Empty URLs remain clearly unavailable and never navigate to fake destinations. Replace “Your Name” and missing contribution text before publishing. Project descriptions are starting-point summaries, not claims of measured results.

## Edit or add projects

Edit an object in `projects`, or copy it to the end of the array. Use a unique `id` and supply:

```js
{
  id: 'new-project',
  name: 'My new project',
  category: 'Internship project',
  theme: 'blue', // blue, green, purple, pink
  visual: 'dashboard', // dashboard, grocery, network, flowers
  description: 'A short description for the project card.',
  technologies: ['React', 'Spring Boot'],
  role: 'My role',
  problem: 'The problem this project addresses.',
  solution: 'What the project does and how it works.',
  contribution: 'Exactly what I personally built or tested.',
  screenshots: [
    { src: '/projects/new-project.png', alt: 'Project dashboard showing the main workflow' },
  ],
  github: '', // Full repository URL, or leave empty.
  live: '', // Full live demo URL, or leave empty.
},
```

Put that image in `public/projects/new-project.png`. The first screenshot becomes the card preview; all screenshots appear in the detail dialog. With no screenshots, an explicitly labeled concept illustration appears. Cards and numbering update automatically when projects are added.

Layout and components: `src/main.jsx`. Colors, spacing, typography, and responsive styles: `src/styles.css`. Browser title, search description, and social preview text read your `name`, `role`, and `summary` automatically. Production HTML includes this metadata without requiring JavaScript.

## Verify changes

Run `npm test` for desktop/mobile navigation, dialog dismissal and focus return, keyboard access, and reduced-motion checks. Tests use an installed Google Chrome browser and automatically start Vite if needed. Run `npm run build` for the production check.

The content tests also substitute example data in the test browser to verify personal details, working links, screenshots, and an additional project. They do not change your data file.

Run `npm run test:production` to build and run the navigation, mobile, and keyboard tests against the actual production bundle. The preview server starts and stops automatically.

## Prepare and publish

1. Replace `Your Name` and `YN` in `src/data/portfolio.js`. Update your summary, contact links, and skills.
2. Add your CV and screenshots to `public/`, then reference them in the same data file. Use exact filename capitalization for hosting on Linux.
3. Add your own UrbanFresh and Blossom Hut contributions. Leave unavailable URLs as empty strings.
4. Run `npm test`, then `npm run build`.
5. Run `npm run preview` and open the printed URL to inspect the production build. Check your actual CV download and external links.
6. Upload `dist/` to a static host serving the website at the domain root. For a Git-connected static host, use `npm run build` as the build command and `dist` as the output directory.

Rebuild and redeploy after changing content. The generated `dist/` folder is disposable; edit source files instead. No backend, API keys, or environment variables are needed. Contact opens the visitor’s email application. Subdirectory hosting requires configuring Vite’s base and asset URLs before deployment.
