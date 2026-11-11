/* ==========================================================================
   KYEPA WEDDINGS — renderer for /weddings/
   ==========================================================================
   Builds the page out of weddings.config.js. Nothing a visitor reads is
   written in here: to change wording, a price or a status, edit the config.

   Self-contained, the same way mgw/ and styling/ are — this site has no
   module system, so each section of it carries its own small renderer
   rather than importing from a shared one.

   Conventions match the rest of the site: <details> for the FAQ (keyboard
   -usable with no JavaScript), the .contact-button pill for CTAs, and the
   --progress custom property for the scroll-driven blur.
   ========================================================================== */

const CFG = window.WEDDINGS_CONFIG || {};
const S = (CFG.strings || {});

const AVAILABLE = "available";

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

function placeholderTile(initials, extraClass = "") {
  const label = S.placeholderLabel || "Image to come";
  return el("div", {
    class: `wed-placeholder ${extraClass}`.trim(),
    role: "img",
    "aria-label": initials ? `${initials} — ${label}` : label
  }, [el("span", { text: initials || label })]);
}

/* The single source of truth for whether a service is open. Everything —
   badge, muted styling, button label, form option — reads this. */
function statusOf(card) {
  return CFG[card.statusKey] === AVAILABLE ? AVAILABLE : "coming_soon";
}

function updateScrollProgress() {
  const progress = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
  document.documentElement.style.setProperty("--progress", progress.toFixed(4));
}

/* --------------------------------------------------------------------------
   Banner — a real date, no countdown, removes itself once it passes
   -------------------------------------------------------------------------- */
function buildBanner() {
  const u = CFG.URGENCY || {};
  if (!u.enabled || !u.endsAt) return null;
  const end = new Date(`${u.endsAt}T23:59:59`);
  if (Number.isNaN(end.getTime())) return null;
  const now = new Date();
  if (now > end) return null;

  const opts = { day: "numeric", month: "long" };
  if (end.getFullYear() !== now.getFullYear()) opts.year = "numeric";
  const text = String(u.text || "").replace("{date}", end.toLocaleDateString("en-GB", opts));
  if (!text) return null;

  return el("aside", { class: "wed-banner", "aria-label": "Offer notice" }, [
    el("p", { class: "wed-banner-text", text })
  ]);
}

/* --------------------------------------------------------------------------
   1. Hero
   -------------------------------------------------------------------------- */
function buildHero() {
  const hero = S.hero || {};
  const media = hero.media
    ? el("img", {
        class: "wed-hero-media",
        src: hero.media,
        alt: hero.mediaAlt || "",
        decoding: "async",
        fetchpriority: "high"
      })
    : placeholderTile("", "wed-placeholder--hero");

  return el("section", { class: "wed-hero wed-wide" }, [
    el("div", { class: "wed-hero-copy" }, [
      el("h1", { class: "wed-hero-title", text: hero.headline || "" }),
      el("p", { class: "wed-hero-subline", text: hero.subline || "" }),
      el("p", { class: "wed-hero-cta" }, [
        el("a", { class: "contact-button", href: "#wed-enquiry", text: hero.cta || "" })
      ])
    ]),
    el("div", { class: "wed-hero-frame" }, [media])
  ]);
}

/* --------------------------------------------------------------------------
   2. Ways to work together
   --------------------------------------------------------------------------
   One card per service. Its status decides the badge, the muted styling,
   the button label and which option the button preselects in the form —
   flipping a status in the config changes all four at once.
   -------------------------------------------------------------------------- */
