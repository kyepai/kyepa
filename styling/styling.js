/* ==========================================================================
   STYLED IN MOTION — renderer for /styling/
   ==========================================================================
   Builds the page out of styling.config.js, with the client quotes coming
   from styling.testimonials.js. Nothing a visitor reads is written in here:
   to change wording or a price, edit the data files, not this one.

   Same conventions as the rest of the site: native <dialog> for the
   case-study modals (which hands us the focus trap and Escape for free),
   <details> for the FAQ accordion (keyboard-usable with no JavaScript at
   all), and the --progress custom property for the scroll-driven blur.
   ========================================================================== */

const CFG = window.STYLING_CONFIG || {};
const S = (CFG.strings || {});
const TESTIMONIALS = window.STYLING_TESTIMONIALS || [];

/* Lookbook dialogs, keyed by card id, so a bonus listed on an offer can
   open the case study that proves it. Filled by buildPortfolio(). */
const caseDialogs = new Map();

/* --------------------------------------------------------------------------
   Small DOM helpers. `text` sets textContent (never innerHTML), so nothing
   from the data files can inject markup by accident.
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

/* SVG needs its own namespace — createElement would produce an inert
   HTML element that renders nothing. */
const SVG_NS = "http://www.w3.org/2000/svg";
function svg(tag, attrs = {}, children = []) {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  children.filter(Boolean).forEach((c) => node.appendChild(c));
  return node;
}

function mount(id, section) {
  const host = document.getElementById(id);
  if (host && section) host.replaceChildren(section);
}

/* A placeholder tile in the same idiom as the homepage's testimonial
   photos: a gradient box with initials, so an unshot slot still reads as
   deliberate rather than broken. */
function placeholderTile(initials, extraClass = "") {
  const label = S.placeholderLabel || "Image to come";
  // role="img" means the text inside is not announced twice.
  return el("div", {
    class: `styling-placeholder ${extraClass}`.trim(),
    role: "img",
    "aria-label": initials ? `${initials} — ${label}` : label
  }, [el("span", { text: initials || label })]);
}

/* Every CTA on the page lands on the one form. Where the CTA belongs to a
   specific offer, it also preselects that offer in the form's dropdown, so
   nobody has to answer a question the click already answered. */
