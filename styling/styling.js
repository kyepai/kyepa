/* ==========================================================================
   STYLED IN MOTION — renderer for /styling/
   ==========================================================================
   Builds the page out of styling.config.js. Nothing a visitor reads is
   written in here: if you want to change wording or a price, edit the
   config, not this file.

   Same conventions as the rest of the site: native <dialog> for the
   case-study modals (which hands us the focus trap and Escape for free),
   <details> for the FAQ accordion (keyboard-usable with no JavaScript at
   all), and the --progress custom property for the scroll-driven blur.
   ========================================================================== */

const CFG = window.STYLING_CONFIG || {};
const S = (CFG.strings || {});

/* --------------------------------------------------------------------------
   Small DOM helper. `text` sets textContent (never innerHTML), so nothing
   from the config can inject markup by accident.
   -------------------------------------------------------------------------- */
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value === null || value === undefined || value === false) return;
    if (key === "text") node.textContent = value;
    else if (key === "class") node.className = value;
    else node.setAttribute(key, value);
  });
  (Array.isArray(children) ? children : [children])
    .filter(Boolean)
    .forEach((child) => node.appendChild(child));
  return node;
}

function mount(id, section) {
  const host = document.getElementById(id);
  if (host && section) host.replaceChildren(section);
}

/* A placeholder tile in the same idiom as the homepage's testimonial
   photos: a gradient box with initials, so an unshot case study still
   reads as deliberate rather than broken. */
function placeholderTile(initials, extraClass = "") {
  const label = S.placeholderLabel || "Image to come";
  // role="img" means the text inside is not announced twice.
  return el("div", {
    class: `styling-placeholder ${extraClass}`.trim(),
    role: "img",
    "aria-label": initials ? `${initials} — ${label}` : label
  }, [el("span", { text: initials || label })]);
}

/* --------------------------------------------------------------------------
   Scroll progress. The homepage exposes this same variable from script.js,
   which this page does not load — see the comment in index.html.
   -------------------------------------------------------------------------- */
function updateScrollProgress() {
  const progress = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
  document.documentElement.style.setProperty("--progress", progress.toFixed(4));
}

/* --------------------------------------------------------------------------
   1. Hero
   -------------------------------------------------------------------------- */
function buildHero() {
  const hero = S.hero || {};

  // Either the real asset or a clearly marked empty frame.
  let media;
  if (hero.media) {
    const isVideo = /\.(mp4|mov|webm)$/i.test(hero.media);
    media = isVideo
      ? el("video", {
          class: "styling-hero-media",
          src: hero.media,
          autoplay: "", muted: "", loop: "", playsinline: "",
          "aria-hidden": "true"
        })
      : el("img", {
          class: "styling-hero-media",
          src: hero.media,
          alt: hero.mediaAlt || "",
          // Above the fold, so this one is NOT lazy-loaded.
          decoding: "async",
          fetchpriority: "high"
        });
    if (media.tagName === "VIDEO") media.muted = true;
  } else {
    media = placeholderTile("", "styling-placeholder--hero");
  }

  return el("section", { class: "styling-hero" }, [
    el("div", { class: "styling-hero-copy" }, [
      el("h1", { class: "styling-hero-title", text: hero.headline || "" }),
      el("p", { class: "styling-hero-subline", text: hero.subline || "" }),
      el("p", { class: "styling-hero-cta" }, [
        el("a", {
          class: "contact-button",
          href: "#styling-waitlist",
          text: hero.cta || ""
        })
      ])
    ]),
    el("div", { class: "styling-hero-frame" }, [media])
  ]);
}

/* --------------------------------------------------------------------------
   2. The idea
   -------------------------------------------------------------------------- */
function buildIdea() {
  const idea = S.idea || {};
  return el("section", { class: "styling-idea" }, [
    el("h2", { text: idea.title || "" }),
    el("p", { text: idea.body || "" })
  ]);
}

/* --------------------------------------------------------------------------
   3. The method — an ordered list, so the numbering is real and a screen
   reader announces "1 of 5" rather than reading decorative digits.
   -------------------------------------------------------------------------- */
