# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Coolify Air Condition** — Klimaanlage Installation, Reparatur und Wartung.  
Two standalone HTML files, no build system, no dependencies beyond Google Fonts (CDN).

| File | Purpose |
|------|---------|
| `bandguide.html` | Main bilingual (DE/EN) service website — the live-facing page |
| `coolify-brandguide.html` | Internal brand guide — reference for colors, fonts, tone, logo rules |

Open either file directly in a browser to preview. There are no build, lint, or test commands.

## Brand Tokens

Both files share the same CSS custom properties. Never introduce colors outside this palette:

| Token | Hex | Role |
|-------|-----|------|
| `--ice` | `#0AEFFF` | Ice Blue — primary accent, headlines |
| `--neon` | `#B8FF00` | Neon Lime — CTAs, highlights |
| `--deep` | `#04101A` | Deep Freeze — page background |
| `--navy` | `#081E2F` | Arctic Navy — card/section backgrounds |
| `--frost` | `#C8F7FF` | Frost — body text |
| `--white` | `#F0FAFF` | Off-white — headings on dark |
| `--mid` | `#1A3A52` | Mid — subtle borders |
| `--red` | `#FF4545` | Error / "don't" states |

**Fonts** (Google Fonts, already linked):
- `Black Han Sans` — all headlines and display text, always caps or title-case
- `Space Grotesk` — body copy and UI text
- `Space Mono` — labels, tags, technical info, always uppercase with letter-spacing

**Logo icon:** SVG snowflake with 8 arms — Ice Blue horizontal/vertical bars, Neon Lime diagonals, Ice Blue center dot. Defined inline in `bandguide.html` navbar; replicate exactly when reusing.

## i18n Architecture (`bandguide.html`)

All user-visible strings live in the `T` object (top of `<script>`):

```js
const T = { de: { key: 'Text' }, en: { key: 'Text' } }
```

- Add a key to **both** `de` and `en` before using it.
- Apply to elements with `data-i18n="key"` (sets `innerHTML`) or `data-i18n-ph="key"` (sets `placeholder`).
- `setLang(l)` iterates all `[data-i18n]` elements and replaces their content; it is called on `DOMContentLoaded` to initialise as German.
- `document.documentElement.lang` is set to `'de'` or `'en'`, which drives the CSS rule `[lang="de"] .en { display: none !important }` — English-only inline elements use class `en`.

**Rule:** German is the primary language. Elements that should only appear in English mode get class `en`. Never hard-code visible English text outside of `en`-classed elements or the `en:{}` branch of `T`.

## Chatbot Architecture (`bandguide.html`)

Response strings live in the `BOT` object, parallel to `T`:

```js
const BOT = { de: { greeting, contact, emergency, install, repair, maintenance, price, default, suggestions[] }, en: { … } }
```

`resolveResponse(lowerCaseInput)` matches keywords defined in the `kw` object to a response key. To add a new topic: add a key to `BOT.de` and `BOT.en`, add keyword triggers to `kw.de` and `kw.en`.

Contact details shown in bot responses: **spassvogel@gmail.com** · **0123 456 789**

## Tone of Voice

Taken directly from `coolify-brandguide.html` — enforce this when writing any copy:

- **Frech & direkt** — say what others think, no corporate filler
- **Kälte-Metaphern** — position cold air as the solution to every problem
- **Kein Fachjargon ohne Erklärung** — technical terms are fine if immediately clear in context
- Avoid: warm colors, generic stock-photo language, overly formal register

## Contact Details

- Email: `spassvogel@gmail.com`
- Phone: `0123 456 789`

These appear in the contact section, footer, and chatbot responses. Keep them consistent across all three locations when updating.
