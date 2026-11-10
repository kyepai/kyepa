# Styling consultations — `/styling/`

"Styled in Motion", the styling service line. Lives entirely in this folder
plus whatever images you drop into `assets/styling/`.

Open `styling/index.html` from disk, or serve the repo
(`python3 -m http.server`) and go to <http://localhost:8000/styling/>, which
is the closer match to the live `kyepa.com/styling/`.

---

## Everything you edit is in one file

**`styling.config.js`.** Prices, offer wording, the five method steps, case
studies, FAQ answers, the reel link, the form destination. Save the file,
reload the page — there is no build step.

The only copy *not* in there is the browser-tab title, the search-results
description and the share-card text. Those sit in the `<head>` of
`index.html`, clearly commented, because a search engine has to read them
without running any JavaScript.

`styling.js` builds the page from the config and `styling.css` styles it.
Neither contains a word a visitor reads, so you should not need to open
either to change the page's content.

### Change a price

```js
{ name: "Style Sprint", price: "From €250", … }
```

Anything goes in `price` — "From €250", "€450", "Ask me". The structured
data Google reads is generated from the same line, so the two can never
disagree. A price with no number in it (like "Ask me") is simply published
without a price attached.

### Add a case study

Copy a block in `portfolio.cards`:

```js
{
  title: "The piece",
  initials: "ABC",          // shown on the placeholder tile until there is a photo
  thinking: "One line on the thinking behind it.",
  image: "",                // "../assets/styling/something.jpg"
  alt: "",                  // describe the photo for screen readers
  detail: "Longer text. Leave empty and the card simply doesn't open."
}
```

A card with `detail` becomes a button that opens a modal; one without is a
plain tile. Cards with no `image` show a labelled placeholder rather than a
broken image, so you can publish before the shoot.

### Drop in the reel

Paste any reel or post URL from @kye_pa into `REEL_URL` — the long
`?utm_source=…` tail is fine, it gets ignored. It embeds through Instagram's
own `/embed/` route, which renders in a plain iframe, so **no Instagram
JavaScript and no third-party tracking is added to the site**. While
`REEL_URL` is empty the slot shows a marked placeholder.

---

## The waitlist form

Out of the box the form works but does not collect anything centrally: on
submit it opens the visitor's own email app with their answers filled in,
addressed to info@kyepa.com. Nothing is lost, but they have to press send,
and some people won't.

To collect submissions properly:

1. Create a free form at [formspree.io](https://formspree.io) and point it at
   **info@kyepa.com**.
2. Copy the endpoint it gives you — it looks like
   `https://formspree.io/f/abcdwxyz`.
3. Paste it into `FORM_ENDPOINT` in `styling.config.js`.
4. In Formspree's own settings, restrict the form to the domain `kyepa.com`
   so nobody else can post to it, and turn on its spam filtering.

The form then posts in the background and answers inline with
"You're on the list…" without a page change. If the network drops, it says
so and keeps everything the visitor typed.

### About "use environment variables"

This is worth being straight about: **this site cannot use environment
variables.** There is no build step and no server — the browser loads these
files exactly as they sit in the repo, so there is nothing anywhere that
could substitute a secret in before the page reaches a visitor.

That is fine here, because a Formspree endpoint is **not a secret**. It is a
public address, the same as an email address on a contact page: it ships in
the HTML of every site that uses Formspree, and anyone can read it by
viewing source. Committing it is normal and safe. What protects it is the
domain restriction and spam filtering in step 4 above, not secrecy.

If this ever grows into something that *does* need a real secret — a paid
API, a database write — that needs a server or a serverless function, and
the secret lives there, never in this repo. Worth saying out loud before it
comes up.

Nothing in this folder contains a key, a token, or a password.

---

## A few deliberate choices

- **The GREENLIT campaign pop-up is not loaded here.** It opens on every
  visit on the homepage, and a Mr Gay World intro film playing over a styling
  page would bury the thing the visitor came for. The campaign stays on the
  homepage and at `/mgw/`.
- **The homepage's `script.js` is not loaded here either.** It hands the
  background over to a second video partway down the page, and this page
  carries only one (the lighter of the two — most visitors arrive from
  Instagram on a phone). `styling.js` sets the scroll variable itself.
- **The FAQ is `<details>`/`<summary>`.** A native accordion: keyboard-
  operable and working with JavaScript off, with no script of our own.
- **Paths are relative, never root-absolute**, so the page works both opened
  from disk and served. See the main `CLAUDE.md`.

---

## Still to supply

- [ ] **Hero image or video** — `strings.hero.media`, plus `mediaAlt`
- [ ] **Case-study photos** — `portfolio.cards[].image` and `alt`
- [ ] **The Malta title** — confirm the exact name and year, in both
      `portfolio.cards` and `credentials`
- [ ] **The reel URL** — `REEL_URL`
- [ ] **Final prices** — confirm the four in `offers.items`
- [ ] **Formspree endpoint** — `FORM_ENDPOINT`, see above
- [ ] **Share card** — `assets/styling/og.jpg`, 1200×630, referenced from
      `index.html`. Until it exists, shared links preview without an image.

Everything above is marked `TODO(Kyle):` in the config too.