function buildMethod() {
  const method = S.method || {};
  const steps = (method.steps || []).map((step) =>
    el("li", { class: "styling-step" }, [
      el("h3", { class: "styling-step-name", text: step.name || "" }),
      el("p", { class: "styling-step-line", text: step.line || "" })
    ])
  );

  return el("section", { class: "styling-method styling-wide" }, [
    el("h2", { text: method.title || "" }),
    method.intro ? el("p", { class: "styling-section-intro", text: method.intro }) : null,
    el("ol", { class: "styling-steps" }, steps)
  ]);
}

/* --------------------------------------------------------------------------
   4. Offers — reuses the main site's .offer-name / .offer-price row so the
   pricing reads identically to the homepage's Suite of Offers.
   -------------------------------------------------------------------------- */
function buildOffers() {
  const offers = S.offers || {};
  const items = (offers.items || []).map((item) =>
    el("div", { class: "styling-offer" }, [
      el("h3", { class: "offer-name" }, [
        el("span", { text: item.name || "" }),
        el("span", { class: "offer-price", text: item.price || "" })
      ]),
      item.meta ? el("p", { class: "styling-offer-meta", text: item.meta }) : null,
      el("p", { text: item.body || "" })
    ])
  );

  return el("section", { class: "styling-offers styling-wide", id: "styling-offers-section" }, [
    el("h2", { text: offers.title || "" }),
    offers.intro ? el("p", { class: "styling-section-intro", text: offers.intro }) : null,
    el("div", { class: "styling-offer-grid" }, items),
    offers.note ? el("p", { class: "styling-offer-note", text: offers.note }) : null
  ]);
}

/* --------------------------------------------------------------------------
   5. Portfolio / lookbook. A card with `detail` text opens a modal; one
   without is a plain, non-interactive tile.
   -------------------------------------------------------------------------- */
function buildPortfolio() {
  const portfolio = S.portfolio || {};
  const cards = [];
  const dialogs = [];

  (portfolio.cards || []).forEach((card, index) => {
    const figure = card.image
      ? el("img", {
          class: "styling-card-image",
          src: card.image,
          alt: card.alt || card.title || "",
          loading: "lazy",
          decoding: "async"
        })
      : placeholderTile(card.initials, "styling-placeholder--card");

    const body = [
      figure,
      el("h3", { class: "styling-card-title", text: card.title || "" }),
      el("p", { class: "styling-card-thinking", text: card.thinking || "" })
    ];

    if (card.detail) {
      const dialogId = `styling-case-${index}`;

      // A real <button> wrapping the card: keyboard-operable for free, no
      // role="button" keydown handler needed.
      const trigger = el("button", {
        type: "button",
        class: "styling-card styling-card--button",
        "aria-haspopup": "dialog",
        "aria-controls": dialogId
      }, body);

      const dialog = el("dialog", { id: dialogId, class: "modal" }, [
        el("div", { class: "modal-content" }, [
          el("button", {
            type: "button",
            class: "modal-close",
            "aria-label": S.modalClose || "Close",
            text: "×"
          }),
          el("h2", { class: "modal-title", text: card.title || "" }),
          el("p", { text: card.detail })
        ])
      ]);

      // Same three listeners as every other modal on the site: trigger,
      // close button, and a backdrop click on the dialog itself.
      trigger.addEventListener("click", () => dialog.showModal());
      dialog.querySelector(".modal-close")
        .addEventListener("click", () => dialog.close());
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });

      cards.push(trigger);
      dialogs.push(dialog);
    } else {
      cards.push(el("div", { class: "styling-card" }, body));
    }
  });

  return el("section", { class: "styling-portfolio styling-wide" }, [
    el("h2", { text: portfolio.title || "" }),
    portfolio.intro ? el("p", { class: "styling-section-intro", text: portfolio.intro }) : null,
    el("div", { class: "styling-card-grid" }, cards),
    ...dialogs
  ]);
}

/* --------------------------------------------------------------------------
   6. The reel. Instagram's /embed/ route renders in a plain iframe, so the
   reel can be embedded without loading any Instagram JavaScript — no
   third-party tracking script added to the site.
   -------------------------------------------------------------------------- */
