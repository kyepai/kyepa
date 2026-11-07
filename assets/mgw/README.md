# Images — GREENLIT campaign

`hero.jpg`, `hero-wide.jpg` and `og.jpg` are still **generated placeholders**
(a silver-to-gray gradient with a label on it). Everything already works;
swapping in the real photos is just a matter of overwriting the files.

`cod.jpg` and `stonewall.jpg` are real photographs, not placeholders.

Keep the **same filenames** and the site picks them up with no code change.

| File            | Size        | What goes here |
|-----------------|-------------|----------------|
| `hero.jpg`      | 1200 × 1600 (3:4 portrait) | The colour-inverted black-and-white dance photo — the kyepa.com logo crop, where the hair reads as a halo. This is the one shown in the hero. |
| `hero-wide.jpg` | 2000 × 1125 (16:9) | A wide crop of the same photo. Reserved for a future wide layout; nothing references it yet. |
| `og.jpg`        | 1200 × 630 **exactly** | The share card — what WhatsApp, Instagram DMs and iMessage show when `kyepa.com/mgw/` is pasted. Put the headline text *in the image*; most apps crop the edges, so keep anything important inside the middle 80%. |
| `cod.jpg`       | 1080 × 1350 (4:5) | **Real.** The "Captains of our own Destinies" card, used as the thumbnail on the featured-post link. Rebuilt from `stonewall.jpg`. |
| `stonewall.jpg` | 1242 × 1246 | **Real.** The source photograph for the card above. Photographer: Gioacchino Dell'Erba — the watermark is deliberately kept in frame wherever this photo is used. |

## Swapping an image in

1. Drop the new file in this folder with the same name.
2. Save it at **under ~300 KB** if you can — most visitors arrive on phone data
   from Instagram. 1200 px wide at JPEG quality ~80 is plenty.
3. Reload. If you still see the placeholder, it is browser cache: hard-reload
   with `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac).

## A note on the share card

Social platforms cache share images aggressively. After replacing `og.jpg`,
the old one can stick around for days. To force a refresh, paste the URL into
Facebook's [Sharing Debugger](https://developers.facebook.com/tools/debug/)
and hit "Scrape Again".

## Alt text

The hero image's alt text lives in `mgw/mgw.config.js` under
`strings.en.heroAlt`. If you change the photo, update that description too.
