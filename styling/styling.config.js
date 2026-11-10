/* ==========================================================================
   STYLED IN MOTION — styling consultations config
   ==========================================================================
   This is the ONLY file you need to edit for day-to-day changes to the
   /styling/ page: prices, offer wording, case studies, FAQ answers, the reel
   link, the waitlist form destination. No build step — save, reload.

   Quick reference
   ---------------
   Change a price ......... offers.items[].price
   Add a case study ....... copy a block in portfolio.cards
   Turn the form on ....... paste your Formspree URL into FORM_ENDPOINT
   Drop in the reel ....... paste the Instagram reel URL into REEL_URL
   Add a photo ............ set `image` on any card (leave "" for a placeholder)
   Reword anything ........ every visible string is in here

   Anything marked TODO(Kyle) is waiting on you. The page is built to look
   finished without it, so you can publish first and fill in later.
   ========================================================================== */

window.STYLING_CONFIG = {

  /* ----------------------------------------------------------------------
     1. Where the page's own meta tags live
     ----------------------------------------------------------------------
     The browser-tab title, the search-results description and the
     WhatsApp/Instagram share card are NOT in this file. They sit in the
     <head> of styling/index.html, because a search engine has to be able
     to read them without running any JavaScript.

     They are three plain lines of text near the top of that file, clearly
     commented. Everything else — every price, every sentence a visitor
     reads — is in this file.
     ---------------------------------------------------------------------- */

  CONTACT_EMAIL: "info@kyepa.com",
  INSTAGRAM_HANDLE: "kye_pa",

  /* ----------------------------------------------------------------------
     2. The waitlist form destination
     ----------------------------------------------------------------------
     This site has no build step and no server, so a form needs somewhere
     off-site to post to. Leave this empty and the form still works: it
     falls back to opening a pre-filled email to CONTACT_EMAIL, so the page
     is never a dead end.

     To collect submissions properly, create a free form at formspree.io
     pointed at info@kyepa.com and paste its endpoint here. It looks like:
       "https://formspree.io/f/abcdwxyz"

     That endpoint is NOT a secret — it ships in the HTML of every site that
     uses Formspree and is safe to commit. See styling/README.md for why
     environment variables cannot work on this site, and how to lock the
     form down to kyepa.com inside Formspree instead. */
  FORM_ENDPOINT: "",

  /* ----------------------------------------------------------------------
     3. The Instagram reel
     ----------------------------------------------------------------------
     Paste any reel or post URL from @kye_pa — the long ?utm_source=... tail
     is fine, it gets ignored. Leave empty and the slot renders as a clearly
     marked placeholder instead of a broken embed.
     TODO(Kyle): choose the reel you want leading this page. */
  REEL_URL: "",

  /* ----------------------------------------------------------------------
     4. COPY. Everything the visitor reads lives below.
     ---------------------------------------------------------------------- */
  strings: {

    /* ---- 1. Hero ---- */
    hero: {
      headline: "Styled in Motion",
      subline:
        "Styling for people who move, present and perform: designed for the " +
        "life you're stepping into.",
      cta: "Join the Style Sprint list",
      /* Full-width opener. Set `media` to an image path relative to this
         folder (e.g. "../assets/styling/hero.jpg") or an .mp4/.mov for video.
         Leave "" and a marked placeholder frame shows instead.
         TODO(Kyle): hero image or video still to come. */
      media: "",
      mediaAlt: ""
    },

    /* ---- 2. The idea ---- */
    idea: {
      title: "The idea",
      body:
        "Most stylists dress a body standing still. I spent 19 years on " +
        "stage, from opera houses to the Tomorrowland main stage, learning " +
        "how clothes move, breathe and photograph under light. Every look I " +
        "design passes a movement test before it's approved: walk, sit, " +
        "turn, gesture, heat. Styling is the part of Life Experience Design " +
        "you can see the moment you walk into a room."
    },

    /* ---- 3. The method ---- */
    method: {
      title: "The method",
      intro: "Five steps. The same five every time, whatever we're dressing you for.",
      steps: [
        { name: "Discover", line: "Who you're becoming" },
        { name: "Define",   line: "Your written style identity" },
        { name: "Edit",     line: "Your wardrobe, honestly audited" },
        { name: "Build",    line: "Your capsule and sourcing plan" },
        { name: "Test",     line: "The movement test and a mini shoot" }
      ]
    },

    /* ---- 4. Offers ----
       `price` sits on the right of the row, like the main site's offers
       modal. `meta` is the small line under the name (duration, format).
       Reorder, add or delete freely — the page renders whatever is here. */
    offers: {
      title: "Offers",
      intro:
        "Four ways in. All prices in euros, and all of them start with a " +
        "conversation rather than a contract.",
      items: [
        {
          name: "Style Sprint",
          price: "From €250",
          meta: "2–3 hours · remote or in person",
          body:
            "An identity read, a video wardrobe audit, look direction, and " +
            "the edit and shopping list that comes out of it. The fastest " +
            "way to see what I do."
        },
        {
          name: "Full Image Sprint",
          price: "From €1,200",
          meta: "5 sessions over 3–5 weeks",
          body:
            "The full method above, one step at a time, with room to live " +
            "in the changes between sessions. This is the one that moves " +
            "how people read you."
        },
        {
          name: "Stage & Event Styling",
          price: "From €500",
          meta: "Project fee · garments billed separately",
          body:
            "Pageants, performances, weddings, red carpets, festival " +
            "artists. Built for the walk, the light and the camera, not " +
            "just the hanger."
        },
        {
          name: "Design Partner add-on",
          price: "Ask me",
          meta: "Existing Design Partner clients",
          body:
            "A seasonal wardrobe refresh folded into the work we're " +
            "already doing together."
        }
      ],
      /* TODO(Kyle): confirm these before launch — they are the numbers you
         gave me, but nothing here is set in stone. */
      note: "Indicative pricing. Every project gets a proper quote first."
    },

    /* ---- 5. Portfolio / lookbook ----
       Each card: title, the one-line thinking, and optionally an image and
       a longer `detail` that opens in a modal. Leave `image` empty for a
       placeholder tile; leave `detail` empty and the card simply doesn't
       open. `initials` is what shows on a placeholder tile. */
    portfolio: {
      title: "Lookbook",
      intro: "Three in progress. More as they're shot.",
      cards: [
        {
          title: "Mr Gay World 2026 — Cebu: the look package",
          initials: "MGW",
          thinking:
            "One delegate, ten days, a whole country on the label. Every " +
            "look had to survive heat, stage light and a camera phone.",
          image: "",
          alt: "",
          detail:
            "A full competition wardrobe designed as one package rather " +
            "than ten separate outfits: national costume, formal wear, " +
            "swimwear, interview looks and the travel clothes nobody " +
            "photographs but everybody feels. Built around Cebu's humidity " +
            "and a schedule with no time for repairs."
        },
        {
          title: "National costume: the brown pelican",
          initials: "SXM",
          thinking:
            "Sint Maarten's national bird, built to be worn: silver " +
            "glitter, grey wings, mesh and tulle. In heels.",
          image: "",
          alt: "",
          detail:
            "Concept, build and stage, start to finish. The brown pelican " +
            "is the island's national bird and a genuinely unglamorous " +
            "animal up close, which is exactly why it works: the costume " +
            "had to read as wingspan from the back of a theatre while " +
            "still letting me walk, turn and hit a mark in heels."
        },
        {
          /* TODO(Kyle): confirm the exact title and year of this one. */
          title: "Fashion show winner — Malta",
          initials: "MLT",
          thinking:
            "Placeholder: the exact title is still to be confirmed.",
          image: "",
          alt: "",
          detail: ""
        }
      ]
    },

    /* ---- 6. The reel ---- */
    reel: {
      title: "In motion",
      intro: "Because a still photograph cannot show you a movement test.",
      /* Shown in place of the embed while REEL_URL is empty. */
      placeholder: "Reel slot — paste a link into REEL_URL to fill this.",
      cta: "Watch on Instagram"
    },

    /* ---- 7. Credentials strip ---- */
    credentials: [
      "19 years in professional performance",
      "Mr Gay World — sole Sint Maarten titleholder",
      /* TODO(Kyle): confirm the exact wording of the Malta win. */
      "Fashion show winner, Malta",
      "Based on Sint Maarten, working worldwide"
    ],

    /* ---- 8. Waitlist form ---- */
    waitlist: {
      title: "Join the Style Sprint list",
      intro:
        "Style Sprints open in small batches. Tell me where you are and " +
        "what you're dressing for, and I'll come to you first.",
      nameLabel: "Your name",
      emailLabel: "Email",
      instagramLabel: "Instagram handle",
      instagramHint: "Optional — it helps me see what you already wear.",
      locationLabel: "Where are you?",
      locationOptions: ["Sint Maarten", "Remote"],
      interestLabel: "Interested in",
      interestOptions: [
        "Style Sprint",
        "Full Image Sprint",
        "Stage & Event",
        "Not sure yet"
      ],
      goalLabel: "What's the occasion, or the goal?",
      goalHint: "A sentence is plenty.",
      consentLabel:
        "Yes, you can email me about Style Sprints. No list-selling, no spam.",
      submit: "Join the list",
      sending: "Sending…",
      success: "You're on the list. I'll be in touch when Style Sprints open.",
      /* Shown if the network call fails, so nobody loses what they typed. */
      error:
        "That didn't send — the connection dropped. Try again, or email me " +
        "directly at info@kyepa.com.",
      /* Used for the no-endpoint fallback and the no-JavaScript route. */
      emailFallback: "Email me instead",
      /* Shown while FORM_ENDPOINT is still empty: the answers are handed to
         the visitor's own mail client rather than lost. */
      mailtoHandoff: "Opening your email app with this filled in — just hit send.",
      required: "Please fill this in."
    },

    /* ---- 9. FAQ ---- */
    faq: {
      title: "Questions",
      items: [
        {
          q: "Do you work remotely?",
          a:
            "Yes, and more than half of it is built to work that way. The " +
            "identity read, the wardrobe audit and the sourcing plan all " +
            "happen over video — you walking me through your own " +
            "wardrobe on your phone tells me more than a showroom ever " +
            "would. In-person days are for the build and the shoot, and " +
            "I travel for those."
        },
        {
          q: "Do I have to buy new clothes?",
          a:
            "No. We start with what you already own, and the edit usually " +
            "finds more than you expect. Most people are not missing " +
            "clothes, they're missing a decision about who they are in " +
            "them. If there are real gaps I'll give you a sourcing plan " +
            "with prices, and you buy at your own pace."
        },
        {
          q: "Can you style for a specific event?",
          a:
            "That's a whole offer: Stage & Event Styling. Pageants, " +
            "performances, weddings, red carpets, festival sets. Bring me " +
            "the date, the venue and the light, and I'll build for the " +
            "walk as much as the look."
        },
        {
          q: "What's the movement test?",
          a:
            "Five things, every look, before I approve it: walk, sit, " +
            "turn, gesture, heat. Clothes behave differently on a moving " +
            "body than on a hanger, and a look that only works standing " +
            "still isn't finished. Nineteen years on stage taught me that " +
            "the expensive way."
        },
        {
          q: "How do I book?",
          a:
            "Join the list above and you'll hear from me when the next " +
            "batch opens. If you're working to a date that won't wait, " +
            "email info@kyepa.com and say so — I'll tell you honestly " +
            "whether I can make it."
        }
      ]
    },

    /* ---- 10. Closing CTA ---- */
    closing: {
      headline: "Ready to look like the life you're designing?",
      cta: "Join the Style Sprint list"
    },

    /* ---- Shared furniture ----
       Shown on placeholder tiles and frames, so an unfinished page still
       reads as deliberate rather than broken. */
    placeholderLabel: "Image to come",
    modalClose: "Close"
  }
};