function embedUrl(url) {
  // Matches /reel/CODE/, /p/CODE/ and /tv/CODE/, ignoring any ?utm_... tail.
  const match = String(url).match(/instagram\.com\/(reel|p|tv)\/([A-Za-z0-9_-]+)/);
  return match ? `https://www.instagram.com/${match[1]}/${match[2]}/embed/` : "";
}

function buildReel() {
  const reel = S.reel || {};
  const embed = CFG.REEL_URL ? embedUrl(CFG.REEL_URL) : "";

  let slot;
  if (embed) {
    slot = el("div", { class: "styling-reel-frame" }, [
      el("iframe", {
        class: "styling-reel-embed",
        src: embed,
        title: reel.title || "Instagram reel",
        loading: "lazy",
        allowfullscreen: "",
        scrolling: "no",
        frameborder: "0"
      })
    ]);
  } else {
    slot = el("div", { class: "styling-reel-frame" }, [
      el("p", { class: "styling-reel-placeholder", text: reel.placeholder || "" })
    ]);
  }

  const handle = CFG.INSTAGRAM_HANDLE || "kye_pa";
  return el("section", { class: "styling-reel" }, [
    el("h2", { text: reel.title || "" }),
    reel.intro ? el("p", { class: "styling-section-intro", text: reel.intro }) : null,
    slot,
    el("p", { class: "styling-reel-cta" }, [
      el("a", {
        href: CFG.REEL_URL || `https://www.instagram.com/${handle}`,
        target: "_blank",
        rel: "noopener",
        text: `${reel.cta || "Watch on Instagram"} @${handle}`
      })
    ])
  ]);
}

/* --------------------------------------------------------------------------
   7. Credentials strip
   -------------------------------------------------------------------------- */
function buildCredentials() {
  const items = (S.credentials || []).map((line) =>
    el("li", { class: "styling-credential", text: line })
  );
  if (!items.length) return null;

  return el("section", { class: "styling-credentials styling-wide", "aria-label": "Credentials" }, [
    el("ul", { class: "styling-credential-list" }, items)
  ]);
}

/* --------------------------------------------------------------------------
   8. Waitlist form
   ----------------------------------------------------------------------
   A real <form> with a real action, so it still submits with JavaScript
   off. With JavaScript on, the submit is intercepted and answered inline
   with the warm success message instead of a page change.

   With no FORM_ENDPOINT set, the form degrades to a pre-filled email
   rather than silently going nowhere.
   -------------------------------------------------------------------------- */
function field(id, labelText, control, hint, extraClass = "") {
  const hintId = hint ? `${id}-hint` : null;
  if (hintId) control.setAttribute("aria-describedby", hintId);
  return el("div", { class: `styling-field ${extraClass}`.trim() }, [
    el("label", { for: id, text: labelText }),
    hint ? el("p", { class: "styling-field-hint", id: hintId, text: hint }) : null,
    control
  ]);
}

