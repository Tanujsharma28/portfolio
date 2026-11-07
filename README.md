# Anubhav portfolio (Next.js)

Next.js (App Router) + TypeScript + Three.js. No UI library, no CSS framework.

## Run it

You need Node.js 18.18 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Make it yours

Everything the visitor reads is in one file: `src/data/profile.ts`.

- Replace the plain placeholder lines with your own facts: the month and year of each attempt,
  what you changed between them, firms or articleship, tools you really use.
- Put a photo in `public/` (for example `public/photo.jpg`) and set `photo: '/photo.jpg'`.
- Replace the placeholder email, phone and LinkedIn in `contact.rows`.

Real, specific details are what stop a portfolio from looking generic.

## How it is put together

```
src/
  app/            layout, page, global styles
  components/
    Scene.tsx     the 3D galaxy (Three.js, custom shader)
    Effects.tsx   cursor, glyph trail, letter push, magnetic buttons, scroll story
    TrialBalance  the corner counter that closes to zero
    Hero, Journey, Skills, Contact, Nav, Stamp, Tilt, SplitText, CopyButton
  data/profile.ts all of the text
  lib/world.ts    shared state between the scene and the effects
```

## Deploy

Push to GitHub and import the repo in Vercel. No settings needed.
