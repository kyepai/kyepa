# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Kyepa is the personal site of Kyle Patrick ("Kyepa"), a Sint Maarten-born
dance and movement artist working as a "Life Experience Designer". It is a
static site: plain HTML, CSS and JavaScript with **no build tooling, package
manager, framework, or test suite**.

- `index.html` — the whole main site, a single long-scroll page: a video-backed
  hero, prose sections, and four reveal modals.
- `style.css` — all styles for the main page.
- `script.js` — all behaviour for the main page.
- `mgw/` — the self-contained "GREENLIT" Mr Gay World 2026 campaign (a pop-up
  on the homepage plus a standalone route at `/mgw/`). See the README.

## Working with this repo

- **No build step.** Serve the directory from the repo root:
  `python3 -m http.server`, then open <http://localhost:8000/>.
- **Opening `index.html` directly via `file://` no longer works fully.** The
  campaign assets are referenced by root-absolute paths (`/mgw/mgw.css`), which
  only resolve when served. Use a server.
- There is no linter, formatter, or test runner. Don't assume `npm`/`node`
  tooling exists — `.gitignore` has boilerplate Node entries but there is no
  `package.json`.
- Keep new pages and styles consistent with the existing plain HTML/CSS
  approach unless the user asks to introduce a framework or bundler.

### Conventions worth matching

- **Modals are native `<dialog>` elements** opened with `.showModal()`. Every
  one follows the same pattern in `script.js`: a trigger listener, a close-button
  listener, and a backdrop click handler that closes when `event.target` is the
  dialog itself. The four are `books-modal`, `movement-modal`,
  `techno-reclamation-modal` and `offers-modal`. Reuse this pattern rather than
  building custom overlays — it gives a focus trap and Escape handling for free.
- **Triggers that wrap a heading are `role="button"` divs**, not real buttons,
  so they need an explicit `keydown` handler for Enter/Space alongside `click`
  (see `#movement-trigger`). Inline text triggers use
  `<button class="inline-link-button">` instead.
- **Scroll position is exposed to CSS as `--progress`** (0→1 over the first
  viewport height), set by `updateScrollProgress()` in `script.js`. It drives
  the blur layer crawling up over the background video and the hero copy being
  pushed out of view. Prefer extending this over adding new scroll listeners.
- `style.css` uses a `*` reset and BEM-ish `--modifier` class names. It has
  **no CSS custom properties for design tokens** and **no web fonts** — the
  main page is `system-ui` throughout. (The campaign in `mgw/` is the exception
  and defines its own scoped tokens and Google Fonts.)
- **`TODO(Kyle):` comments** mark content the user still needs to supply or
  verify. There are a few in `index.html`, including a commented-out
  placeholder testimonials section. Leave them alone unless asked.

### Assets

Site assets sit flat at the repo root (`logo.svg`, `Portrait2.jpg`,
`background.mov`, `background2.mov`) with two exceptions:

- `book-covers/` — the five cover images actually used by the Reading List
  modal, with short filenames (`hwt.jpg`, `tes.jpg`, …).
- `assets/mgw/` — campaign image slots.

Some files at the root are **not referenced by the site** and should be left
alone: `portrait.jpg`, `Kyle_Patrick_CV_2026.pdf`, and the `book covers/`
folder (note the space — these are the raw downloads; the site uses the
hyphenated `book-covers/`).

## Other files

- `kyepa_texts_draft_2_new_sections.md`, `kyepa_texts_draft_3_bullets_1-3.md`,
  `kyepa_das_techno_team_involvement.md` — source notes and drafts for the
  site's prose. Working material, not documentation of the code.
- `shortcut.md` — a standalone keyboard-shortcuts reference for a beginner
  programmer. Learning material, unrelated to the site.

## Content and tone

The site's prose is written in the user's own voice: long-form, frank, warm,
a little camp. When editing copy, match the surrounding register rather than
flattening it into marketing language. The campaign in `mgw/` keeps all its
strings in `mgw/mgw.config.js` rather than in markup.

## Git workflow

- The user is a novice programmer — explain git/CLI actions in plain terms as
  you make them.
- The user has pre-authorized committing and pushing to `origin/main`
  automatically once a unit of requested work is complete, without waiting for
  explicit confirmation each time. Still surface what was committed/pushed
  afterward. This does not extend to destructive operations (force-push,
  reset --hard, etc.) — confirm those as usual.
- Several files are staged or untracked at the root from the user's own work
  (drafts, CV, portraits). When committing, **limit the commit to the paths you
  actually changed** (`git commit -m "..." -- <paths>`) so unrelated staged
  work isn't swept in.