function buildWaitlist() {
  const w = S.waitlist || {};
  const endpoint = CFG.FORM_ENDPOINT || "";
  const email = CFG.CONTACT_EMAIL || "info@kyepa.com";

  const nameInput = el("input", {
    type: "text", id: "sl-name", name: "name",
    required: "", autocomplete: "name"
  });
  const emailInput = el("input", {
    type: "email", id: "sl-email", name: "email",
    required: "", autocomplete: "email"
  });
  const igInput = el("input", {
    type: "text", id: "sl-instagram", name: "instagram",
    placeholder: "@", autocomplete: "off"
  });

  const locationSelect = el("select", { id: "sl-location", name: "location", required: "" },
    [el("option", { value: "", text: "Choose one" })].concat(
      (w.locationOptions || []).map((opt) => el("option", { value: opt, text: opt }))
    )
  );

  const interestSelect = el("select", { id: "sl-interest", name: "interest", required: "" },
    [el("option", { value: "", text: "Choose one" })].concat(
      (w.interestOptions || []).map((opt) => el("option", { value: opt, text: opt }))
    )
  );

  const goalInput = el("textarea", {
    id: "sl-goal", name: "goal", rows: "3"
  });

  const consentInput = el("input", {
    type: "checkbox", id: "sl-consent", name: "consent", required: "", value: "yes"
  });

  const status = el("p", {
    class: "styling-form-status",
    role: "status",
    "aria-live": "polite",
    tabindex: "-1"
  });

  const submit = el("button", {
    type: "submit", class: "contact-button styling-submit", text: w.submit || "Join the list"
  });

  const form = el("form", {
    id: "styling-waitlist-form",
    class: "styling-form",
    // Without an endpoint there is nothing to post to, so the submit is
    // composed into an email below instead of posting into the void.
    action: endpoint || "",
    method: "POST"
  }, [
    field("sl-name", w.nameLabel || "Your name", nameInput),
    field("sl-email", w.emailLabel || "Email", emailInput),
    field("sl-instagram", w.instagramLabel || "Instagram handle", igInput, w.instagramHint),
    field("sl-location", w.locationLabel || "Where are you?", locationSelect),
    // Full width: with five fields, a two-column grid leaves one of them
    // alone on its row, and this is the one worth giving the space to.
    field("sl-interest", w.interestLabel || "Interested in", interestSelect, null,
      "styling-field--wide"),
    // Spans both columns on wider screens — it is the one long answer.
    field("sl-goal", w.goalLabel || "Occasion or goal", goalInput, w.goalHint,
      "styling-field--wide"),
    el("div", { class: "styling-field styling-field--consent" }, [
      consentInput,
      el("label", { for: "sl-consent", text: w.consentLabel || "" })
    ]),
    // Formspree reads these two: a subject line for the notification email,
    // and a honeypot that silently drops bot submissions.
    el("input", { type: "hidden", name: "_subject", value: "Style Sprint list — new signup" }),
    el("input", {
      type: "text", name: "_gotcha", tabindex: "-1",
      class: "styling-honeypot", "aria-hidden": "true", autocomplete: "off"
    }),
    el("p", { class: "styling-form-actions" }, [submit]),
    status
  ]);

  if (endpoint) {
    form.addEventListener("submit", (event) => {
      // Let the browser's own validation run and report first.
      if (!form.reportValidity()) return;
      event.preventDefault();

      submit.disabled = true;
      submit.textContent = w.sending || "Sending…";
      status.textContent = "";
      status.className = "styling-form-status";

      fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          // Replace the form outright: nothing left to fill in, and focus
          // lands on the message so a screen reader announces it.
          const done = el("p", {
            class: "styling-form-status styling-form-status--ok",
            role: "status",
            tabindex: "-1",
            text: w.success || ""
          });
          form.replaceWith(done);
          done.focus();
        })
        .catch(() => {
          submit.disabled = false;
          submit.textContent = w.submit || "Join the list";
          status.className = "styling-form-status styling-form-status--error";
          status.textContent = w.error || "";
          status.focus();
        });
    });
  }

  if (!endpoint) {
    // No endpoint configured yet: hand the filled-in answers to the
    // visitor's own mail client so a signup is never simply lost.
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const lines = [
        `${w.nameLabel}: ${data.get("name") || ""}`,
        `${w.emailLabel}: ${data.get("email") || ""}`,
        `${w.instagramLabel}: ${data.get("instagram") || ""}`,
        `${w.locationLabel} ${data.get("location") || ""}`,
        `${w.interestLabel}: ${data.get("interest") || ""}`,
        `${w.goalLabel} ${data.get("goal") || ""}`
      ].join("\n");

      status.className = "styling-form-status";
      status.textContent = w.mailtoHandoff || "";
      window.location.href = `mailto:${email}` +
        `?subject=${encodeURIComponent("Style Sprint list")}` +
        `&body=${encodeURIComponent(lines)}`;
    });
  }

  return el("section", { class: "styling-waitlist" }, [
    el("h2", { text: w.title || "" }),
    w.intro ? el("p", { class: "styling-section-intro", text: w.intro }) : null,
    form,
    // Always offered, endpoint or not — some people would simply rather email.
    el("p", { class: "styling-form-alt" }, [
      el("a", {
        href: `mailto:${email}?subject=${encodeURIComponent("Style Sprint list")}`,
        text: w.emailFallback || "Email me instead"
      })
    ])
  ]);
}