function buildWays() {
  const ways = S.ways || {};

  const cards = (ways.cards || []).map((card) => {
    const open = statusOf(card) === AVAILABLE;
    const label = open ? ways.ctaAvailable : ways.ctaComingSoon;

    const button = el("a", {
      class: "contact-button wed-way-button",
      href: "#wed-enquiry",
      text: label || "Plan a conversation"
    });
    button.addEventListener("click", () => {
      // Preselect this service's option; the form's own change handler
      // then does the rest (hiding date and guest count, and relabelling
      // the submit button for a notify-me).
      const select = document.getElementById("wed-location");
      if (select && card.formValue &&
          [...select.options].some((o) => o.value === card.formValue)) {
        select.value = card.formValue;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });

    return el("div", {
      class: `wed-way${open ? "" : " wed-way--soon"}`
    }, [
      el("div", { class: "wed-way-head" }, [
        card.place ? el("p", { class: "wed-way-place", text: card.place }) : null,
        open ? null : el("p", { class: "wed-way-badge", text: ways.comingSoonBadge || "Coming soon" })
      ]),
      el("h3", { class: "wed-way-name", text: card.name || "" }),
      el("p", { class: "wed-way-body", text: card.body || "" }),
      el("p", { class: "wed-way-price", text: ways.priceLabel || "Price on request" }),
      el("p", { class: "wed-way-cta" }, [button])
    ]);
  });

  return el("section", { class: "wed-ways wed-wide", id: "wed-ways" }, [
    el("h2", { text: ways.title || "" }),
    ways.intro ? el("p", { class: "wed-section-intro", text: ways.intro }) : null,
    el("div", { class: "wed-way-grid" }, cards)
  ]);
}

/* --------------------------------------------------------------------------
   3 & 4. Who I work with, and the legal note
   -------------------------------------------------------------------------- */
function buildProse(data, extraClass) {
  if (!data || !data.body) return null;
  return el("section", { class: `wed-prose ${extraClass}`.trim() }, [
    el("h2", { text: data.title || "" }),
    el("p", { text: data.body })
  ]);
}

/* --------------------------------------------------------------------------
   5. The safe promise
   -------------------------------------------------------------------------- */
function buildSafe() {
  const safe = S.safe || {};
  if (!safe.body) return null;

  const shield = svg("svg", {
    class: "wed-safe-seal",
    viewBox: "0 0 24 24", width: "40", height: "40",
    fill: "none", stroke: "currentColor", "stroke-width": "1.5",
    "stroke-linecap": "round", "stroke-linejoin": "round",
    "aria-hidden": "true", focusable: "false"
  }, [
    svg("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }),
    svg("path", { d: "m9 12 2 2 4-4" })
  ]);

  return el("section", { class: "wed-safe" }, [
    el("div", { class: "wed-safe-plate" }, [
      shield,
      el("div", {}, [
        el("h2", { class: "wed-safe-title", text: safe.title || "" }),
        el("p", { class: "wed-safe-body", text: safe.body }),
        // Only shown once the training is actually done.
        CFG.SAFE_HARBOUR_SEAL
          ? el("p", { class: "wed-safe-badge", text: safe.sealLabel || "" })
          : null
      ])
    ])
  ]);
}

/* --------------------------------------------------------------------------
   6. First dance
   -------------------------------------------------------------------------- */
function buildFirstDance() {
  const fd = S.firstDance || {};
  const slot = CFG.FIRST_DANCE_VIDEO
    ? el("video", {
        class: "wed-dance-video",
        src: CFG.FIRST_DANCE_VIDEO,
        controls: "", playsinline: "", preload: "metadata"
      })
    : el("p", { class: "wed-dance-placeholder", text: fd.placeholder || "" });

  return el("section", { class: "wed-dance" }, [
    el("h2", { text: fd.title || "" }),
    el("p", { class: "wed-section-intro", text: fd.body || "" }),
    el("div", { class: "wed-dance-frame" }, [slot])
  ]);
}

/* --------------------------------------------------------------------------
   7. Portfolio
   -------------------------------------------------------------------------- */
function buildPortfolio() {
  const pf = S.portfolio || {};
  const cards = (pf.cards || []).map((card) => {
    const figure = card.image
      ? el("img", {
          class: "wed-card-image", src: card.image,
          alt: card.alt || card.title || "",
          loading: "lazy", decoding: "async"
        })
      : placeholderTile(card.initials, "wed-placeholder--card");

    return el("figure", { class: "wed-card" }, [
      figure,
      el("figcaption", {}, [
        el("h3", { class: "wed-card-title", text: card.title || "" }),
        el("p", { class: "wed-card-thinking", text: card.thinking || "" })
      ])
    ]);
  });

  if (!cards.length) return null;
  return el("section", { class: "wed-portfolio wed-wide" }, [
    el("h2", { text: pf.title || "" }),
    pf.intro ? el("p", { class: "wed-section-intro", text: pf.intro }) : null,
    el("div", { class: "wed-card-grid" }, cards)
  ]);
}

/* --------------------------------------------------------------------------
   8. FAQ
   -------------------------------------------------------------------------- */
function buildFaq() {
  const faq = S.faq || {};
  const items = (faq.items || []).map((item) =>
    el("details", { class: "wed-faq-item" }, [
      el("summary", { class: "wed-faq-q" }, [
        el("h3", { class: "wed-faq-q-text", text: item.q || "" })
      ]),
      el("div", { class: "wed-faq-a" }, [el("p", { text: item.a || "" })])
    ])
  );

  return el("section", { class: "wed-faq" }, [
    el("h2", { text: faq.title || "" }),
    el("div", { class: "wed-faq-list" }, items)
  ]);
}

/* --------------------------------------------------------------------------
   9. Enquiry form
   -------------------------------------------------------------------------- */
function field(id, labelText, control, hint, extraClass = "") {
  const hintId = hint ? `${id}-hint` : null;
  if (hintId) control.setAttribute("aria-describedby", hintId);
  return el("div", { class: `wed-field ${extraClass}`.trim() }, [
    el("label", { for: id, text: labelText }),
    hint ? el("p", { class: "wed-field-hint", id: hintId, text: hint }) : null,
    control
  ]);
}

/* The Dutch-side option, read from the card whose status is coming_soon,
   so the form and the cards can never describe different things. */
function notifyOption() {
  const card = (S.ways.cards || []).find((c) => statusOf(c) !== AVAILABLE);
  return card ? card.formValue : "";
}

function buildEnquiry() {
  const q = S.enquiry || {};
  const endpoint = CFG.FORM_ENDPOINT || "";
  const email = CFG.CONTACT_EMAIL || "info@kyepa.com";
  const notifyValue = notifyOption();

  const names = el("input", { type: "text", id: "wed-names", name: "names", required: "" });
  const emailInput = el("input", {
    type: "email", id: "wed-email", name: "email", required: "", autocomplete: "email"
  });
  const country = el("input", {
    type: "text", id: "wed-country", name: "country", required: "",
    autocomplete: "country-name"
  });

  const locationSelect = el("select", { id: "wed-location", name: "location", required: "" },
    [el("option", { value: "", text: "Choose one" })].concat(
      (S.ways.cards || []).map((c) => el("option", { value: c.formValue, text: c.formValue }))
    )
  );

  // Not required: a month and a year is a guess at this stage, and both of
  // these are hidden entirely for a notify-me.
  const date = el("input", { type: "text", id: "wed-date", name: "date" });
  const guests = el("input", { type: "number", id: "wed-guests", name: "guests", min: "0" });

  const needs = el("fieldset", { class: "wed-fieldset" }, [
    el("legend", { text: q.needsLabel || "What do you need?" }),
    q.needsHint ? el("p", { class: "wed-field-hint", text: q.needsHint }) : null,
    el("div", { class: "wed-check-grid" },
      (q.needsOptions || []).map((opt, i) => {
        const id = `wed-need-${i}`;
        return el("div", { class: "wed-check" }, [
          el("input", { type: "checkbox", id, name: "needs", value: opt }),
          el("label", { for: id, text: opt })
        ]);
      })
    )
  ]);

  const identity = el("input", { type: "text", id: "wed-identity", name: "identity" });
  const message = el("textarea", { id: "wed-message", name: "message", rows: "3" });
  const consent = el("input", {
    type: "checkbox", id: "wed-consent", name: "consent", required: "", value: "yes"
  });

  // Lets Dutch-side enquiries be filtered out of the inbox at a glance.
  const tag = el("input", { type: "hidden", name: "tag", value: "wedding-enquiry" });
  const subject = el("input", {
    type: "hidden", name: "_subject", value: "Wedding enquiry"
  });

  const status = el("p", {
    class: "wed-form-status", role: "status", "aria-live": "polite", tabindex: "-1"
  });
  const submit = el("button", {
    type: "submit", class: "contact-button wed-submit", text: q.submit || "Send it over"
  });

  const dateField = field("wed-date", q.dateLabel || "Approximate date", date, q.dateHint);
  const guestsField = field("wed-guests", q.guestsLabel || "Guests", guests);

  const form = el("form", {
    id: "wed-enquiry-form", class: "wed-form",
    action: endpoint || "", method: "POST"
  }, [
    field("wed-names", q.namesLabel || "Your names", names, q.namesHint, "wed-field--wide"),
    field("wed-email", q.emailLabel || "Email", emailInput),
    field("wed-country", q.countryLabel || "Country of residence", country, q.countryHint),
    field("wed-location", q.locationLabel || "Where's the wedding?", locationSelect,
      null, "wed-field--wide"),
    dateField,
    guestsField,
    needs,
    field("wed-identity", q.identityLabel || "", identity, q.identityHint, "wed-field--wide"),
    field("wed-message", q.messageLabel || "Anything else?", message, null, "wed-field--wide"),
    el("div", { class: "wed-field wed-field--consent" }, [
      consent,
      el("label", { for: "wed-consent", text: q.consentLabel || "" })
    ]),
    tag, subject,
    el("p", { class: "wed-form-actions" }, [submit]),
    status
  ]);

  /* A notify-me is not an enquiry: there is no date and no guest count to
     give yet, so those fields come out entirely rather than sitting there
     looking unanswerable. */
  function syncToLocation() {
    const isNotify = !!notifyValue && locationSelect.value === notifyValue;
    dateField.hidden = isNotify;
    guestsField.hidden = isNotify;
    submit.textContent = isNotify
      ? (q.submitNotify || "Notify me")
      : (q.submit || "Send it over");
    tag.value = isNotify ? "dutch-side-notify" : "wedding-enquiry";
    subject.value = isNotify ? "Dutch side — notify me" : "Wedding enquiry";
  }
  locationSelect.addEventListener("change", syncToLocation);
  syncToLocation();

  function successBlock() {
    const isNotify = tag.value === "dutch-side-notify";
    return el("div", {
      class: "wed-form-status wed-form-status--ok", role: "status", tabindex: "-1"
    }, [
      el("p", { class: "wed-success-line", text: q.success || "" }),
      el("p", {
        class: "wed-success-tail",
        text: isNotify ? (q.successNotify || "") : (q.successTail || "")
      })
    ]);
  }

  if (endpoint) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submit.disabled = true;
      const restore = submit.textContent;
      submit.textContent = q.sending || "Sending…";
      status.textContent = "";
      status.className = "wed-form-status";

      fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const done = successBlock();
          form.replaceWith(done);
          done.focus();
        })
        .catch(() => {
          submit.disabled = false;
          submit.textContent = restore;
          status.className = "wed-form-status wed-form-status--error";
          status.textContent = q.error || "";
          status.focus();
        });
    });
  } else {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const lines = [
        `${q.namesLabel}: ${data.get("names") || ""}`,
        `${q.emailLabel}: ${data.get("email") || ""}`,
        `${q.countryLabel}: ${data.get("country") || ""}`,
        `${q.locationLabel} ${data.get("location") || ""}`,
        `${q.dateLabel}: ${data.get("date") || ""}`,
        `${q.guestsLabel} ${data.get("guests") || ""}`,
        `${q.needsLabel} ${data.getAll("needs").join(", ")}`,
        `${q.identityLabel} ${data.get("identity") || ""}`,
        `${q.messageLabel} ${data.get("message") || ""}`
      ].join("\n");

      status.className = "wed-form-status";
      status.textContent = q.mailtoHandoff || "";
      window.location.href = `mailto:${email}` +
        `?subject=${encodeURIComponent(subject.value)}` +
        `&body=${encodeURIComponent(lines)}`;
    });
  }

  return el("section", { class: "wed-enquiry", id: "wed-enquiry" }, [
    el("h2", { text: q.title || "" }),
    q.intro ? el("p", { class: "wed-section-intro", text: q.intro }) : null,
    form,
    el("p", { class: "wed-form-alt" }, [
      el("a", {
        href: `mailto:${email}?subject=${encodeURIComponent("Wedding enquiry")}`,
        text: q.emailFallback || "Email me instead"
      })
    ])
  ]);
}

