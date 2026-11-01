/* ==========================================================================
   GREENLIT — Mr Gay World 2026 campaign config
   ==========================================================================
   This is the ONLY file you need to edit for day-to-day campaign changes:
   switching phase, pasting the voting URL, adjusting dates, or rewording
   anything. No build step — save the file, reload the page.

   Quick reference
   ---------------
   Open voting ............ set PHASE to "voting" and paste VOTING_URL
   Re-show the pop-up ..... bump CAMPAIGN_VERSION (clears everyone's "dismissed")
   Change wording ......... edit strings.en below
   Add Dutch later ........ copy the whole `en` block to `nl` and translate

   Everything hangs off one global so the plain <script> tags on both pages
   can see it, matching the no-build setup of the rest of the site.
   ========================================================================== */

window.MGW_CONFIG = {
  /* Bump this string whenever you want the pop-up to appear again for people
     who already dismissed it (e.g. when voting opens). The dismissal flag in
     localStorage is keyed to this value, so changing it resets everyone. */
  CAMPAIGN_VERSION: "greenlit-2026-11",

  /* "greenlit" | "voting" | "competing" | "results"
     Drives the headline, the primary button, and how the intro film re-cuts
     itself. See strings.en.phases below for what each one says. */
  PHASE: "greenlit",

  /* Paste the official voting link here the moment Mr Gay World publishes it.
     While this is empty, the vote button falls back to the Instagram link so
     it can never be a dead end. */
  VOTING_URL: "",

  /* Optional ISO datetimes. If VOTING_OPENS_AT is set and has already passed,
     phase "greenlit" flips itself to "voting" in the browser — so you can set
     this ahead of time and not have to be awake to deploy.
     VOTING_CLOSES_AT drives the live countdown in the voting phase.
     Example: "2026-11-24T12:00:00Z"   (null = not set) */
  VOTING_OPENS_AT: null,
  VOTING_CLOSES_AT: null,

  /* Portfolio account — note this is kye_pai, not the main site's kye_pa. */
  INSTAGRAM_HANDLE: "kye_pai",
  CONTACT_EMAIL: "info@kyepa.com",

  /* Competition facts, reused across eyebrow, meta tags and the itinerary. */
  CITY: "Cebu, Philippines",
  COUNTRY: "Sint Maarten",
  COMPETITION_DATES: "22 Nov – 1 Dec 2026",
  DEPART_DATE: "18 Nov 2026",

  /* Where the standalone experience lives, for the "full story" link and the
     pill badge. Keep the trailing slash. */
  ROUTE: "/mgw/",

  /* Which language block in `strings` to use. */
  LANG: "en",

  /* ------------------------------------------------------------------------
     Intro film timings, in milliseconds from the first frame.
     Each value is when that scene STARTS. Total run ~8.2s, always skippable.
     Lower these to tighten the edit; raise them to let it breathe.
     ------------------------------------------------------------------------ */
  INTRO: {
    scene1: 0,       // "The deadline"  — countdown ticking, type-on text
    scene2: 2500,    // "The call"      — tremble, then the slate snaps shut
    scene3: 4500,    // "GREENLIT"      — the word slams in, glitter bursts
    scene4: 7000,    // "The hero"      — letterbox opens, CTAs arrive
    end: 8200,       // film over; intro chrome retires

    /* The dramatised clock in scenes 1–2. Counts from this many seconds down
       toward zero — it is a film prop, not a real deadline. */
    clockFrom: 47,
    clockTo: 3,

    /* Glitter particle budget. Capped hard; halved on narrow screens. */
    particles: 80
  },

  /* ------------------------------------------------------------------------
     COPY. Everything the visitor reads lives here.
     To add Dutch: duplicate this `en` object as `nl`, translate the values,
     and set LANG above to "nl". No other file needs to change.
     ------------------------------------------------------------------------ */
  strings: {
    en: {
      /* Browser tab + share cards for the standalone route. */
      metaTitle: "Sint Maarten @ Mr Gay World 2026 — Kyepa",
      metaDescription:
        "Kyle “Kyepa” Patrick represents Sint Maarten at Mr Gay World 2026 in Cebu, " +
        "22 November – 1 December. Greenlit at the last minute. Follow the journey.",

      /* Film furniture — the monospace "metadata" in the corners. */
      reel: "REEL 01",
      route: "SXM → CEB",
      clockLabel: "FINAL CALL",
      skip: "Skip intro",
      close: "Close",
      replay: "Replay intro",
      dismissHint: "Press Esc to close",

      /* The pill that stays in the corner after the pop-up is dismissed. */
      pill: "Sint Maarten @ Mr Gay World — Vote",
      pillAria: "Reopen the Mr Gay World campaign",

      /* How a screen reader announces the pop-up itself. */
      overlayLabel: "Sint Maarten at Mr Gay World 2026",

      /* Shared hero furniture. */
      eyebrow: "MR GAY WORLD 2026 · CEBU, PHILIPPINES · 22 NOV – 1 DEC",
      heroAlt:
        "Kyle “Kyepa” Patrick mid-movement, inverted black-and-white, hair reading as a halo",
      instagramCta: "Follow the journey @kye_pai",
      fullStory: "See the full story",

      /* ---- Phase-dependent copy. One block per PHASE value. ---- */
      phases: {
        greenlit: {
          typeA: "Funding: pending.",
          typeB: "Funding: ",
          word: "GREENLIT",
          headline: "Sint Maarten is going to Cebu.",
          subline: "Greenlit at the last minute. Now it’s your turn.",
          ctaPrimary: "Get notified when voting opens",
          status: "Voting opens soon."
        },
        voting: {
          typeA: "Votes: pending.",
          typeB: "Votes: ",
          word: "YOUR VOTE",
          headline: "Sint Maarten needs your vote.",
          subline: "One island, one delegate, one tap. Make it count.",
          ctaPrimary: "VOTE FOR SINT MAARTEN",
          status: "Voting closes in"
        },
        competing: {
          typeA: "Status: landed.",
          typeB: "Cebu: ",
          word: "LIVE",
          headline: "Live from Cebu.",
          subline: "Filming it all myself. Come watch it happen.",
          ctaPrimary: "Follow it live @kye_pai",
          status: "On the ground in Cebu."
        },
        results: {
          typeA: "Curtain: down.",
          typeB: "Thank you: ",
          word: "THANK YOU",
          headline: "That’s a wrap on Cebu.",
          subline: "Sint Maarten showed up. Thank you for carrying us there.",
          ctaPrimary: "Follow what’s next @kye_pai",
          /* TODO(Kyle): drop the result in here when you are home. */
          status: "Full story coming soon."
        }
      },

      /* ---- Scroll sections (standalone route only) ---- */
      storyTitle: "The story so far",
      storyHint: "Scroll sideways",

      /* Film-strip frames. Add, remove or reorder freely — the strip just
         renders whatever is in this list. Keep lines to one sentence. */
      timeline: [
        { date: "2007", title: "Island exit",
          line: "Left Sint Maarten after MPC. Fontys first, then Codarts Rotterdam." },
        { date: "2011–2016", title: "The company years",
          line: "Osnabrück to Heidelberg, an integral member of Nanine Linning’s company." },
        { date: "The stages", title: "Opera to Tomorrowland",
          line: "Bayerisches Staatsballett, Scapino Ballet, and a main-stage set at Tomorrowland." },
        { date: "The title", title: "Still the only one",
          line: "Sint Maarten’s sole Mr Gay World titleholder to date." },
        { date: "2025", title: "The invitation",
          line: "The Mr Gay World organisation came back and asked me to compete again." },
        { date: "2026", title: "The homecoming",
          line: "Moved back to Sint Maarten. For good this time." },
        { date: "Sept 2026", title: "The delegate",
          line: "Applied to re-enter as Sint Maarten’s delegate." },
        { date: "Sept 2026", title: "The campaign",
          line: "A tourism proposal, sponsorship outreach, and a team: Ian Soriano, Miguel Alexander, Ihndhira." },
        { date: "29 Sept 2026", title: "Front Street",
          line: "Pitched the campaign in person to the St. Maarten Tourism Bureau." },
        { date: "Oct 2026", title: "The paperwork",
          line: "Proposals to the Ministry of ECYS and the Department of Culture." },
        { date: "Oct 2026", title: "The pelican",
          line: "Designing the national costume myself: silver glitter, gray wings, mesh, tulle. In heels." },
        { date: "Late Oct 2026", title: "Funding looks lost",
          line: "The window narrows. Fine — then I go in 2027 on my own." },
        { date: "28 Oct 2026", title: "One last call",
          line: "A virtual meeting with the tourism ministry. Last shot on the board." },
        { date: "30 Oct 2026", title: "GREENLIT",
          line: "The St. Maarten Tourism Bureau greenlights support. INDISU Dance Theater comes in as routing partner." },
        { date: "18 Nov 2026", title: "Departure",
          line: "Flying out solo, filming the whole journey myself." },
        { date: "22 Nov 2026", title: "Cebu",
          line: "Mr Gay World 2026 begins." }
      ],

      itineraryTitle: "Itinerary",
      itinerary: [
        { code: "SXM", place: "Sint Maarten", note: "dep. 18 Nov" },
        { code: "CEB", place: "Cebu", note: "22 Nov – 1 Dec" },
        { code: "MUC", place: "Munich", note: "2 Dec" },
        { code: "SXM", place: "Home", note: "15 Dec" }
      ],

      partnersTitle: "Partners & thanks",
      partnersNote:
        "With the support of the St. Maarten Tourism Bureau. Logos to follow.",
      /* TODO(Kyle): swap `name` for an <img> only once you have written
         permission from each partner. Empty slots render as "Your name here". */
      partners: [
        { name: "St. Maarten Tourism Bureau", role: "Supporting partner" },
        { name: "INDISU Dance Theater St. Maarten", role: "Routing partner" },
        { name: "", role: "Open slot" },
        { name: "", role: "Open slot" }
      ],
      partnerEmpty: "Your name here",

      footerTitle: "Carry Sint Maarten to Cebu.",
      contactCta: "info@kyepa.com",
      backHome: "kyepa.com"
    }

    /* nl: { ... } — add here when you want Dutch. */
  }
};
