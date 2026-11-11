/* ==========================================================================
   STYLED IN MOTION — styling consultations config
   ==========================================================================
   This is the ONLY file you need to edit for day-to-day changes to the
   /styling/ page: prices, offer wording, case studies, FAQ answers, the
   reel link, the form destination. No build step — save, reload.

   Client quotes live in their own file, styling.testimonials.js.

   Quick reference
   ---------------
   Change a price ......... offers.items[].price
   Switch the banner off .. URGENCY.enabled = false
   Add a case study ....... copy a block in portfolio.cards
   Turn the form on ....... paste your Formspree URL into FORM_ENDPOINT
   Drop in the reel ....... paste the Instagram reel URL into REEL_URL
   Add a photo ............ set `image` on any card (leave "" for a placeholder)
   Reword anything ........ every visible string is in here

   Who this page talks to
   ----------------------
   One person first: a queer man stepping onto a stage — a pageant delegate,
   a performer, someone becoming publicly visible — who wants to look
   unforgettable and move like he owns it. Everyone else is welcome, and the
   copy never shuts them out, but when a sentence has to choose, it chooses
   him. Keep that in mind when editing: write to him, not to everybody.

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
     ---------------------------------------------------------------------- */

  CONTACT_EMAIL: "info@kyepa.com",
  INSTAGRAM_HANDLE: "kye_pa",

  /* ----------------------------------------------------------------------
     2. The form destination
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
     3. The lead magnet — "The 5-Point Movement Test"
     ----------------------------------------------------------------------
     The PDF people get for signing up. Put the file somewhere public (the
     repo's own assets folder is fine) and paste the path here, relative to
     this folder — e.g. "../assets/styling/five-point-movement-test.pdf".

     While this is empty the form still works and still collects the signup;
     the thank-you simply promises the PDF by email instead of linking it.
     That means YOU have to send it by hand, so it is worth filling in.
     The file is committed at assets/styling/, so this works offline and
     from disk as well as live. */
  LEAD_MAGNET_URL: "../assets/styling/KYEPA_5-Point_Movement_Test.pdf",

  /* ----------------------------------------------------------------------
     4. The Instagram reel
     ----------------------------------------------------------------------
     Paste any reel or post URL from @kye_pa — the long ?utm_source=... tail
     is fine, it gets ignored. Leave empty and the slot renders as a clearly
     marked placeholder instead of a broken embed. */
  REEL_URL: "https://www.instagram.com/reel/DHq7m-_s_E6/?mdxt=MjlscDRqb2kyNmp1",

  /* ----------------------------------------------------------------------
     5. The founding-client banner
     ----------------------------------------------------------------------
     A strip at the top of the page. It is driven by a real date and it
     removes itself the moment that date passes — there is no countdown
     clock, no "only 2 left", and nothing that resets when someone reloads.
     If you want it gone before then, set enabled to false.

     `endsAt` is the last day the pricing stands, as YYYY-MM-DD. The date in
     the sentence is generated from it, so the two can never disagree. */
  URGENCY: {
    enabled: true,
    endsAt: "2027-01-31",
    /* {date} is replaced with endsAt, written out long. */
    text: "Founding-client pricing until {date} — prices rise after."
  },

  /* ----------------------------------------------------------------------
     6. COPY. Everything the visitor reads lives below.
     ---------------------------------------------------------------------- */
  strings: {

    /* ---- 1. Hero ---- */
    hero: {
      headline: "Styled in Motion",
      subline:
        "For the stage, the aisle and every day — become the one everyone " +
        "remembers.",
      cta: "Get the free Movement Test",
      /* Sits beside the primary button and jumps to the offers. */
      ctaSecondary: "See the offers",
      /* Set `media` to an image path relative to this folder, or an
         .mp4/.mov for video. Leave "" and a marked placeholder shows. */
      media: "../assets/styling/hero.jpg",
      mediaAlt:
        "Kyle Patrick mid-leap in bold sportswear against a pale backdrop, " +
        "one arm raised and both feet off the ground",
      /* The hero frame normally widens to 16:9 on a desktop, which would
         cut off the raised arm and the trailing leg. Pinning the image's
         own ratio keeps the whole leap in frame at every width. Remove
         this line to go back to the responsive crop. */
      mediaRatio: "591 / 789",
      /* Makes the hero image a link. Leave "" for a plain image. */
      linkUrl:
        "https://thefutureclub.berlin/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAdGRleAVhXZlleHRuA2FlbQIxMQBwZG9mAmZkaWQWUSDrO0Xxi5lM-ZiOtDU926Pif7-yinNydGMGYXBwX2lkDzEyNDAyNDU3NDI4NzQxNAABpys85zvmnWIHXv1E17FzL2kjnZEYPBOX4rcIYF0a5yPZ5Aj2hp5UV_s-5AAo_aem_sxZHVzsKminPDHFxwIdHUQ",
      linkAria: "The Future Club Berlin — the shoot this image is from"
    },

    /* ---- 2. The idea ----
       Kyle's own words. Left exactly as written. */
    idea: {
      title: "Why a moment changes everything",
      body:
        "Most stylists dress a body standing still. I spent 19 years on " +
        "stage, from opera houses to the Tomorrowland main stage, learning " +
        "how clothes move, breathe and photograph under light. Every look I " +
        "design passes a movement test before you wear it: walk, sit, " +
        "embrace, heat, lens. Styling is the part of Life Experience Design " +
        "people see the moment you walk into a room."
    },

    /* ---- 3. The method ---- */
    method: {
      title: "The method",
      intro:
        "Five steps, whether you're walking a pageant stage, an aisle, or " +
        "into a room full of people who have never taken you seriously " +
        "before. Run remotely wherever you live, or in person on Sint " +
        "Maarten.",
      steps: [
        { name: "Discover", line: "Who you're becoming" },
        { name: "Define",   line: "Your written style identity" },
        { name: "Edit",     line: "Your wardrobe, honestly audited" },
        { name: "Build",    line: "Your capsule and sourcing plan" },
        { name: "Test",     line: "The movement test and a mini shoot" }
      ]
    },

    /* ---- 4. Offers ----
       Four ways in, laid out as a ladder: start here, then do it yourself,
       then do it with me, then have it done for you.

       Per card:
         tier       small label above the name ("Done with you", etc.)
         price      whatever you like — "From €250", "Ask me", "TBC"
         priceNote  the small line under the price (payment plans)
         badge      pill on the card ("Coming soon", scarcity that is TRUE)
         meta       duration / format line
         bonuses    list of what's included on top; a bonus with
                    `caseStudy` set opens that lookbook card's modal
         cta        overrides the default button label
       Reorder, add or delete freely — the page renders whatever is here. */
    offers: {
      title: "Ways to work together",
      intro:
        "Grouped by how much you want to do yourself. All of it works " +
        "remotely, wherever you live; in person on Sint Maarten if you'd " +
        "rather.",
      items: [
        {
          tier: "Do it yourself",
          name: "Style Identity Workbook",
          price: "TBYD",
          /* `priceInfo` turns the price into a hover/focus tooltip, using
             the same plate component as the homepage's Club Athleten link.
             Leave it off and the price is plain text. */
          priceInfo:
            "Too Busy You Decide. It isn't priced yet — join the list and " +
            "help me set it.",
          priceNote: "",
          badge: "Coming soon",
          meta: "Digital · work through it at your own pace",
          body:
            "The Discover and Define steps as a workbook you run on " +
            "yourself: the questions I ask, the exercises I set, and the " +
            "written style identity you come out holding.",
          bonuses: [],
          cta: "Join the waitlist"
        },
        {
          tier: "Start here",
          name: "Style Sprint",
          price: "From €250",
          priceNote: "",
          badge: "",
          meta: "2–3 hours · fully remote, or in person on Sint Maarten",
          body:
            "One focused session: an identity read, a wardrobe audit by " +
            "video and a clear look direction. Fully remote wherever you " +
            "live, or in person on Sint Maarten.",
          bonuses: [],
          cta: ""
        },
        {
          tier: "Done for you",
          name: "Personal Shopper",
          price: "You ask me…",
          priceInfo:
            "A mashup of “no, you go first” and “I love you”. A flat " +
            "sourcing fee — tell me what you're working with and we'll " +
            "build from there.",
          priceNote: "garments billed separately",
          badge: "",
          meta: "A shortlist to your door, or a shopping day together",
          body:
            "I find the pieces so you don't have to: a curated shortlist " +
            "from brands that deliver to your door, or a guided shopping " +
            "day together, in your city or mine. Every pick is chosen to " +
            "pass all five tests.",
          bonuses: [],
          cta: ""
        },
        {
          tier: "Done with you",
          name: "Full Image Sprint",
          price: "From €1,800",
          priceNote: "or 3 monthly payments",
          badge: "",
          meta: "5 sessions over 3–5 weeks · remote, wherever you live",
          body:
            "Five sessions, from who you're becoming to a capsule " +
            "wardrobe that has passed every test in the guide. This is " +
            "the one that changes how a room reads you before you have " +
            "said anything.",
          bonuses: [
            {
              name: "Walk & Movement Coaching",
              line: "Nineteen years of stage craft, pointed at your walk."
            },
            {
              name: "Remote Video Audit Process",
              line: "My wardrobe audit, run over video from wherever you live."
            }
          ],
          cta: ""
        },
        {
          tier: "Done for you",
          name: "Delegate Look Package",
          price: "From €3,500",
          priceNote: "garments billed separately",
          /* TODO(Kyle): only keep this badge while it is literally true. */
          badge: "3 places per pageant season",
          meta: "Complete stage and street looks, sourced and delivered",
          body:
            "Every look for the whole competition, built as one package " +
            "rather than ten separate outfits: national costume, formal, " +
            "swimwear, interview, and the travel clothes nobody " +
            "photographs but everybody feels. You land ready.",
          bonuses: [
            {
              name: "The Microscopic Budget Method",
              line: "How to build a stage-worthy look on almost nothing.",
              caseStudy: "pelican"
            },
            {
              name: "Walk & Movement Coaching",
              line: "Nineteen years of stage craft, pointed at your walk."
            },
            {
              name: "Remote Video Audit Process",
              line: "My wardrobe audit, run over video from wherever you live."
            }
          ],
          cta: ""
        },
        {
          /* A link card: `link` sends the button to another page instead of
             the form, and the card renders without a price. */
          tier: "Weddings",
          name: "Weddings & Stage",
          price: "",
          priceNote: "",
          badge: "",
          meta: "Queer-first, every couple welcome",
          body:
            "Couple and groom styling, personal shopping for the day, and " +
            "first-dance choreography. Destination weddings on St. Martin, " +
            "wedding styling wherever you live.",
          bonuses: [],
          link: "../weddings/index.html",
          cta: "See the wedding pages"
        }
      ],
      bonusLabel: "Included",
      /* Button label on a card that doesn't set its own `cta`. Every one
         of them scrolls to the form and preselects that offer in it. */
      ctaDefault: "Talk to me about this",
      /* TODO(Kyle): confirm all four before launch. */
      note: "Indicative pricing. Every project gets a proper quote first.",

      /* Two offers from the earlier version of this page are parked here
         rather than deleted, in case you want them back as a secondary
         line. They are NOT rendered. Move either into `items` to restore:

         {
           tier: "Project",
           name: "Stage & Event Styling",
           price: "From €500",
           priceNote: "garments billed separately",
           meta: "Weddings, red carpets, festival artists",
           body: "Built for the walk, the light and the camera, not just
                  the hanger."
         },
         {
           tier: "Ongoing",
           name: "Design Partner add-on",
           price: "Ask me",
           meta: "Existing Design Partner clients",
           body: "A seasonal wardrobe refresh folded into the work we are
                  already doing together."
         }
      */
    },

    /* ---- 5. The guarantee ---- */
    guarantee: {
      title: "No-risk guarantee",
      body:
        "If our first session doesn't feel right, you get a full refund. " +
        "No forms, no fuss."
    },

    /* ---- 6. Portfolio / lookbook ----
       `id` lets a bonus above link straight to a card's modal — don't
       rename `pelican` without updating the bonuses that point at it. */
    portfolio: {
      title: "Lookbook",
      intro: "Built for stages and aisles. More as they're shot.",
      cards: [
        {
          id: "mgw",
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
          id: "pelican",
          title: "National costume: the brown pelican",
          initials: "SXM",
          thinking:
            "Sint Maarten's national bird, built to be worn: silver " +
            "glitter, grey wings, mesh and tulle. In heels.",
          image: "",
          alt: "",
          detail:
            "Concept, build and stage, start to finish — and the clearest " +
            "example of the Microscopic Budget Method there is. The brown " +
            "pelican is the island's national bird and a genuinely " +
            "unglamorous animal up close, which is exactly why it works: " +
            "the costume had to read as wingspan from the back of a " +
            "theatre while still letting me walk, turn and hit a mark in " +
            "heels. Mesh, tulle, glitter and patience, not a budget."
        },
        {
          id: "malta",
          /* TODO(Kyle): TWO things to fix here.
             (1) The exact title and year of the Malta win.
             (2) The photo now attached is captioned, on your own account,
                 "Suit-look for @faconastyle at @messe_dornbirn" — Dornbirn,
                 Austria, April 2018. That is not Malta. Either the title
                 needs to change to match the photo, or this is the wrong
                 photo for this card. The copy below claims no location, so
                 nothing false is published until you decide. */
          title: "Fashion show winner — Malta",
          initials: "MLT",
          thinking:
            "A suit built to be walked in: the jacket holds its line " +
            "through a full stride, and the shoes were chosen to be seen " +
            "mid-step.",
          image: "../assets/styling/suit-look.jpg",
          alt:
            "Kyle Patrick in a navy three-piece suit and bow tie, " +
            "mid-stride against a white building with louvred shutters",
          detail: ""
        }
      ]
    },

    /* ---- 7. Client results ----
       The quotes themselves live in styling.testimonials.js. */
    results: {
      title: "Client results",
      /* Leave empty until there are real quotes to introduce. */
      intro: "",
      /* false — placeholder quotes are hidden, and the whole section
         disappears while there are no real ones. true — show them, for
         checking the layout locally. Never publish with this on. */
      showPlaceholders: false,
      beforeLabel: "Before",
      afterLabel: "After",
      placeholderNote: "Placeholder — not a real client"
    },

    /* ---- 8. The reel ---- */
    reel: {
      title: "In motion",
      intro: "Because a still photograph cannot show you a movement test.",
      placeholder: "Reel slot — paste a link into REEL_URL to fill this.",
      cta: "Watch on Instagram"
    },

    /* ---- 9. Credentials strip ---- */
    credentials: [
      "19 years in professional performance",
      "Mr Gay World — Sint Maarten titleholder",
      /* TODO(Kyle): confirm the exact wording of the Malta win. */
      "Fashion show winner, Malta",
      "Working remotely worldwide, based on Sint Maarten",
      "English · Nederlands · Deutsch"
    ],

    /* ---- 10. The signup form and its lead magnet ---- */
    waitlist: {
      title: "Free download: The 5-Point Movement Test",
      intro:
        "Will your look survive the moment? Five tests every look has to " +
        "pass before you wear it: walk, sit, embrace, heat, lens. It's the " +
        "test I run on my own costumes, and you can use it tonight on a " +
        "wardrobe you already own.",
      /* The small print under the button — says plainly what signing up does. */
      consequence:
        "You'll get the PDF and a place on the Style Sprint list. " +
        "Leave whenever you like.",
      nameLabel: "Your name",
      emailLabel: "Email",
      instagramLabel: "Instagram handle",
      instagramHint: "Optional — it helps me see what you already wear.",
      /* Free text, not a dropdown: clients are spread across Europe and
         North America, and a two-option list would be wrong for almost
         everyone who fills this in. */
      locationLabel: "Country of residence",
      locationHint: "So I know your time zone and what ships to you.",
      preparingLabel: "I'm preparing for",
      preparingOptions: [
        "A pageant",
        "A performance",
        "My wedding",
        "Everyday style"
      ],
      interestLabel: "Interested in",
      /* The offers themselves fill this dropdown — add one above and it
         appears here automatically, in the same order. This is only the
         extra choice tacked on the end. Set to "" to drop it. */
      interestFallback: "Not sure yet",
      goalLabel: "What's the occasion, or the goal?",
      goalHint: "A sentence is plenty.",
      consentLabel:
        "Yes, you can email me the PDF and news about Style Sprints. " +
        "No list-selling, no spam.",
      submit: "Send me the test",
      sending: "Sending…",
      success: "It's yours.",
      /* Second line of the thank-you, under the headline. */
      successTail:
        "Check your inbox too — and when you're ready for a look that " +
        "passes all five, I'm here.",
      /* Added under the success message when LEAD_MAGNET_URL is set. */
      successWithFile: "Your copy of the 5-Point Movement Test is below.",
      downloadCta: "Download the 5-Point Movement Test",
      /* Used when there is no PDF yet, so nothing is promised that the
         page cannot actually do. */
      successNoFile: "I'll email you the PDF shortly.",
      error:
        "That didn't send — the connection dropped. Try again, or email me " +
        "directly at info@kyepa.com.",
      emailFallback: "Email me instead",
      mailtoHandoff: "Opening your email app with this filled in — just hit send.",
      required: "Please fill this in."
    },

    /* ---- 11. FAQ ----
       Objection-led: each one is a reason someone talks themselves out of
       this, answered straight. */
    faq: {
      title: "Questions",
      items: [
        {
          q: "I'm not a model — will this work for me?",
          a:
            "It works better, honestly. Models are already used to being " +
            "looked at; most of my clients are not, and that is the actual " +
            "problem we are solving. None of this depends on your height, " +
            "your size or your face. It depends on knowing who you're " +
            "becoming, and then being dressed so the room reads it before " +
            "you open your mouth."
        },
        {
          q: "I'm on a tight budget.",
          a:
            "Then you are exactly who the Microscopic Budget Method is " +
            "for — it comes with the Delegate Look Package. I built a " +
            "national costume out of mesh, tulle, " +
            "glitter and patience; the pelican is in the lookbook above. " +
            "The Full Image Sprint also splits into three monthly " +
            "payments, and the Style Sprint starts at €250 so you can " +
            "begin somewhere rather than nowhere."
        },
        {
          q: "Can you really style me remotely?",
          a:
            "Yes — most of my clients have never been to the island. The " +
            "Remote Video Audit Process is built for exactly this: you " +
            "walk me through your own wardrobe on your phone, which tells " +
            "me more than a showroom ever would. We work in your time " +
            "zone. In-person days on Sint Maarten are an option, never a " +
            "requirement."
        },
        {
          q: "How does personal shopping work if I live abroad?",
          a:
            "Two ways. Either I send you a curated shortlist from brands " +
            "that deliver to your door, with sizes, links and what to do " +
            "if something doesn't fit — or we shop together in person, in " +
            "your city or mine. Either way every pick is chosen to pass " +
            "all five tests, so nothing arrives that only works standing " +
            "still."
        },
        {
          q: "What's the movement test?",
          a:
            "Five tests, every look, before you wear it: the walk, the " +
            "sit, the reach and embrace, the heat and the lens. Clothes " +
            "behave differently on a moving body than on a hanger, and a " +
            "look that only works standing still isn't finished. Nineteen " +
            "years on stage taught me that the expensive way. The free " +
            "guide above walks you through all five, with a scorecard."
        },
        {
          q: "What if it doesn't feel right?",
          a:
            "Then you get your money back. If our first session doesn't " +
            "feel right, it's a full refund — no forms, no fuss, and no " +
            "conversation where I try to talk you round."
        }
      ]
    },

    /* ---- 12. Closing CTA ---- */
    closing: {
      headline: "Ready to look like the life you're designing?",
      cta: "Get the free Movement Test",
      /* Mailto, for anyone who would rather just talk. */
      ctaSecondary: "Book a conversation"
    },

    /* ---- Shared furniture ----
       Shown on placeholder tiles and frames, so an unfinished page still
       reads as deliberate rather than broken. */
    placeholderLabel: "Image to come",
    modalClose: "Close"
  }
};
