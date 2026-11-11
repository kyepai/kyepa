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
- `weddings/` — "KYEPA Ceremonies" at `/weddings/`: queer-first weddings,
  with every couple welcome. Same self-contained shape as `mgw/` and
  `styling/`. **The reading copy says "ceremonies", not "weddings"** — the
  one phrase that keeps the older word is "queer-first weddings", which is
  the positioning. The exceptions are strings only a machine reads (the
  `<title>`, the meta descriptions, `serviceType` in the structured data),
  which keep "wedding planner" because that is what people search for.
  The directory and URL stay `/weddings/`; only the words changed.
  Its three `WEDDING_*_STATUS` switches each drive five things at once (the
  badge, the card styling, the button label, the form's preselected option,
  and whether the service is published in the structured data) — change the
  switch, never the five. The legal section deliberately makes no legal
  claims, and the SAFE Harbour seal stays hidden until the training is real.
- `awareness/` — an unlisted page whose copy is AES-256-GCM ciphertext in
  `content.json`. The key is never in this repo: it lives in the fragment of
  the link, which browsers do not send to servers. The repo is public, so a
  secret path would protect nothing — this is why it is encrypted rather than
  merely unlinked. Changing the copy or rotating the key means re-encrypting;
  the plaintext is not stored here. It is also the one page that does NOT
  work from `file://`, because Web Crypto needs https or localhost.
- `styling/` — the "Styled in Motion" styling service line at `/styling/`.
  Same shape as `mgw/`: a config file holds every string and price, a
  renderer builds the page, and a stylesheet layers on top of `style.css`.
  Client quotes live in their own `styling.testimonials.js`. See its README.
  Two rules there are worth keeping: a testimonial marked `placeholder` is
  labelled as one on the page **and** excluded from the structured data, and
  the urgency banner is driven by a real date that removes it automatically.
  Don't replace either with an invented quote or a resetting countdown.

## Working with this repo

- **No build step.** Either open `index.html` straight from disk, or serve the
  directory (`python3 -m http.server`, then <http://localhost:8000/>).
- **Keep asset paths relative, not root-absolute.** Both working from disk and
  being served has to keep working, so `href="/mgw/mgw.css"` is wrong —
  `file://` resolves it to the filesystem root and it silently fails to load.
  Paths are relative to the referencing file. `mgw/mgw.js` resolves its own
  asset URLs against `document.currentScript.src` for the same reason, since
  it is loaded from two different directory depths.
- There is no linter, formatter, or test runner. Don't assume `npm`/`node`
  tooling exists — `.gitignore` has boilerplate Node entries but there is no
  `package.json`.
- Keep new pages and styles consistent with the existing plain HTML/CSS
  approach unless the user asks to introduce a framework or bundler.

### Conventions worth matching

- **There is one shared `<nav class="site-nav">`**, hand-written into each
  page's HTML (there is no templating). It is a **sibling of `.hero`, never
  a child** — the hero is a full-viewport `role="button"`, so a nav nested
  inside it would send every nav click into the Offers modal. Its plate
  fades in with `--progress`. Add a page to the site and you add its link to
  this list in both `index.html` and `styling/index.html`.
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
- **Watch specificity against `style.css`.** `.content p` (0-1-1) and
  `.content p + p` (0-1-2) set colour and margins on every paragraph inside
  `<main class="content">`. A single-class rule like `.my-thing` (0-1-0)
  silently loses to them, which reads as "my CSS did nothing". Prefix the
  selector (`.styling-content .my-thing`) rather than reaching for
  `!important` — `styling/styling.css` does this throughout and explains why.
- **Forms post off-site or not at all.** There is no server and no build
  step, so no environment variable can ever be substituted in. The waitlist
  form in `styling/` posts to a public Formspree endpoint committed in the
  config, and falls back to a pre-filled `mailto:` when that is unset. Do
  not add anything to this repo that needs a real secret.
- **`TODO(Kyle):` comments** mark content the user still needs to supply or
  verify. There are a few in `index.html`, including a commented-out
  placeholder testimonials section. Leave them alone unless asked.

### Assets

Site assets sit flat at the repo root (`logo.svg`, `Portrait2.jpg`,
`background.mov`, `background2.mov`) with two exceptions:

- `book-covers/` — the five cover images actually used by the Reading List
  modal, with short filenames (`hwt.jpg`, `tes.jpg`, …).
- `assets/mgw/` — campaign image slots.
- `assets/styling/` — image slots for the styling page. Does not exist yet:
  every slot on that page currently renders a labelled placeholder.

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