function ctaLink(label, offerName, extraClass = "") {
  const link = el("a", {
    class: `contact-button ${extraClass}`.trim(),
    href: "#styling-waitlist",
    text: label
  });
  if (offerName) {
    link.addEventListener("click", () => {
      const select = document.getElementById("sl-interest");
      if (select && [...select.options].some((o) => o.value === offerName)) {
        select.value = offerName;
      }
    });
  }
  return link;
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
   0. Founding-client banner
   --------------------------------------------------------------------------
   Driven entirely by a real date. No countdown clock, no invented stock
   number, and it removes itself once the date has passed rather than
   quietly becoming a lie.
   -------------------------------------------------------------------------- */
function buildBanner() {
  const u = CFG.URGENCY || {};
  if (!u.enabled || !u.endsAt) return null;

  // End of the named day, in the visitor's own timezone.
  const end = new Date(`${u.endsAt}T23:59:59`);
  if (Number.isNaN(end.getTime())) return null;

  const now = new Date();
  if (now > end) return null;

  const opts = { day: "numeric", month: "long" };
  // Only name the year when it is not this one, so the line stays short.
  if (end.getFullYear() !== now.getFullYear()) opts.year = "numeric";
  const date = end.toLocaleDateString("en-GB", opts);

  const text = String(u.text || "").replace("{date}", date);
  if (!text) return null;

  return el("aside", { class: "styling-banner", "aria-label": "Offer notice" }, [
    el("p", { class: "styling-banner-text", text })
  ]);
}

/* --------------------------------------------------------------------------
   1. Hero
   -------------------------------------------------------------------------- */
function buildHero() {
  const hero = S.hero || {};

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

  return el("section", { class: "styling-hero styling-wide" }, [
    el("div", { class: "styling-hero-copy" }, [
      el("h1", { class: "styling-hero-title", text: hero.headline || "" }),
      el("p", { class: "styling-hero-subline", text: hero.subline || "" }),
      el("p", { class: "styling-hero-cta" }, [
        ctaLink(hero.cta || ""),
        // Secondary route for anyone who came to see prices, not to
        // download anything. #styling-offers is the mount div in index.html.
        hero.ctaSecondary
          ? el("a", {
              class: "styling-hero-cta-secondary",
              href: "#styling-offers",
              text: hero.ctaSecondary
            })
          : null
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
   4. Offers — a ladder of tiers. Reuses the main site's .offer-name /
   .offer-price row so pricing reads identically to the homepage's Suite
   of Offers.
   -------------------------------------------------------------------------- */
function bonusList(bonuses) {
  if (!bonuses || !bonuses.length) return null;

  const items = bonuses.map((bonus) => {
    const label = [
      el("span", { class: "styling-bonus-name", text: bonus.name || "" }),
      bonus.line ? el("span", { class: "styling-bonus-line", text: bonus.line }) : null
    ].filter(Boolean);

    // A bonus that points at a lookbook card opens it, so the claim comes
    // with its own evidence attached.
    const dialog = bonus.caseStudy ? caseDialogs.get(bonus.caseStudy) : null;
    if (dialog) {
      const button = el("button", {
        type: "button",
        class: "styling-bonus-link",
        "aria-haspopup": "dialog",
        "aria-controls": dialog.id
      }, label);
      button.addEventListener("click", () => dialog.showModal());
      return el("li", { class: "styling-bonus" }, [button]);
    }
    return el("li", { class: "styling-bonus" }, [
      el("div", { class: "styling-bonus-text" }, label)
    ]);
  });

  return el("div", { class: "styling-bonuses" }, [
    el("p", { class: "styling-bonus-label", text: (S.offers || {}).bonusLabel || "Included" }),
    el("ul", { class: "styling-bonus-list" }, items)
  ]);
}

function buildOffers() {
  const offers = S.offers || {};
  const items = (offers.items || []).map((item) =>
    el("div", { class: "styling-offer" }, [
      // Tier and badge share a row above the name.
      (item.tier || item.badge)
        ? el("div", { class: "styling-offer-head" }, [
            item.tier ? el("p", { class: "styling-offer-tier", text: item.tier }) : null,
            item.badge ? el("p", { class: "styling-offer-badge", text: item.badge }) : null
          ])
        : null,
      el("h3", { class: "offer-name" }, [
        el("span", { text: item.name || "" }),
        el("span", { class: "offer-price", text: item.price || "" })
      ]),
      item.priceNote
        ? el("p", { class: "styling-offer-pricenote", text: item.priceNote })
        : null,
      item.meta ? el("p", { class: "styling-offer-meta", text: item.meta }) : null,
      el("p", { class: "styling-offer-body", text: item.body || "" }),
      bonusList(item.bonuses),
      el("p", { class: "styling-offer-cta" }, [
        ctaLink(item.cta || offers.ctaDefault || "Enquire", item.name,
          "styling-offer-button")
      ])
    ])
  );

  return el("section", { class: "styling-offers styling-wide" }, [
    el("h2", { text: offers.title || "" }),
    offers.intro ? el("p", { class: "styling-section-intro", text: offers.intro }) : null,
    el("div", { class: "styling-offer-grid" }, items),
    offers.note ? el("p", { class: "styling-offer-note", text: offers.note }) : null
  ]);
}

/* --------------------------------------------------------------------------
   5. The guarantee — a seal in the same line-icon idiom as the homepage's
   scroll arrow and Instagram mark.
   -------------------------------------------------------------------------- */
function buildGuarantee() {
  const g = S.guarantee || {};
  if (!g.body) return null;

  const shield = svg("svg", {
    class: "styling-guarantee-seal",
    viewBox: "0 0 24 24",
    width: "40", height: "40",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "1.5",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "aria-hidden": "true",
    focusable: "false"
  }, [
    svg("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }),
    svg("path", { d: "m9 12 2 2 4-4" })
  ]);

  return el("section", { class: "styling-guarantee" }, [
    el("div", { class: "styling-guarantee-plate" }, [
      shield,
      el("div", { class: "styling-guarantee-copy" }, [
        el("h2", { class: "styling-guarantee-title", text: g.title || "" }),
        el("p", { class: "styling-guarantee-body", text: g.body })
      ])
    ])
  ]);
}

/* --------------------------------------------------------------------------
   6. Portfolio / lookbook. A card with `detail` opens a modal; one without
   is a plain tile. Dialogs are registered by id so the bonuses above can
   open them too.
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
      const dialogId = `styling-case-${card.id || index}`;

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

      if (card.id) caseDialogs.set(card.id, dialog);
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
   7. Client results
   --------------------------------------------------------------------------
   A card marked `placeholder` says so on its face. Invented praise passed
   off as real is the one thing on this page that could actually cost Kyle
   something, so the label is not subtle and these cards are also kept out
   of the structured data.
   -------------------------------------------------------------------------- */
function buildResults() {
  if (!TESTIMONIALS.length) return null;
  const r = S.results || {};

  const cards = TESTIMONIALS.map((item, index) => {
    const initials = (item.name || "")
      .split(/\s+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 3).toUpperCase();

    const portrait = item.photo
      ? el("img", {
          class: "styling-result-photo",
          src: item.photo,
          alt: item.alt || item.name || "",
          loading: "lazy",
          decoding: "async"
        })
      : placeholderTile(initials || "—", "styling-placeholder--avatar");

    // Before/after only renders as a pair. One of the two on its own tells
    // the visitor nothing and looks like a mistake.
    let compare = null;
    if (item.before && item.after) {
      compare = el("div", { class: "styling-result-compare" }, [
        el("figure", { class: "styling-result-shot" }, [
          el("img", {
            class: "styling-result-image", src: item.before,
            alt: `${r.beforeLabel || "Before"} — ${item.name || ""}`,
            loading: "lazy", decoding: "async"
          }),
          el("figcaption", { text: r.beforeLabel || "Before" })
        ]),
        el("figure", { class: "styling-result-shot" }, [
          el("img", {
            class: "styling-result-image", src: item.after,
            alt: `${r.afterLabel || "After"} — ${item.name || ""}`,
            loading: "lazy", decoding: "async"
          }),
          el("figcaption", { text: r.afterLabel || "After" })
        ])
      ]);
    }

    return el("figure", {
      class: `styling-result${item.placeholder ? " styling-result--placeholder" : ""}`
    }, [
      item.placeholder
        ? el("p", { class: "styling-result-flag", text: r.placeholderNote || "Placeholder" })
        : null,
      compare,
      el("blockquote", { class: "styling-result-quote" }, [
        el("p", { text: item.quote || "" })
      ]),
      el("figcaption", { class: "styling-result-by" }, [
        portrait,
        el("div", { class: "styling-result-who" }, [
          el("span", { class: "styling-result-name", text: item.name || "" }),
          item.role ? el("span", { class: "styling-result-role", text: item.role }) : null
        ])
      ])
    ]);
  });

  return el("section", { class: "styling-results styling-wide" }, [
    el("h2", { text: r.title || "" }),
    r.intro ? el("p", { class: "styling-section-intro", text: r.intro }) : null,
    el("div", { class: "styling-result-grid" }, cards)
  ]);
}

/* --------------------------------------------------------------------------
   8. The reel. Instagram's /embed/ route renders in a plain iframe, so the
   reel can be embedded without loading any Instagram JavaScript — no
   third-party tracking added to the site.
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
   9. Credentials strip
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
   10. The lead magnet form
   ----------------------------------------------------------------------
   A real <form> with a real action, so it still submits with JavaScript
   off. With JavaScript on the submit is intercepted and answered inline.

   With no FORM_ENDPOINT set it degrades to a pre-filled email rather than
   silently going nowhere.
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

/* The "Interested in" choices are DERIVED from the offers rather than typed
   out again, so adding an offer can never leave its own CTA pointing at a
   dropdown entry that does not exist. */
function interestChoices(w) {
  const names = ((S.offers || {}).items || []).map((o) => o.name).filter(Boolean);
  const fallback = w.interestFallback || "";
  return fallback ? names.concat([fallback]) : names;
}

function selectField(id, name, options, required = true) {
  return el("select", { id, name, required: required ? "" : null },
    [el("option", { value: "", text: "Choose one" })].concat(
      (options || []).map((opt) => el("option", { value: opt, text: opt }))
    )
  );
}

/* What the visitor sees once the signup has gone through. */
function successBlock(w) {
  const file = CFG.LEAD_MAGNET_URL || "";
  const block = el("div", {
    class: "styling-form-status styling-form-status--ok",
    role: "status",
    tabindex: "-1"
  }, [
    el("p", { class: "styling-success-line", text: w.success || "" }),
    el("p", {
      class: "styling-success-sub",
      // Never promise a download that does not exist yet.
      text: file ? (w.successWithFile || "") : (w.successNoFile || "")
    })
  ]);

  if (file) {
    block.appendChild(el("p", { class: "styling-success-download" }, [
      el("a", {
        class: "contact-button",
        href: file,
        download: "",
        text: w.downloadCta || "Download"
      })
    ]));
  }
  return block;
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

  const locationSelect = selectField("sl-location", "location", w.locationOptions);
  const preparingSelect = selectField("sl-preparing", "preparing", w.preparingOptions);
  const interestSelect = selectField("sl-interest", "interest", interestChoices(w));

  const goalInput = el("textarea", { id: "sl-goal", name: "goal", rows: "3" });

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
    type: "submit", class: "contact-button styling-submit", text: w.submit || "Send it"
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
    field("sl-preparing", w.preparingLabel || "I'm preparing for", preparingSelect),
    // Full width: with an odd number of fields, a two-column grid leaves
    // one alone on its row, and these are the two worth the space.
    field("sl-interest", w.interestLabel || "Interested in", interestSelect, null,
      "styling-field--wide"),
    field("sl-goal", w.goalLabel || "Occasion or goal", goalInput, w.goalHint,
      "styling-field--wide"),
    el("div", { class: "styling-field styling-field--consent" }, [
      consentInput,
      el("label", { for: "sl-consent", text: w.consentLabel || "" })
    ]),
    // Formspree reads these two: a subject line for the notification email,
    // and a honeypot that silently drops bot submissions.
    el("input", { type: "hidden", name: "_subject", value: "5-Point Movement Test — new signup" }),
    el("input", {
      type: "text", name: "_gotcha", tabindex: "-1",
      class: "styling-honeypot", "aria-hidden": "true", autocomplete: "off"
    }),
    el("p", { class: "styling-form-actions" }, [submit]),
    w.consequence
      ? el("p", { class: "styling-form-consequence", text: w.consequence })
      : null,
    status
  ]);

  if (endpoint) {
    form.addEventListener("submit", (event) => {
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
          const done = successBlock(w);
          form.replaceWith(done);
          done.focus();
        })
        .catch(() => {
          submit.disabled = false;
          submit.textContent = w.submit || "Send it";
          status.className = "styling-form-status styling-form-status--error";
          status.textContent = w.error || "";
          status.focus();
        });
    });
  } else {
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
        `${w.preparingLabel}: ${data.get("preparing") || ""}`,
        `${w.interestLabel}: ${data.get("interest") || ""}`,
        `${w.goalLabel} ${data.get("goal") || ""}`
      ].join("\n");

      status.className = "styling-form-status";
      status.textContent = w.mailtoHandoff || "";
      window.location.href = `mailto:${email}` +
        `?subject=${encodeURIComponent("The 5-Point Movement Test")}` +
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
        href: `mailto:${email}?subject=${encodeURIComponent("The 5-Point Movement Test")}`,
        text: w.emailFallback || "Email me instead"
      })
    ])
  ]);
}

