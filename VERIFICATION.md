# MIRA verification — 7 November 2026

## Passed

- `npx tsc --noEmit`: exit 0.
- `npm run lint`: exit 0, no warnings.
- `npm run test`: exit 0. Seed counts, engine determinism/diversity/exclusions, no evaluation copy, wear-log idempotence, garment deletion, snapshot retention, export round-trip and strict share validation passed.
- Production build through Sites `build-site.mjs`: exit 0, all application/API routes built.
- Engine: 20.5 ms on the 42-garment fixture, under the 80 ms target.
- Local share API: unauthorized writes rejected, cross-origin writes rejected, extra photo fields rejected, create/read/render/revoke/delete-all passed.
- Generated OG image decoded as a valid 1200×630 image.
- Browser flow at 390×844: four onboarding steps, sizes/style selection, capture into an empty personal wardrobe, ten-file review/confirmation, visible success, outfit acceptance and first history entry.
- Batch failure handling: unreadable image is flagged while a readable image can be confirmed. Background removal runs in a terminable worker with a four-second fallback.
- Wardrobe: combined category/color filters, editing, deletion and Undo verified.
- Reload persistence: swapped look, language and sizes verified.
- Export downloaded a JSON bundle containing all 53 test garments, 16 test wear records and the 11 uploaded fixture images. Backup parsed successfully.
- Complete deletion required typed `DELETE`, removed the local wardrobe, and remained empty after reload. A validated original demo backup restored 42 garments and 14 logs.
- Layout bounds: no horizontal overflow at 390×844, 768×1024 or 1440×900. The phone primary action is visible above bottom navigation.
- Local phone readiness measured at 356.70 ms. Development-only PerformanceObserver measured CLS 0.00021 after reserving loading space.
- Camera controls and access requests are absent at the user’s request.

## Measured contrast

| Pair | Ratio |
| --- | --- |
| Ink / paper | 16.76:1 |
| Secondary / paper | 8.65:1 |
| Metadata / paper | 5.01:1 |
| Metadata / inset | 4.63:1 |
| Primary text / oxblood | 8.33:1 |
| Worn text / sage | 5.08:1 |

## Limits of verification

These are local development measurements, not throttled-4G or field measurements. No real-device camera test was performed. A complete screen-reader audit, browser storage-quota fault injection, reduced-motion browser emulation, and a clean install on a second machine were not performed. Dialog focus management uses the shadcn/Radix primitive; its keyboard-accessible controls, Escape dismissal, and explicit focus restoration to the opening button were exercised. Reduced-motion CSS disables transitions/animations and visual transforms.

The fallback analyzer proposes deterministic attributes; it does not perform semantic image recognition. Personal storage does not sync across browsers. Optional model downloads can fail or exceed the time budget; the original photo remains usable. Shared URLs inherit the private Site’s access gate and do not expose anonymously crawlable previews.
