# మాట • Maata — Telugu-English Tutor

A local-first, Telugu-friendly English practice app built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, Zustand, and Dexie. Progress stays in this browser; no account or hosted backend is required.

## Run locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. For a production build, run `npm run build` and `npm run preview`.

## Deploy free

- **Netlify:** connect the repository, set build command to `npm run build` and publish directory to `dist`. `public/_redirects` configures SPA routes.
- **Vercel:** import the repository, use the Vite preset, build command `npm run build`, and output directory `dist`.
- **GitHub Pages:** set Vite's `base` to the repository path and deploy `dist` with a static hosting action. BrowserRouter routes need a Pages fallback; Netlify or Vercel is simpler for this app.

## Checks

```powershell
npm test                 # transliteration, matching, and spaced repetition
npm run content:check    # validates the local phrase dataset
npm run lint
npm run test:e2e         # Playwright journey smoke test (Chromium required)
```

Install Playwright's Chromium once before running the browser test: `npx playwright install chromium`.

## Project map

- `src/features/` — welcome, dashboard, typing studio, spelling, grammar, speaking, games, stories, family progress, and settings.
- `src/lib/transliteration/engine.ts` — offline Romanized Telugu to Telugu Unicode conversion.
- `src/lib/repetition/sm2.ts` — spaced repetition scheduling.
- `src/store/progress.ts` — persisted progress, preferences, XP, streak, and review notebook.
- `src/lib/storage/db.ts` — local IndexedDB answer history and review cards.
- `src/content/` — phrase, vocabulary, grammar, dialogue, and story JSON datasets.
- `public/sw.js` — app-shell service worker for offline revisits after the first successful load.

## Add practice content

Edit the JSON arrays in `src/content/`. A phrase should include non-empty `telugu`, `telish`, `english`, and `audio_text` strings; it may also include a `level`, `category`, and bilingual `hint_parchment`. Vocabulary entries use `word`, `telugu`, `roman`, `english`, `audio_text`, `theme`, and `example`. Grammar entries include `title`, `telugu`, `english`, `pattern`, `question`, `options`, `answer`, and `example`. Run `npm run content:check` after changing content.

## Notes

The browser's installed speech voices and speech-recognition support vary by device and browser. The app remains usable without them. The Family PIN is a convenience gate stored locally, not account security. Content is starter material intended to be reviewed with a Telugu-English speaker before using it as formal instruction.