/* --------------------------------------------------------------------------
   Structured data
   --------------------------------------------------------------------------
   Only services that are actually open are published. A "coming soon" card
   is a promise to the reader, not an offer a search engine should list.
   -------------------------------------------------------------------------- */
function injectStructuredData() {
  const ways = S.ways || {};
  const faq = S.faq || {};
  const open = (ways.cards || []).filter((c) => statusOf(c) === AVAILABLE);

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: CFG.BRAND_WEDDINGS_NAME || "KYEPA Weddings",
    serviceType: "LGBTQ wedding planner St. Martin",
    description: (S.hero || {}).subline || "",
    audience: {
      "@type": "Audience",
      audienceType: "LGBTQ+ couples and every couple marrying on St. Martin or abroad"
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
      { "@type": "Place", name: "Saint-Martin" },
      { "@type": "Place", name: "Sint Maarten" },
      { "@type": "Place", name: "Worldwide (remote)" }
    ],
    url: "https://kyepa.com/weddings/",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: ways.title || "Wedding services",
      itemListElement: open.map((c) => ({
        "@type": "Offer",
        name: c.name,
        itemOffered: { "@type": "Service", name: c.name, description: c.body },
        availability: "https://schema.org/InStock"
      }))
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
  // The sub-brand name is config-driven, so the nav and footer read it too.
  document.querySelectorAll("[data-wed-brand]").forEach((node) => {
    node.textContent = CFG.BRAND_WEDDINGS_NAME || "KYEPA Weddings";
  });

  mount("wed-banner", buildBanner());
  mount("wed-hero", buildHero());
  mount("wed-ways-mount", buildWays());
  mount("wed-who", buildProse(S.who, "wed-prose--who"));
  mount("wed-legal", buildProse(S.legal, "wed-prose--legal"));
  mount("wed-safe", buildSafe());
  mount("wed-dance", buildFirstDance());
  mount("wed-portfolio", buildPortfolio());
  mount("wed-faq", buildFaq());
  mount("wed-enquiry-mount", buildEnquiry());
  injectStructuredData();

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();

  const video = document.querySelector(".bg-video-a");
  if (video) video.playbackRate = 0.4;
}

render();
