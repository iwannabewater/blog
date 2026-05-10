# Luowen Design Contract

Luowen (`落文`, `luò wén`) uses a warm editorial notebook direction: quiet paper, ink-blue structure, visible craft, and fast access to writing. The design should feel authored, not themed.

## Theme

- Canvas: warm parchment, never pure white.
- Accent: ink blue, used for links, progress, active navigation, and structural marks.
- Surfaces: shallow paper layers with warm borders and low shadows.
- Motion: short opacity/transform reveals, disabled by `prefers-reduced-motion`.

## Typography

| Layer | Font | Rule |
| --- | --- | --- |
| Brand | `YRDZST-Regular` | Only the `落文` wordmark |
| Chinese display | `LXGW WenKai` | Hero, short lines, and Chinese display moments |
| English and mixed headings | `Charter` with CJK fallback | Research-note authority without a product-marketing voice |
| Body | `Charter` with `LXGW WenKai` fallback | Reading comfort over density |
| UI | `Comic Neue` with CJK fallback | Small controls and tags only |
| Slogan | `Caveat` | The single handwritten English slogan |
| Code | `JetBrains Mono` with CJK fallback | Code, filenames, and inline snippets |

## Layout

- The home page should orient, show the current issue, expose the system, then list writing.
- Cards are allowed only for repeated items or explicit paper notes.
- Article pages keep a narrow reading column and expose metadata before prose.
- Search, RSS, tags, and archive remain first-class navigation paths.

## Interaction

- Theme control cycles system, light, and dark without layout shift.
- Article pages show a top reading progress bar.
- Cards and tiles move at most one pixel on hover.
- Scroll reveal is progressive CSS. Static rendering remains the fallback.

## Do Not

- Do not introduce a generic purple-blue gradient.
- Do not use decorative cards to fill space.
- Do not add a client runtime feature unless it improves reading or navigation.
- Do not add a font family without assigning it a narrow role.
- Do not bypass `pnpm lint`, `pnpm format:check`, and `pnpm build`.
