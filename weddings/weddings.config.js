/* ==========================================================================
   KYEPA WEDDINGS — config
   ==========================================================================
   The only file you edit for day-to-day changes to /weddings/: the three
   service cards and their statuses, prices, FAQ answers, portfolio entries,
   where the enquiry form sends. No build step — save, reload.

   Quick reference
   ---------------
   Open the Dutch side ..... WEDDING_DUTCH_SIDE_STATUS = "available"
   Rename the sub-brand .... BRAND_WEDDINGS_NAME
   Turn the form on ........ paste your Formspree URL into FORM_ENDPOINT
   Show the SAFE seal ...... SAFE_HARBOUR_SEAL = true
   Reword anything ......... every visible string is in here

   Who this page talks to
   ----------------------
   Queer couples first — grooms, brides, couples beyond the binary — and
   every couple welcome. Write it that way round: queer couples lead, the
   welcome is genuine and never an afterthought, and nothing assumes a
   bride and a groom. Most couples live in Europe or North America, so
   "wherever you live" is the default and the island is where they might
   come to, not where they already are.
   ========================================================================== */

window.WEDDINGS_CONFIG = {

  /* Working name for the sub-brand. It appears in the nav of this page,
     the footer and the share card.
     TODO(Kyle): still undecided — change it here and it changes everywhere. */
  BRAND_WEDDINGS_NAME: "KYEPA Weddings",

  CONTACT_EMAIL: "info@kyepa.com",
  INSTAGRAM_HANDLE: "kye_pa",

  /* Same arrangement as the styling page: no build step means no server and
     no environment variables, so a form needs somewhere off-site to post
     to. Empty = the form falls back to a pre-filled email, which still
     works. A Formspree endpoint is a public address, not a secret.
     See weddings/README.md. */
  FORM_ENDPOINT: "",

  /* ----------------------------------------------------------------------
     Service statuses — "available" | "coming_soon"
     ----------------------------------------------------------------------
     These three drive everything about their cards: the badge, the muted
     styling, the button label, and whether the matching option in the
     enquiry form says "notify me". Flip a value to "available" and the
     card, the button and the form all change. Nothing else to edit. */
  WEDDING_FRENCH_SIDE_STATUS: "available",
  WEDDING_DUTCH_SIDE_STATUS: "coming_soon",
  WEDDING_STYLING_STATUS: "available",

  /* The SAFE Harbour seal is hidden until you have actually been through
     the training and can show it honestly. */
  SAFE_HARBOUR_SEAL: false,

  /* A short video of a first dance. Leave empty for a marked placeholder.
     TODO(Kyle): choose the clip. */
  FIRST_DANCE_VIDEO: "",

  /* Optional banner, same rules as the styling page: a real end date, no
     countdown, removes itself once the date passes. Off here by default —
     founding-client pricing reads oddly on a wedding page. */
  URGENCY: {
    enabled: false,
    endsAt: "2027-01-31",
    text: "Founding-couple pricing until {date} — prices rise after."
  },

  strings: {

    /* ---- 1. Hero ---- */
    hero: {
      headline: "Married exactly as yourselves.",
      subline:
        "Queer-first weddings, with every couple welcome. Destination " +
        "weddings on St. Martin and wedding styling wherever you live.",
      cta: "Plan a conversation",
      media: "../assets/weddings/hero.jpg",
      /* Describes what is actually in the frame. It is deliberately two
         shirts rather than two faces: it reads as two grooms without
         casting anybody, and it will not date. */
      mediaAlt:
        "Two white dress shirts laid side by side on deep red cloth, each " +
        "bordered by a different paisley print",
      /* The hero frame normally widens to 16:9 on a desktop. This image is
         square, and the two paisley borders at its edges are the whole
         point of the composition, so the frame keeps the image's own ratio
         instead of cropping them off. Remove this line and the frame goes
         back to being responsive. */
      mediaRatio: "1 / 1"
    },

    /* ---- 2. Ways to work together ----
       `statusKey` names the switch in the config above that drives this
       card. `formValue` is the matching option in the enquiry form. */
    ways: {
      title: "Ways to work together",
      intro:
        "Three ways in, wherever in the world you're getting married.",
      comingSoonBadge: "Coming soon",
      ctaAvailable: "Plan a conversation",
      ctaComingSoon: "Notify me",
      priceLabel: "Price on request",
      cards: [
        {
          id: "french",
          statusKey: "WEDDING_FRENCH_SIDE_STATUS",
          name: "Destination weddings — French side",
          place: "Saint-Martin",
          body:
            "Full planning for a wedding on the French side: venues, the " +
            "vendor team, the run of the day, and the guest experience " +
            "from the moment they land. I am on the island; you don't " +
            "have to be until the week itself.",
          formValue: "French side (Saint-Martin)"
        },
        {
          id: "dutch",
          statusKey: "WEDDING_DUTCH_SIDE_STATUS",
          name: "Destination weddings — Dutch side",
          place: "Sint Maarten",
          body:
            "The same planning, the same team, the other half of the " +
            "island. Not open yet — tell me you want it and you'll be " +
            "first to hear when it is.",
          formValue: "Dutch side — notify me"
        },
        {
          id: "styling",
          statusKey: "WEDDING_STYLING_STATUS",
          name: "Wedding styling, anywhere",
          place: "Remote or in person",
          body:
            "Couple and groom styling, personal shopping for the day, and " +
            "first-dance choreography — I'm a professional dancer, so the " +
            "dance is mine too, not a referral. Works entirely over video " +
            "wherever you live, or in person if you'd rather.",
          formValue: "At home or elsewhere"
        }
      ]
    },

    /* ---- 3. Who I work with ---- */
    who: {
      title: "Who I work with",
      body:
        "My speciality is queer weddings: grooms, brides, couples beyond " +
        "the binary, and the families who show up for them. Every couple " +
        "who wants a day that truly feels like them is welcome. Queer " +
        "couples simply get first priority in my calendar."
    },

    /* ---- 4. Legal & symbolic ceremonies ----
       Deliberately factual and free of specific legal claims. Rules differ
       by nationality and residence and they change.
       TODO(Kyle): confirm current rules with the Collectivité de
       Saint-Martin civil registry before adding any detail here. */
    legal: {
      title: "Legal and symbolic ceremonies",
      body:
        "Every couple's legal path depends on nationality and residence. " +
        "I'll walk you through your options, from a legal ceremony to a " +
        "symbolic one, and connect you with the right authorities."
    },

    /* ---- 5. The SAFE promise ---- */
    safe: {
      title: "The safe promise",
      body:
        "Every vendor on your team is chosen for how they'll treat you, " +
        "not just what they deliver. You will never be the couple who has " +
        "to explain themselves to the florist.",
      /* Only rendered while SAFE_HARBOUR_SEAL is true. */
      sealLabel: "SAFE Harbour trained",
      sealNote: "Placeholder seal — switch on once the training is done."
    },

    /* ---- 6. First dance ---- */
    firstDance: {
      title: "The first dance",
      body:
        "Nineteen years on stage, pointed at the three minutes everyone " +
        "films. We choreograph something that fits how you actually move — " +
        "and that works in the shoes and the clothes you'll really be " +
        "wearing. Over video, or in the room with you.",
      placeholder: "Video slot — set FIRST_DANCE_VIDEO to fill this."
    },

    /* ---- 7. Portfolio ----
       Kyle's own wedding, Amsterdam 2017, pulled from @kye_pai.
       TODO(Kyle): two things to confirm before this stays up for long.
       (1) Petr is clearly identifiable in all three — he should be happy
       about appearing on a commercial page, which is different from
       appearing on your Instagram. (2) These were extracted from phone
       screenshots, so they are only ~390–470px wide. If you still have the
       originals they will look markedly better on a retina screen. */
    portfolio: {
      title: "The work",
      intro: "Starting where I have to start: my own.",
      cards: [
        {
          title: "The rings — Amsterdam, 2017",
          initials: "",
          thinking:
            "My own wedding day. Two hands, two rings, and the only " +
            "styling detail anybody photographed up close.",
          image: "../assets/weddings/rings.jpg",
          alt:
            "Two hands clasped together, both wearing plain wedding " +
            "bands, on a street in Amsterdam"
        },
        {
          title: "Two grooms, two white shirts",
          initials: "",
          thinking:
            "White shirts photograph brutally in window light. These " +
            "were chosen to hold their shape through a long, warm day.",
          image: "../assets/weddings/grooms.jpg",
          alt:
            "Two grooms in open white shirts kissing at a table by a window"
        },
        {
          title: "Museumplein — the shoot after",
          initials: "",
          thinking:
            "Amsterdam, days later, for an editorial collection. The " +
            "same two people, styled for a camera instead of a ceremony.",
          image: "../assets/weddings/museumplein.jpg",
          alt:
            "A couple standing together in front of the I amsterdam " +
            "letters at Museumplein, with the Rijksmuseum behind them"
        }
      ]
    },

    /* ---- 8. FAQ ---- */
    faq: {
      title: "Questions",
      items: [
        {
          q: "Do you only plan queer weddings?",
          a:
            "Queer weddings are my speciality and my priority, and every " +
            "couple is welcome. What that means in practice: queer couples " +
            "get first priority in my calendar, and nobody who books me " +
            "has to brief me on their relationship before we start."
        },
        {
          q: "Can we legally marry on the island?",
          a:
            "It depends on your nationalities and where you live, and the " +
            "rules are not the same on the French and Dutch sides. I'd " +
            "rather talk it through with you than give you a wrong answer " +
            "on a web page — tell me your situation and I'll point you to " +
            "the right authority. A symbolic ceremony is always open to " +
            "you, wherever the legal paperwork ends up happening."
        },
        {
          q: "When will Dutch-side weddings be available?",
          a:
            "Soon. Tap “Notify me” and you'll be the first to know."
        },
        {
          q: "Do you work with couples who aren't marrying on the island?",
          a:
            "Constantly. Wedding styling, personal shopping for the day " +
            "and first-dance choreography all run over video, wherever " +
            "you live. Most of the couples I style are not getting " +
            "married anywhere near St. Martin."
        },
        {
          q: "Do you choreograph first dances remotely?",
          a:
            "Yes, and it works better than people expect. We go over " +
            "video: I build to your song and how the two of you actually " +
            "move, you practise between sessions and film it, and I give " +
            "notes. We rehearse in the real shoes and the real clothes, " +
            "because that is where first dances come unstuck."
        },
        {
          q: "Is the island welcoming to LGBTQ+ couples and guests?",
          a:
            "Broadly yes, and I won't pretend it's uniform — which is " +
            "exactly why I pick your vendor team the way I do. Every " +
            "supplier on it is chosen for how they'll treat you and your " +
            "guests. If somewhere isn't right for you, you won't hear " +
            "about it from me, because it won't be on your list."
        }
      ]
    },

    /* ---- 9. Enquiry form ---- */
    enquiry: {
      title: "Tell me about your wedding",
      intro:
        "No form on earth captures a wedding. Give me the outline and " +
        "we'll talk properly.",
      namesLabel: "Your names",
      namesHint: "Both of you, however you'd like to be introduced.",
      emailLabel: "Email",
      countryLabel: "Country of residence",
      countryHint: "So I know your time zone.",
      locationLabel: "Where's the wedding?",
      dateLabel: "Approximate date",
      dateHint: "A month and a year is plenty.",
      guestsLabel: "Roughly how many guests?",
      needsLabel: "What do you need?",
      needsHint: "Tick as many as apply.",
      needsOptions: [
        "Planning",
        "Styling",
        "Personal shopping",
        "First dance"
      ],
      identityLabel: "How do you identify as a couple?",
      identityHint:
        "Completely optional, and only here so I never have to guess or " +
        "assume. Skip it with no explanation needed.",
      messageLabel: "Anything else?",
      consentLabel:
        "Yes, you can email me about my wedding enquiry. No list-selling, " +
        "no spam.",
      submit: "Send it over",
      /* Replaces the button label when the Dutch side is selected. */
      submitNotify: "Notify me",
      sending: "Sending…",
      success: "Got it.",
      successTail:
        "I read every one of these myself. You'll hear back from me, not " +
        "a template.",
      successNotify:
        "You're on the list. You'll be the first to know when Dutch-side " +
        "weddings open.",
      error:
        "That didn't send — the connection dropped. Try again, or email " +
        "me directly at info@kyepa.com.",
      emailFallback: "Email me instead",
      mailtoHandoff: "Opening your email app with this filled in — just hit send."
    },

    /* ---- Shared furniture ---- */
    backHome: "kyepa.com",
    placeholderLabel: "Image to come",
    modalClose: "Close"
  }
};
