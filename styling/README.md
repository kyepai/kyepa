# Styling consultations — `/styling/`

"Styled in Motion", the styling service line.

Styling, personal shopping and wedding styling — "for the stage, the aisle
and every day".

**Write remote-first.** Most clients live outside the Caribbean, in Europe
and North America. "Wherever you live" is the default; in person on Sint
Maarten is the second option, never the assumption. Don't imply a hot
climate in general copy either — heat belongs to stage lights, crowded
venues, summer and destination events, not to the reader's Tuesday.

Two readers come first: **queer men stepping onto a stage** (pageant
delegates, performers, emerging public figures), and **couples planning a
wedding**, at home or as a destination wedding on St. Martin. Every couple
and every kind of wedding is welcome — queer couples are the priority and
the speciality, so they lead every wedding section, in copy and in imagery.

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

The **"Interested in"** dropdown on the form is built from these offer
names automatically, plus `waitlist.interestFallback` on the end. Add an
offer and it appears in the dropdown in the same order — there is no second
list to keep in sync, which is what stopped two offers' buttons from
preselecting anything when they were first added.

### One parked offer

The **Design Partner add-on** is not on the page; it sits as a commented
block at the bottom of `offers`. Move it into `items` to bring it back.

Stage & Event Styling came back as **Ceremonies & Stage**, now covering
couples as well as delegates and performers.

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
the page — "4 places per pageant season" on the Delegate Look Package — is a
plain `badge` string, and it is a real limit: four delegates a season is what
Kyle can actually dress. It states a capacity, it does not tick down, and it
should **only stay while it is literally true.**

---

## The lead magnet

The form's offer is **The 5-Point Movement Test**, a free PDF.

**The PDF is live.** It is committed at
`assets/styling/KYEPA_5-Point_Movement_Test.pdf` (9 pages) and wired into
`LEAD_MAGNET_URL`, so the thank-you shows a download button straight away
and it works from disk as well as served.

To swap in a new version, replace that file and keep the name — or change
the name in both places. Empty the setting and the thank-you falls back to
promising the PDF by email, which means *you* sending it by hand.

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
- **The reel is a poster, not an embed.** `REEL_POSTER` is a still cropped
  to 9:16 that links out to the reel. That makes the crop exactly what you
  chose rather than whatever Instagram's card does, cuts the weight to one
  small image, and means **no request reaches Instagram until someone
  actually taps it** — so visitors who never do are never seen by them.
  Clearing `REEL_POSTER` falls back to the `/embed/` iframe, which renders
  without Instagram's JavaScript but is still a request to them on every
  page load.
- **Paths are relative, never root-absolute**, so the page works both from
  disk and served. See the main `CLAUDE.md`.

---

## Still to supply

- [ ] **Hero image or video** — `strings.hero.media` + `mediaAlt`. Ideally
      you mid-movement on a stage, not a standing portrait
- [x] ~~The 5-Point Movement Test PDF~~ — done, committed and wired up
- [ ] **Three real client quotes** — `styling.testimonials.js`, with
      permission, replacing the placeholders
- [ ] **Case-study photos** — `portfolio.cards[].image` and `alt`
- [ ] **The Malta title** — exact name and year, in both `portfolio.cards`
      and `credentials`
- [ ] **Workbook price** — currently "Price TBC"
- [ ] **Personal Shopper price** — currently "Ask me", never specified
- [x] **Ceremonies & Stage price** — settled at "From €800", replacing
      the €500 carried over from Stage & Event
- [ ] **Confirm the remaining price** — €1,800 for the Full Image
      Sprint, and what its three monthly payments actually come to
      (Style Sprint €240 and Delegate Look Package €3,800 are settled)
- [ ] **Decide whether Delegate Look Package stays** — it is not in the
      PDF's own list of offers, and may be covered by Ceremonies & Stage
- [ ] **Reel URL** — `REEL_URL`
- [ ] **Formspree endpoint** — `FORM_ENDPOINT`, see above
- [ ] **Share card** — `assets/styling/og.jpg`, 1200×630. Until it exists,
      shared links preview without an image
- [ ] **Check the banner date** — `URGENCY.endsAt`, currently 31 Jan 2027

Everything above is marked `TODO(Kyle):` in the config too.