/* --------------------------------------------------------------------------
   9. FAQ — <details>/<summary>, which is an accordion that already works
   with a keyboard and with JavaScript off.
   -------------------------------------------------------------------------- */
function buildFaq() {
  const faq = S.faq || {};
  const items = (faq.items || []).map((item) =>
    el("details", { class: "styling-faq-item" }, [
      el("summary", { class: "styling-faq-q" }, [
        el("h3", { class: "styling-faq-q-text", text: item.q || "" })
      ]),
      el("div", { class: "styling-faq-a" }, [el("p", { text: item.a || "" })])
    ])
  );

  return el("section", { class: "styling-faq" }, [
    el("h2", { text: faq.title || "" }),
    el("div", { class: "styling-faq-list" }, items)
  ]);
}

/* --------------------------------------------------------------------------
   10. Closing CTA
   -------------------------------------------------------------------------- */
function buildClosing() {
  const closing = S.closing || {};
  return el("section", { class: "styling-closing" }, [
    el("h2", { class: "styling-closing-title", text: closing.headline || "" }),
    el("p", {}, [
      el("a", {
        class: "contact-button",
        href: "#styling-waitlist",
        text: closing.cta || ""
      })
    ])
  ]);
}

/* --------------------------------------------------------------------------
   Structured data. Generated from the config so the prices Google reads can
   never drift from the prices on the page.
   -------------------------------------------------------------------------- */
function priceValue(price) {
  // "From €250" -> "250". Anything without a number ("Ask me") has no price.
  const match = String(price).replace(/[.,](?=\d{3}\b)/g, "").match(/\d+/);
  return match ? match[0] : null;
}

function injectStructuredData() {
  const offers = S.offers || {};
  const faq = S.faq || {};

  const catalog = (offers.items || []).map((item) => {
    const value = priceValue(item.price);
    return {
      "@type": "Offer",
      name: item.name,
      itemOffered: { "@type": "Service", name: item.name, description: item.body },
      // Every numeric price on this page is a "from" price, so minPrice is
      // the honest field. "Ask me" carries no price at all.
      ...(value
        ? {
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: value,
              priceCurrency: "EUR"
            }
          }
        : {})
    };
  });

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Styling Consultations",
    alternateName: "Styled in Motion",
    serviceType: "Personal and performance styling",
    description: (S.hero || {}).subline || "",
    provider: {
      "@type": "Person",
      name: "Kyle Patrick",
      alternateName: "KYEPA",
      jobTitle: "Life Experience Designer",
      url: "https://kyepa.com/",
      email: `mailto:${CFG.CONTACT_EMAIL || "info@kyepa.com"}`,
      sameAs: [`https://www.instagram.com/${CFG.INSTAGRAM_HANDLE || "kye_pa"}`]
    },
    areaServed: [
      { "@type": "Country", name: "Sint Maarten" },
      { "@type": "Place", name: "Worldwide (remote and travelling)" }
    ],
    url: "https://kyepa.com/styling/",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: offers.title || "Offers",
      itemListElement: catalog
    }
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (faq.items || []).map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a }
    }))
  };

  [service, faqPage].forEach((data) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  });
}

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */
function render() {
  mount("styling-hero", buildHero());
  mount("styling-idea", buildIdea());
  mount("styling-method", buildMethod());
  mount("styling-offers", buildOffers());
  mount("styling-portfolio", buildPortfolio());
  mount("styling-reel", buildReel());
  mount("styling-credentials", buildCredentials());
  mount("styling-waitlist", buildWaitlist());
  mount("styling-faq", buildFaq());
  mount("styling-closing", buildClosing());
  injectStructuredData();

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();

  // Match the homepage's barely-moving background.
  const video = document.querySelector(".bg-video-a");
  if (video) video.playbackRate = 0.4;
}

render();
