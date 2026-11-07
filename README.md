# MIRA

Your mirror has opinions. A private, mobile-first wardrobe companion, built for Sites with Vinext, React, TypeScript and Tailwind.

## Run locally

Requires Node 22.13+ and npm. No environment file, keys, or external service is needed for the seeded wardrobe, recommendations, capture suggestions, history, settings, or export.

```sh
npm install
npm run dev
```

The local URL is printed by the development server. The first visit creates 42 original illustrated garments and 14 historical looks on this browser. “Start my wardrobe” clears the sample closet and opens capture. Deleted data is never automatically re-seeded. Use another browser profile for a fresh demo.

```sh
npx tsc --noEmit
npm run lint
npm run test
npm run build
```

`npm run db:reset` resets the local share database only. It does not remove browser data; use Settings for that. To test sharing locally, visit `/signin-with-chatgpt?return_to=/today` to use the Sites development identity, then apply local D1 migrations as described below. Hosted authentication is managed by Sites.

## Architecture

- `components/mira-app.tsx` implements the mirror, onboarding, capture, wardrobe, look history and settings.
- `lib/model.ts` defines validated records and pure mutations. `lib/repository.ts` provides an asynchronous IndexedDB repository. Photos are normalized and kept with garment records; wear-history images become illustrations to avoid duplicating personal photos.
- `lib/engine/` ranks at most 5,000 combinations using weather, occasion, CIELAB color harmony, recency, affinity and novelty. Ranking values never reach the interface. Three returned candidates differ by at least two pieces when possible.
- `lib/capture.ts` hashes image bytes and derives repeatable proposed tags; filename hints help common categories. This is not semantic vision. Suggestions are editable before bulk confirmation. Duplicate image bytes do not create duplicate garments. Background removal runs in the browser, with a four-second original-image fallback. Its optional WASM/model download requires a network connection; no photo is sent to that service.
- D1 stores explicit share snapshots only: illustrated garment attributes, context and reasons. It stores the Sites owner ID separately to authorize revocation. Shared payloads and pages exclude that ID. R2 is unused.
- Share routes validate strict schemas, require same-origin writes and Sites identity, and bound share creation per identity. The token page and 1200×630 Open Graph endpoint inherit the owner-private Sites gate. Private links are not anonymously crawlable previews.

## Privacy and recovery

Personal data belongs to this origin and browser profile, with no cross-device synchronization. Clearing browser storage removes it. Settings exports a complete JSON backup including photo data and can restore a validated backup. Keep exported files private. Storage errors preserve the existing record and provide a retry path.

“Delete everything” requires typing `DELETE`, revokes known server shares, replaces the entire local record with an empty personal wardrobe, removes the locale cookie. If shared links cannot be revoked, deletion reports failure so it cannot falsely claim complete removal.

English and Simplified Chinese interface labels are selectable in Settings. Garment names remain the names the user supplied. Original demo garment illustrations are bundled under `public/seed/`. Fonts are served locally; source and license information is in `public/fonts/`.

## Sites build and database

The tracked hosting manifest declares the existing Site ID, `d1: "DB"`, and no R2 binding. Preserve the supplied Sites build integration and runtime helpers. Schema migrations are generated with `npm run db:generate`; Sites applies them during publication.

For local D1 testing, build first, then apply the generated SQL with:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_silky_luke_cage.sql
```

Use the actual generated migration filename if it differs. Local and hosted databases are separate.

## Optional provider seams

Camera access is deferred. Use a photo upload or the neutral silhouette. Generative try-on, cloud vision, live weather and voice are disabled. No secrets are configured. `lib/types/future.ts` defines the try-on provider and job interface. A real vision adapter would replace local tag proposals, require an explicit consent gate, validate returned attributes, and keep selfies device-only. Do not activate remote photo processing merely because a key exists. A durable job queue and real provider are future work, rather than simulated successful jobs.

## What I would build next, and what I would remove

I would improve capture first: better on-device garment recognition, clearer cutout alignment, and a quick way to mark an item unavailable. Those changes make tomorrow’s decision better without asking users to manage another app. I would remove generative try-on before adding social features; a trustworthy, fast recommendation from clothes people actually own matters more than a synthetic image.