/* --------------------------------------------------------------------------
   11. FAQ — <details>/<summary>, which is an accordion that already works
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
   12. Closing CTA
   -------------------------------------------------------------------------- */
function buildClosing() {
  const closing = S.closing || {};
  return el("section", { class: "styling-closing" }, [
    el("h2", { class: "styling-closing-title", text: closing.headline || "" }),
    el("p", {}, [ctaLink(closing.cta || "")])
  ]);
}

/* --------------------------------------------------------------------------
   Structured data. Generated from the config so the prices Google reads
   can never drift from the prices on the page.

   Deliberately omits reviews and ratings. Every quote on the page is
   currently a marked placeholder, and publishing invented praise as
   machine-readable review data is how a site earns a manual penalty —
   quite apart from it being a lie.
   -------------------------------------------------------------------------- */
function priceValue(price) {
  // "From €1,800" -> "1800". Anything without a number has no price.
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
      category: item.tier || undefined,
      itemOffered: { "@type": "Service", name: item.name, description: item.body },
      // Every numeric price here is a "from" price, so minPrice is the
      // honest field. "Price TBC" and "Ask me" carry no price at all.
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
    serviceType: "Personal, stage and pageant styling",
    description: (S.hero || {}).subline || "",
    audience: {
      "@type": "Audience",
      audienceType: "Pageant delegates, performers and public figures"
    },
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
   --------------------------------------------------------------------------
   The lookbook is built first, even though it appears partway down the
   page: building it is what registers the case-study dialogs that the
   offer bonuses link to. Each section mounts into its own placeholder, so
   build order and page order are independent.
   -------------------------------------------------------------------------- */
function render() {
  const portfolio = buildPortfolio();

  mount("styling-banner", buildBanner());
  mount("styling-hero", buildHero());
  mount("styling-idea", buildIdea());
  mount("styling-method", buildMethod());
  mount("styling-offers", buildOffers());
  mount("styling-guarantee", buildGuarantee());
  mount("styling-portfolio", portfolio);
  mount("styling-results", buildResults());
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
