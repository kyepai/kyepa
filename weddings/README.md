# Ceremonies — `/weddings/`

`KYEPA Ceremonies`. Queer-first weddings, with every couple welcome:
destination ceremonies on St. Martin, and styling, personal shopping and
first-dance choreography wherever the couple lives.

The directory and the URL stay `/weddings/` — the page has been linked and
indexed under it, and moving it would break both for nothing. Only the
reading copy says "ceremonies".

**The word "wedding" is used sparingly on purpose.** "Ceremonies" leads;
"queer-first weddings" is the one phrase that keeps the older word, because
it is the positioning. The exceptions are the strings only a machine reads
— the `<title>`, the meta descriptions and `serviceType` in the structured
data — which keep "wedding planner" because that is what people type into
a search box. Changing those costs the page its traffic and buys nothing a
visitor would ever see.

Open `weddings/index.html` from disk, or serve the repo
(`python3 -m http.server`) and go to <http://localhost:8000/weddings/>.

---

## How to write for this page

**Queer couples lead, every couple is welcome — in that order.** Not "all
couples welcome, including LGBTQ+". The difference is the whole positioning.
Never write copy that assumes a bride and a groom.

**Remote-first.** Most couples live in Europe or North America. The island
is where they might *come to*, not where they are. "Wherever you live" is
the default.

---

## The three status switches

```js
WEDDING_FRENCH_SIDE_STATUS: "available",
WEDDING_DUTCH_SIDE_STATUS:  "coming_soon",
WEDDING_STYLING_STATUS:     "available",
```

Each is `"available"` or `"coming_soon"`, and each drives **five** things
for its card at once:

1. the **badge** ("Coming soon", or none)
2. the **card styling** (dashed and dimmed, or normal)
3. the **button label** ("Notify me", or "Plan a conversation")
4. what the button **preselects** in the enquiry form
5. whether the service appears in the **structured data** search engines
   read — a service that isn't open yet is a promise to a reader, not an
   offer Google should list

Flip one value and all five change. There is nothing else to edit, and no
second list anywhere that can fall out of step: the form's location
dropdown is generated from these same cards.

### Opening the Dutch side

Change `WEDDING_DUTCH_SIDE_STATUS` to `"available"`. That is the entire
change. The badge disappears, the card stops being dashed, the button
becomes "Plan a conversation", the form stops hiding the date and guest
count for it, and the service joins the structured data.

**Why it is closed matters for the wording.** It is not a capacity
problem and the copy must not imply it is: for the moment it is not
possible there, and Kyle is working on it through SAFE, who have it among
their top five prioritised action points. The card and the FAQ both say
that, and neither promises a date. Keep it that way — a promised date you
do not control is the one thing worse than "not yet".

---

## The enquiry form

Standard fields, plus three deliberate ones:

- **"How do you identify as a couple?"** is free text and optional, and the
  hint says so plainly. It exists so Kyle never has to guess or assume, not
  as data collection. Leave it optional.
- **Date and guest count disappear** when "Dutch side — notify me" is
  chosen. There is no date to give yet, and a form that asks unanswerable
  questions reads as careless.
- **A hidden `tag` field** is set to `dutch-side-notify` for those, so
  notify-me signups can be filtered from real enquiries in one click. The
  email subject changes to match.

### Wiring it up

Out of the box the form opens the visitor's own email app with everything
filled in. To collect submissions properly, create a free form at
[formspree.io](https://formspree.io) pointed at **info@kyepa.com**, and
paste its endpoint into `FORM_ENDPOINT`.

**This site cannot use environment variables.** No build step and no server
means nothing could substitute a secret in before the page reaches a
visitor. That is fine, because a Formspree endpoint is not a secret — it is
a public address that ships in the HTML of every site using it. Lock it to
the domain `kyepa.com` in Formspree's own settings; that, not secrecy, is
what protects it. Nothing in this folder contains a key or a token.

---

## Three things kept deliberately careful

**The legal section makes no legal claims.** Marriage rules differ by
nationality and residence, differ between the French and Dutch sides, and
change. The copy says only that the path depends on your situation and that
Kyle will point you to the right authority.
`TODO(Kyle): confirm current rules with the Collectivité de Saint-Martin
civil registry before adding any detail.`

**The "In loving memory" section is a dedication, not a service.** It is
Kyle's late husband Petr, and the words there are Kyle's own: change them
only the way he asks, and never fold the section into an offer, a
testimonial or the structured data. The photo is from their wedding day,
Amsterdam 2017 — it was posted to Instagram half a year later, so do not
re-date the picture from the post. Clearing `strings.memory.body` removes
the whole section, photo and all, without touching code.

**The SAFE Harbour seal is hidden.** `SAFE_HARBOUR_SEAL` is `false` and
should stay false until the training is actually done. The safe promise
itself — about how vendors are chosen — stands on its own without a badge.

---

## Still to supply

- [ ] **Hero image** — `strings.hero.media`. It should lead with a queer
      couple; it is what tells a visitor this page means what it says
      before they read a word
- [ ] **Portfolio photos** — the styled shoot; queer couples first
- [ ] **First-dance video** — `FIRST_DANCE_VIDEO`
- [ ] **The sub-brand name** — `BRAND_WEDDINGS_NAME`, currently
      "KYEPA Ceremonies"
- [ ] **Prices** — every card says "Price on request"
- [ ] **Formspree endpoint** — `FORM_ENDPOINT`
- [ ] **Legal confirmation** — the civil registry, before adding detail
- [ ] **Share card** — `assets/weddings/og.jpg`, 1200×630
- [ ] **Dutch-side launch** — one config value, when you're ready
