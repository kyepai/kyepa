# Styling consultations — `/styling/`

"Styled in Motion", the styling service line.

The page talks to **one person first**: a queer man stepping onto a stage —
a pageant delegate, a performer, someone becoming publicly visible — who
wants to look unforgettable and move like he owns it. Everyone else is
welcome and the copy never shuts them out, but when a sentence has to
choose, it chooses him. Keep that in mind when editing.

Open `styling/index.html` from disk, or serve the repo
(`python3 -m http.server`) and go to <http://localhost:8000/styling/>, which
is the closer match to the live `kyepa.com/styling/`.

---

## The two files you edit

**`styling.config.js`** — prices, offer wording, the five method steps, case
studies, FAQ answers, the banner, the lead magnet, the reel link, where the
form sends to.

**`styling.testimonials.js`** — client quotes, in their own file because
that is the list that should keep growing.

Save either and reload. There is no build step.

The only copy *not* in those two files is the browser-tab title, the
search-results description and the share-card text, which sit in the
`<head>` of `index.html` because a search engine has to read them without
running JavaScript.

`styling.js` builds the page and `styling.css` styles it. Neither contains
a word a visitor reads.

---

## The offer ladder

Four cards, in `offers.items`, read as a ladder: **Start here** →
**Do it yourself** → **Done with you** → **Done for you**.

| Field | What it does |
| --- | --- |
| `tier` | Small label above the name |
| `price` | Anything — "From €250", "Price TBC", "Ask me" |
| `priceNote` | Small line under the price, e.g. payment plans |
| `badge` | Pill on the card, e.g. "Coming soon" |
| `meta` | Duration / format line |
| `bonuses` | What's included on top |
| `cta` | Button label; falls back to `ctaDefault` |

Every button scrolls to the form **and preselects that offer** in its
dropdown, so nobody answers a question their click already answered.

A bonus with `caseStudy: "pelican"` becomes a link that opens that lookbook
card — the claim arrives with its evidence attached. The id must match an
`id` in `portfolio.cards`.

A price with no digits in it ("Price TBC", "Ask me") is simply published
without a price in the structured data, rather than guessing a number.

### Two parked offers

**Stage & Event Styling** (from €500) and the **Design Partner add-on** are
not on the page any more — the four tiers replaced them. They are kept as a
commented block at the bottom of `offers` rather than deleted. Move either
back into `items` to restore it. Worth a thought: weddings, red carpets and
festival artists no longer have a home on this page.

---

## The banner

```js
URGENCY: { enabled: true, endsAt: "2027-01-31", text: "… until {date} …" }
```

`{date}` is written out from `endsAt`, so the sentence and the date cannot
disagree. **The banner removes itself the moment that date passes** — it
does not need switching off manually, and it will not quietly keep claiming
a deadline that has gone.

There is no countdown clock and no "only 2 places left" counter, by design.
Those are trivial to fake and visitors can tell. The one scarcity claim on
the page — "3 places per pageant season" on the Delegate Look Package — is a
plain `badge` string: **only keep it while it is literally true.**

---

## The lead magnet

The form's offer is **The 5-Point Movement Test**, a free PDF.

Put the file somewhere public and paste its path into `LEAD_MAGNET_URL`
(relative to this folder, e.g. `../assets/styling/five-point-movement-test.pdf`).

- **With** a path set: the thank-you shows a download button straight away.
- **Without** one: the thank-you says you'll email it — which means *you
  have to*, by hand. Worth filling in early.

One thing to know about Formspree's free tier: it emails **you** the
submission, it does not email **them** the PDF. That is why the download
appears on the page instead. If you later want it to arrive in their inbox
too, Formspree's autoresponse feature is a paid plan.

---

## The waitlist form

Out of the box the form works but collects nothing centrally: on submit it
opens the visitor's own email app with their answers filled in. Nothing is
lost, but they have to press send, and some won't.

To collect submissions properly:

1. Create a free form at [formspree.io](https://formspree.io) pointed at
   **info@kyepa.com**.
2. Copy the endpoint — it looks like `https://formspree.io/f/abcdwxyz`.
3. Paste it into `FORM_ENDPOINT`.
4. In Formspree's settings, restrict the form to the domain `kyepa.com` and
   turn on spam filtering.

### About "use environment variables"

Worth being straight about: **this site cannot use environment variables.**
There is no build step and no server — the browser loads these files exactly
as they sit in the repo, so there is nothing that could substitute a secret
in before the page reaches a visitor.

That is fine here, because a Formspree endpoint is **not a secret**. It is a
public address, like an email address on a contact page: it ships in the
HTML of every site that uses Formspree. Committing it is normal and safe.
What protects it is the domain restriction in step 4, not secrecy.

If this ever grows into something that *does* need a real secret, that needs
a server or a serverless function, and the secret lives there — never here.

Nothing in this folder contains a key, a token, or a password.

---

## Client results, and one thing not to do

Each entry in `styling.testimonials.js` marked `placeholder: true` renders
with a dashed border and the words **"Placeholder — not a real client"** on
its face, and is **left out of the structured data search engines read**.

That is deliberate, and it is the one guard on this page worth keeping.
Publishing invented praise as if it were real is how a site earns a manual
penalty from Google, quite apart from what it would do to you if a delegate
recognised their own words in a quote they never said. Delete the
`placeholder` line only when the quote is genuinely someone's, with their
permission. Three real sentences beat thirty invented ones.

---

## A few deliberate choices

- **The GREENLIT campaign pop-up is not loaded here.** It opens on every
  visit on the homepage, and a Mr Gay World intro film playing over a
  styling page would bury what the visitor came for.
- **The homepage's `script.js` is not loaded here either.** It hands the
  background to a second video partway down, and this page carries only one
  (the lighter of the two — most visitors arrive from Instagram on a phone).
- **The FAQ is `<details>`/`<summary>`** — keyboard-operable, works with
  JavaScript off, no script of our own.
- **The reel embeds via Instagram's own `/embed/` route**, which renders in
  a plain iframe, so no Instagram JavaScript and no third-party tracking is
  added to the site.
- **Paths are relative, never root-absolute**, so the page works both from
  disk and served. See the main `CLAUDE.md`.

---

## Still to supply

- [ ] **Hero image or video** — `strings.hero.media` + `mediaAlt`. Ideally
      you mid-movement on a stage, not a standing portrait
- [ ] **The 5-Point Movement Test PDF** — write it, then set `LEAD_MAGNET_URL`
- [ ] **Three real client quotes** — `styling.testimonials.js`, with
      permission, replacing the placeholders
- [ ] **Case-study photos** — `portfolio.cards[].image` and `alt`
- [ ] **The Malta title** — exact name and year, in both `portfolio.cards`
      and `credentials`
- [ ] **Workbook price** — currently "Price TBC"
- [ ] **Confirm the new prices** — €250 / €1,800 / €3,500, and what the
      three monthly payments actually come to
- [ ] **Reel URL** — `REEL_URL`
- [ ] **Formspree endpoint** — `FORM_ENDPOINT`, see above
- [ ] **Share card** — `assets/styling/og.jpg`, 1200×630. Until it exists,
      shared links preview without an image
- [ ] **Check the banner date** — `URGENCY.endsAt`, currently 31 Jan 2027

Everything above is marked `TODO(Kyle):` in the config too.
