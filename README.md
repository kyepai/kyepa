# kyepa

38 multipurpose website

A static site: plain HTML, CSS and JavaScript, no build step.

To view it locally, just **open `index.html` in your browser** — double-click
it, and everything works, including the campaign pop-up.

If you would rather view it the way a visitor will, serve the folder instead:

```sh
python3 -m http.server
```

Then open <http://localhost:8000/>. This is the closer match to the live site,
and it gives you the tidy `/mgw/` address rather than a long file path.

---

## GREENLIT — the Mr Gay World 2026 campaign

The campaign experience lives entirely in **`mgw/`** plus the images in
`assets/mgw/`. It appears in two places:

- **A pop-up on the homepage.** Plays the full intro film on someone's first
  visit. Once dismissed it leaves a small pill in the bottom corner
  ("Sint Maarten @ Mr Gay World — Vote") that reopens it, skipping the film.
- **A standalone page at `/mgw/`** — open `mgw/index.html` from disk, or
  <http://localhost:8000/mgw/> if you are serving the folder;
  `kyepa.com/mgw/` live. This is the one to put in the Instagram bio and in
  stories. It has its own title, description and share card, and continues
  below the hero into the story, the itinerary and the partners strip.

Add `?mgw` to any homepage link (`kyepa.com/?mgw`) to force the pop-up open
even for people who have already dismissed it. Handy for campaign links, and
for retesting it yourself without clearing your browser storage.

### Everything is driven by one file

**`mgw/mgw.config.js`** is the only file you need for day-to-day changes. It
holds every piece of copy and every switch. Save the file, reload the page —
there is nothing to build or compile.

#### Switching phase

Change `PHASE` to one of four values. Each one re-cuts the film and swaps the
headline and the main button:

| `PHASE`       | What the visitor gets |
|---------------|-----------------------|
| `"greenlit"`  | The celebration. Main button: "Get notified when voting opens" (opens an email). Shows "Voting opens soon." |
| `"voting"`    | The ask. Big **VOTE FOR SINT MAARTEN** button, plus a live countdown to `VOTING_CLOSES_AT`. The film re-cuts itself: scene 1 reads "Votes: pending." and the word that slams in becomes "YOUR VOTE". |
| `"competing"` | "Live from Cebu." Pushes people to Instagram. Keeps the vote button if voting is still open. |
| `"results"`   | Thank-you state. Drop the outcome into `strings.en.phases.results.status`. |

#### Opening voting

1. Paste the official link into `VOTING_URL`.
2. Set `PHASE: "voting"`.
3. Bump `CAMPAIGN_VERSION` to something new, e.g. `"voting-2026-11"`.

Step 3 matters: the "already dismissed" flag in each visitor's browser is
keyed to `CAMPAIGN_VERSION`, so changing it makes the pop-up appear again for
everyone — including people who closed it during the greenlit phase.

If `VOTING_URL` is still empty, the vote button falls back to the Instagram
link rather than being a dead end.

**Scheduling it instead:** set `VOTING_OPENS_AT` to an ISO datetime, e.g.
`"2026-11-24T12:00:00Z"`. Once that moment passes, `"greenlit"` promotes
itself to `"voting"` in the visitor's browser, with nothing to deploy at the
time. Set `VOTING_CLOSES_AT` the same way to drive the live countdown.

#### Changing wording

All text is under `strings.en` in the config — the headline, the buttons, the
timeline frames, the partners, the film's type-on lines. Nothing is hardcoded
in the markup.

To add Dutch later: copy the whole `en` block to `nl`, translate the values,
and set `LANG: "nl"`. No other file changes.

#### How often the pop-up appears

| Setting | Effect |
| --- | --- |
| `ALWAYS_OPEN: true` | **Current setting.** The pop-up opens on *every* visit. Closing it is not remembered. |
| `ALWAYS_OPEN: false` | It opens once. After someone closes it, they get the small corner pill instead, and `CAMPAIGN_VERSION` is what brings it back. |

While `ALWAYS_OPEN` is on, `REPLAY_INTRO` decides whether the ~8-second film
plays every single time:

| Setting | Effect |
| --- | --- |
| `REPLAY_INTRO: false` | **Current setting.** The film plays once per browser session. Clicking around the site afterwards opens the pop-up straight at the hero. |
| `REPLAY_INTRO: true` | The full film plays on every page load. |

Set `ALWAYS_OPEN` back to `false` once the competition is over.

#### The featured Instagram post

`FEATURE_POST_URL` is the carousel linked by the card under the buttons, using
[`assets/mgw/cod.jpg`](assets/mgw/cod.jpg) as its thumbnail. Set it to `""` to
remove the card entirely.

#### Replacing images

See [`assets/mgw/README.md`](assets/mgw/README.md). Overwrite a file with the
same filename and it is picked up automatically — no code change needed.

`hero.jpg`, `hero-wide.jpg` and `og.jpg` are still generated placeholders and
need replacing. `cod.jpg` (the "Captains of our own Destinies" card) and
`stonewall.jpg` (the photograph it is built from) are real.

#### Timing of the film

`INTRO` in the config holds the scene start times in milliseconds. Lower them
to tighten the edit, raise them to let it breathe. `particles` caps the
glitter count (halved automatically on phones).

### How it is put together

| File | What it does |
|------|--------------|
| `mgw/mgw.config.js` | All copy and all switches. The only file to edit. |
| `mgw/mgw.css` | Every style, scoped under `.mgw-*` so it cannot leak into the rest of the site. |
| `mgw/mgw.js` | The scene engine, the countdown, the glitter, the pop-up, the scroll reveals. No dependencies. |
| `mgw/index.html` | The standalone `/mgw/` page: meta tags, share card, and a no-JavaScript fallback. |
| `assets/mgw/` | Campaign images: the hero slots, the share card, and the featured-post thumbnail. |

The homepage ([`index.html`](index.html)) was touched in two places only: four
lines in `<head>` for the fonts and stylesheet, and a mount `<div>` plus two
`<script>` tags before `</body>`. Nothing existing was moved.

The pop-up is a native `<dialog>` opened with `showModal()`, the same approach
the site's other modals already use — which is what gives it a working focus
trap, Escape-to-close, and focus returning where it was.

### Accessibility and performance notes

- `prefers-reduced-motion` skips the film entirely and lands on the hero, with
  no particles and no screen shake.
- The animated text is real text in the DOM from the first frame; only widths
  and a caret are animated, so screen readers get whole sentences.
- Glitter particles pause when the browser tab is hidden and tear themselves
  down once the burst is spent.
- Uses `svh` units and `env(safe-area-inset-*)`, so it behaves on notched
  iPhones and does not jump when mobile browser chrome appears.
- No tracking script is installed. `mgw.js` fires a `mgw:track` DOM event for
  the vote button, the Instagram button, skip intro, and dismiss. If analytics
  is ever added, listen for that event:
  ```js
  document.addEventListener("mgw:track", (e) => console.log(e.detail));
  ```

### Taking it down afterwards

Delete the `mgw/` and `assets/mgw/` folders, then remove the two commented
blocks from `index.html`. Nothing else references it.
