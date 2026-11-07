/* ==========================================================================
   GREENLIT — Mr Gay World 2026 campaign engine
   ==========================================================================
   Vanilla JS, no dependencies, no build step — same as the rest of the site.

   Runs in two modes, decided by which mount element is on the page:
     #mgw-root  →  overlay mode, a native <dialog> on top of the homepage
     #mgw-page  →  page mode, the standalone experience at /mgw/

   The overlay uses dialog.showModal(), which hands us a focus trap, Escape
   handling, an inert background and top-layer stacking for free. That is the
   same pattern index.html already uses for its other modals.

   All copy and configuration lives in mgw.config.js — nothing in this file
   needs editing to run the campaign.
   ========================================================================== */

(function () {
  "use strict";

  var CFG = window.MGW_CONFIG;
  if (!CFG) return;

  /* ------------------------------------------------------------------------
     Phase resolution
     If VOTING_OPENS_AT is set and already past, "greenlit" promotes itself to
     "voting" here in the browser — so the switch can be scheduled in advance
     rather than deployed at the moment voting opens.
     ------------------------------------------------------------------------ */
  function resolvePhase() {
    var phase = CFG.PHASE || "greenlit";
    var opens = parseDate(CFG.VOTING_OPENS_AT);
    if (phase === "greenlit" && opens && Date.now() >= opens) phase = "voting";
    return phase;
  }

  function parseDate(value) {
    if (!value) return null;
    var t = new Date(value).getTime();
    return isNaN(t) ? null : t;
  }

  var PHASE = resolvePhase();
  var S = (CFG.strings && CFG.strings[CFG.LANG || "en"]) || CFG.strings.en;
  var P = S.phases[PHASE] || S.phases.greenlit;
  var T = CFG.INTRO;

  var IG_URL = "https://instagram.com/" + CFG.INSTAGRAM_HANDLE;
  var IG_ALT_URL = CFG.INSTAGRAM_HANDLE_ALT
    ? "https://instagram.com/" + CFG.INSTAGRAM_HANDLE_ALT
    : "";

  /* ------------------------------------------------------------------------
     Asset paths, resolved against this script's own URL.
     The homepage lives at / and the standalone route at /mgw/, so a single
     hardcoded path cannot be right for both — and a root-absolute one breaks
     entirely when index.html is opened straight from disk over file://.
     mgw.js always sits in mgw/, so ../assets/mgw/ relative to itself is
     correct everywhere.
     ------------------------------------------------------------------------ */
  var SCRIPT_URL = (function () {
    if (document.currentScript && document.currentScript.src) {
      return document.currentScript.src;
    }
    /* Fallback for any browser that does not set currentScript. */
    var tags = document.getElementsByTagName("script");
    for (var i = tags.length - 1; i >= 0; i--) {
      if (/mgw\.js(\?|#|$)/.test(tags[i].src || "")) return tags[i].src;
    }
    return "";
  })();

  /* ------------------------------------------------------------------------
     Featured-post card — the "Captains of our own Destinies" carousel.
     A thumbnail that opens the Instagram post. Returns null when
     FEATURE_POST_URL is blank, so clearing the config removes the card.
     ------------------------------------------------------------------------ */
  function featurePost() {
    if (!CFG.FEATURE_POST_URL) return null;

    var thumb = el("img", {
      class: "mgw-feature-thumb",
      src: assetUrl("cod.jpg"),
      alt: S.featureAlt,
      loading: "lazy",
      decoding: "async",
      width: "1080",
      height: "1350"
    });

    var card = el("a", {
      class: "mgw-feature mgw-rise",
      href: CFG.FEATURE_POST_URL,
      target: "_blank",
      rel: "noopener",
      style: "--mgw-i:6"
    }, [
      thumb,
      el("span", { class: "mgw-feature-text" }, [
        el("span", { class: "mgw-feature-kicker", text: S.featureKicker }),
        el("span", { class: "mgw-feature-title", text: S.featureTitle }),
        el("span", { class: "mgw-feature-cta", text: S.featureCta + " →" })
      ])
    ]);

    card.addEventListener("click", function () {
      track("feature_post", CFG.FEATURE_POST_URL);
    });
    return card;
  }

  function assetUrl(name) {
    try {
      return new URL("../assets/mgw/" + name, SCRIPT_URL).href;
    } catch (err) {
      return "../assets/mgw/" + name;
    }
  }

  /* Opened from disk there is no web root, and a file:// directory URL lists
     files rather than serving index.html — so point straight at the file.
     Served normally, the tidy CFG.ROUTE path is used. */
  var onDisk = window.location.protocol === "file:";

  function fileRelative(relative, fallback) {
    try {
      return new URL(relative, SCRIPT_URL).href;
    } catch (err) {
      return fallback;
    }
  }

  function routeUrl() {
    return onDisk ? fileRelative("index.html", CFG.ROUTE) : CFG.ROUTE;
  }

  function homeUrl() {
    return onDisk ? fileRelative("../index.html", "/") : "/";
  }

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ------------------------------------------------------------------------
     Analytics hook
     The site currently has no analytics, so this deliberately installs no
     tracking script. It fires a DOM event and feeds the usual globals only
     if something else has already defined them. Listen for it with:
       document.addEventListener("mgw:track", function (e) { e.detail })
     ------------------------------------------------------------------------ */
  function track(action, detail) {
    var payload = { action: action, phase: PHASE, detail: detail || null };
    try {
      document.dispatchEvent(new CustomEvent("mgw:track", { detail: payload }));
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push(
          Object.assign({ event: "mgw_" + action }, payload)
        );
      }
      if (typeof window.gtag === "function") {
        window.gtag("event", "mgw_" + action, payload);
      }
    } catch (err) {
      /* Never let a missing analytics stack break the experience. */
    }
  }

  /* ------------------------------------------------------------------------
     Dismissal memory. Keyed to CAMPAIGN_VERSION, so bumping that value in
     the config re-shows the pop-up for everyone. All access is wrapped,
     because localStorage throws outright in some privacy modes.
     ------------------------------------------------------------------------ */
  var STORE_KEY = "mgw:dismissed:" + CFG.CAMPAIGN_VERSION;

  function wasDismissed() {
    try {
      return window.localStorage.getItem(STORE_KEY) === "1";
    } catch (err) {
      return false;
    }
  }

  function rememberDismissal() {
    /* With ALWAYS_OPEN set, dismissal is deliberately not remembered — the
       pop-up is meant to greet every visit for the length of the campaign. */
    if (CFG.ALWAYS_OPEN) return;
    try {
      window.localStorage.setItem(STORE_KEY, "1");
    } catch (err) {
      /* Private browsing: the pop-up simply shows again next visit. */
    }
  }

  /* Has the film already played in this tab? sessionStorage, so it resets
     when the browser is closed and the next real visit gets the full film. */
  function introSeenThisSession() {
    try {
      if (window.sessionStorage.getItem("mgw:intro-seen") === "1") return true;
      window.sessionStorage.setItem("mgw:intro-seen", "1");
    } catch (err) {
      /* No session storage: play the film, which is the better failure. */
    }
    return false;
  }

  /* ------------------------------------------------------------------------
     Tiny DOM helper. Text always goes in via textContent, never innerHTML.
     ------------------------------------------------------------------------ */
  function el(tag, attrs, kids) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var val = attrs[key];
        if (val === null || val === undefined || val === false) return;
        if (key === "text") node.textContent = val;
        else if (key === "class") node.className = val;
        else if (key === "style") node.setAttribute("style", val);
        else node.setAttribute(key, val);
      });
    }
    (kids || []).forEach(function (kid) {
      if (kid) node.appendChild(kid);
    });
    return node;
  }

  /* ------------------------------------------------------------------------
     Phase-dependent call to action
     Voting gets the real link the moment VOTING_URL is filled in; until then
     it falls back to Instagram so the button is never a dead end.
     ------------------------------------------------------------------------ */
  function primaryAction() {
    if (PHASE === "voting") {
      return {
        label: P.ctaPrimary,
        href: CFG.VOTING_URL || IG_URL,
        event: "vote_cta",
        external: true
      };
    }
    if (PHASE === "competing" || PHASE === "results") {
      return {
        label: P.ctaPrimary,
        href: IG_URL,
        event: "instagram_cta",
        external: true
      };
    }
    /* greenlit: a mailto, so interest can be collected with no backend. */
    return {
      label: P.ctaPrimary,
      href:
        "mailto:" +
        CFG.CONTACT_EMAIL +
        "?subject=" +
        encodeURIComponent("Notify me when voting opens"),
      event: "notify_cta",
      external: false
    };
  }

  function ctaLink(action, variant) {
    var node = el("a", {
      class: "mgw-cta " + variant + " mgw-rise",
      href: action.href,
      target: action.external ? "_blank" : null,
      rel: action.external ? "noopener" : null,
      text: action.label
    });
    node.addEventListener("click", function () {
      track(action.event, action.href);
    });
    return node;
  }

  /* ========================================================================
     The film stage — shared by both modes
     ======================================================================== */
  function buildFilm(mode) {
    var primary = primaryAction();

    /* ---- Scene 1: the dramatised clock ---- */
    var clockValue = el("span", {
      class: "mgw-clock-value",
      text: formatFilmClock(T.clockFrom, 1)
    });

    var clock = el("div", { class: "mgw-clock" }, [
      el("span", { class: "mgw-clock-label", text: S.clockLabel }),
      clockValue
    ]);

    /* Type-on lines. The strings sit in the DOM as real text from the first
       frame; only a width reveal and a caret animate, so assistive tech
       reads the whole line regardless of where the animation is. */
    var lineA = el("span", {
      class: "mgw-type-line mgw-type-line--a",
      text: P.typeA,
      style: "--mgw-ch-a:" + (P.typeA.length + 1) + "ch"
    });

    var lineB = el("span", {
      class: "mgw-type-line mgw-type-line--b",
      style: "--mgw-ch-b:" + (P.typeB.length + 2) + "ch"
    });
    lineB.appendChild(document.createTextNode(P.typeB));
    lineB.appendChild(el("i", { class: "mgw-caret", "aria-hidden": "true" }));

    var scene1 = el("div", { class: "mgw-scene1" }, [
      clock,
      el("div", { class: "mgw-type" }, [
        el("div", {}, [lineA]),
        el("div", {}, [lineB])
      ])
    ]);

    /* ---- Scene 2: the clapperboard ---- */
    var slate = el("div", { class: "mgw-slate", "aria-hidden": "true" }, [
      el("div", { class: "mgw-slate-arm" }),
      el("div", { class: "mgw-slate-bar" })
    ]);

    /* ---- Scene 3: the word ---- */
    var word = el("div", { class: "mgw-word-wrap" }, [
      el("p", { class: "mgw-word", text: P.word })
    ]);

    var glitter = reduceMotion
      ? null
      : el("canvas", { class: "mgw-glitter", "aria-hidden": "true" });

    /* ---- Scene 4: the hero ---- */
    var heroImg = el("img", {
      src: assetUrl("hero.jpg"),
      alt: S.heroAlt,
      loading: "lazy",
      decoding: "async",
      width: "1200",
      height: "1600"
    });
    var heroMedia = el("div", { class: "mgw-hero-media mgw-rise", style: "--mgw-i:4" }, [
      heroImg
    ]);

    /* A missing file falls back to the silver gradient on the frame rather
       than a broken-image icon. Closed over heroMedia, since the error can
       in principle fire before the image is in the document. */
    heroImg.addEventListener("error", function () {
      heroMedia.classList.add("is-missing");
    });

    /* The voting status line is written to be completed by the countdown
       ("Voting closes in" + clock). With no VOTING_CLOSES_AT there is no
       clock, so fall back to a line that stands on its own rather than
       leaving a sentence hanging. */
    var countsDown = PHASE === "voting" && !!parseDate(CFG.VOTING_CLOSES_AT);
    var statusText = (PHASE === "voting" && !countsDown && P.statusOpen)
      ? P.statusOpen
      : P.status;

    var statusClock = el("span", { class: "mgw-status-clock" });
    var status = el("p", { class: "mgw-status mgw-rise", style: "--mgw-i:3" }, [
      el("span", { text: statusText })
    ]);
    if (countsDown) {
      status.appendChild(statusClock);
    }

    var igCta = ctaLink(
      { label: S.instagramCta, href: IG_URL, event: "instagram_cta", external: true },
      "mgw-cta--ghost"
    );
    igCta.style.setProperty("--mgw-i", "5");

    var primaryCta = ctaLink(primary, "mgw-cta--primary");
    primaryCta.style.setProperty("--mgw-i", "4");

    /* The second account sits beside the first as a quieter text link, so
       both are reachable without the row carrying two equal-weight buttons. */
    var altIg = null;
    if (IG_ALT_URL) {
      altIg = el("a", {
        class: "mgw-alt-ig mgw-rise",
        href: IG_ALT_URL,
        target: "_blank",
        rel: "noopener",
        style: "--mgw-i:5",
        text: S.instagramAltCta
      });
      altIg.addEventListener("click", function () {
        track("instagram_cta", CFG.INSTAGRAM_HANDLE_ALT);
      });
    }

    var heroCopy = el("div", { class: "mgw-hero-copy" }, [
      el("p", { class: "mgw-eyebrow mgw-rise", text: S.eyebrow, style: "--mgw-i:0" }),
      el("h1", { class: "mgw-headline mgw-rise", text: P.headline, style: "--mgw-i:1" }),
      el("p", { class: "mgw-subline mgw-rise", text: P.subline, style: "--mgw-i:2" }),
      status,
      el("div", { class: "mgw-actions" }, [primaryCta, igCta, altIg]),
      featurePost()
    ]);

    /* Overlay mode points at the standalone route for the full story;
       page mode is already there, so it links back to the main site. */
    if (mode === "overlay") {
      var more = el("a", {
        class: "mgw-more mgw-rise",
        href: routeUrl(),
        style: "--mgw-i:6",
        text: S.fullStory + " →"
      });
      more.addEventListener("click", function () {
        track("full_story", CFG.ROUTE);
      });
      heroCopy.appendChild(more);
    }

    var hero = el("div", { class: "mgw-hero" }, [heroCopy, heroMedia]);

    /* ---- HUD + controls ---- */
    var timecode = el("div", { class: "mgw-hud-tc", text: "00:00:00:00" });

    var hud = el("div", { class: "mgw-hud", "aria-hidden": "true" }, [
      el("div", { class: "mgw-hud-reel", text: S.reel }),
      timecode,
      el("div", { class: "mgw-hud-route", text: S.route })
    ]);

    var skipBtn = el("button", {
      type: "button",
      class: "mgw-btn-ghost mgw-skip",
      text: S.skip
    });

    var replayBtn = el("button", {
      type: "button",
      class: "mgw-btn-ghost mgw-replay",
      text: S.replay,
      hidden: "hidden"
    });

    var controls = el("div", { class: "mgw-controls" }, [replayBtn, skipBtn]);

    var film = el("div", { class: "mgw-film" }, [
      el("div", { class: "mgw-tex mgw-tulle", "aria-hidden": "true" }),
      el("div", { class: "mgw-tex mgw-mesh", "aria-hidden": "true" }),
      scene1,
      slate,
      el("div", { class: "mgw-flash", "aria-hidden": "true" }),
      word,
      glitter,
      hero,
      el("div", { class: "mgw-tex mgw-grain", "aria-hidden": "true" }),
      el("div", { class: "mgw-bar mgw-bar--top", "aria-hidden": "true" }),
      el("div", { class: "mgw-bar mgw-bar--bottom", "aria-hidden": "true" }),
      hud,
      controls
    ]);

    return {
      film: film,
      clockValue: clockValue,
      timecode: timecode,
      glitter: glitter,
      skipBtn: skipBtn,
      replayBtn: replayBtn,
      statusClock: statusClock,
      primaryCta: primaryCta
    };
  }

  /* ------------------------------------------------------------------------
     Clock formatting
     The film clock is a prop: it counts a dramatised run of seconds, and
     scene 2 drops it to seconds-only for the close-up.
     ------------------------------------------------------------------------ */
  function pad(n, width) {
    var s = String(Math.max(0, Math.floor(n)));
    while (s.length < (width || 2)) s = "0" + s;
    return s;
  }

  function formatFilmClock(seconds, scene) {
    if (scene >= 2) return pad(seconds);
    return "00:" + pad(seconds / 60) + ":" + pad(seconds % 60);
  }

  /* Live countdown to VOTING_CLOSES_AT, used in the voting phase. */
  function formatCountdown(ms) {
    if (ms <= 0) return "00:00:00";
    var total = Math.floor(ms / 1000);
    var days = Math.floor(total / 86400);
    var hours = Math.floor((total % 86400) / 3600);
    var mins = Math.floor((total % 3600) / 60);
    var secs = total % 60;
    var hms = pad(hours) + ":" + pad(mins) + ":" + pad(secs);
    return days > 0 ? days + "d " + hms : hms;
  }

  /* ========================================================================
     Scene engine
     ======================================================================== */
  function createProjector(root, parts) {
    var timers = [];
    var tickers = [];
    /* The film clock is held separately from `tickers`: it retires itself
       when the film ends, and must not take the live voting countdown
       (which starts a second earlier, in scene 4) down with it. */
    var filmTicker = null;
    var startedAt = 0;
    var glitterStop = null;

    function clearAll() {
      timers.forEach(clearTimeout);
      timers = [];
      tickers.forEach(clearInterval);
      tickers = [];
      if (filmTicker) {
        clearInterval(filmTicker);
        filmTicker = null;
      }
      if (glitterStop) {
        glitterStop();
        glitterStop = null;
      }
    }

    function setScene(n) {
      root.setAttribute("data-scene", String(n));
      /* Skip is only meaningful while the film is still running. */
      parts.skipBtn.hidden = n >= 4;
      parts.replayBtn.hidden = n < 4 || reduceMotion;
    }

    /* Jump straight to the hero: used by "Skip intro", by reduced motion,
       and when the pill reopens an already-seen film. */
    function toHero() {
      clearAll();
      setScene(4);
      startLiveCountdown();
    }

    function run() {
      clearAll();
      startedAt = Date.now();
      setScene(1);

      timers.push(setTimeout(function () { setScene(2); }, T.scene2));
      timers.push(
        setTimeout(function () {
          setScene(3);
          if (parts.glitter) glitterStop = burstGlitter(parts.glitter);
        }, T.scene3)
      );
      timers.push(
        setTimeout(function () {
          setScene(4);
          startLiveCountdown();
        }, T.scene4)
      );

      /* The film clock and the corner timecode, both driven off elapsed time
         so they stay honest if a timer is delayed by a busy main thread. */
      filmTicker = setInterval(function () {
        var elapsed = Date.now() - startedAt;
        var scene = elapsed < T.scene2 ? 1 : 2;

        if (elapsed <= T.scene3) {
          var span = Math.min(1, elapsed / T.scene3);
          var secs = T.clockFrom + (T.clockTo - T.clockFrom) * span;
          parts.clockValue.textContent = formatFilmClock(secs, scene);
        }

        if (elapsed <= T.end) {
          var s = Math.floor(elapsed / 1000);
          var frames = Math.floor((elapsed % 1000) / (1000 / 24));
          parts.timecode.textContent =
            "00:" + pad(s / 60) + ":" + pad(s % 60) + ":" + pad(frames);
        } else {
          /* Film over. Retire only this ticker. */
          clearInterval(filmTicker);
          filmTicker = null;
        }
      }, 60);
    }

    /* The voting-phase countdown reuses the same monospace treatment as the
       scene 1 clock — the film's own callback. */
    function startLiveCountdown() {
      var closes = parseDate(CFG.VOTING_CLOSES_AT);
      if (PHASE !== "voting" || !closes) return;

      function paint() {
        parts.statusClock.textContent = formatCountdown(closes - Date.now());
      }
      paint();
      tickers.push(setInterval(paint, 1000));
    }

    parts.skipBtn.addEventListener("click", function () {
      track("skip_intro");
      toHero();
      parts.primaryCta.focus();
    });

    parts.replayBtn.addEventListener("click", function () {
      track("replay_intro");
      run();
    });

    return {
      run: reduceMotion ? toHero : run,
      toHero: toHero,
      stop: clearAll
    };
  }

  /* ========================================================================
     Glitter: silver flakes bursting outward, then drifting down
     Capped particle count, halved on narrow screens, paused when the tab is
     hidden, and torn down the moment the burst is spent.
     ======================================================================== */
  function burstGlitter(canvas) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return function () {};

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0;
    var h = 0;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    var count = Math.min(
      T.particles,
      window.innerWidth < 600 ? Math.round(T.particles / 2) : T.particles
    );

    var flakes = [];
    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 2.2 + Math.random() * 7;
      flakes.push({
        x: w / 2,
        y: h / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 1.5 + Math.random() * 3.5,
        spin: (Math.random() - 0.5) * 0.3,
        rot: Math.random() * Math.PI,
        life: 1,
        /* Silver glitter fading into gray, matching the costume. */
        tone: 200 + Math.round(Math.random() * 55)
      });
    }

    var raf = null;
    var last = performance.now();
    var running = true;

    function frame(now) {
      var dt = Math.min((now - last) / 16.67, 3);
      last = now;

      ctx.clearRect(0, 0, w, h);
      var alive = 0;

      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i];
        if (f.life <= 0) continue;
        alive++;

        f.vy += 0.07 * dt;        /* gravity */
        f.vx *= 0.985;            /* drag */
        f.vy *= 0.991;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.rot += f.spin * dt;
        f.life -= 0.0075 * dt;

        /* Flakes catch the light as they tumble. */
        var flash = 0.55 + 0.45 * Math.abs(Math.cos(f.rot));
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rot);
        ctx.globalAlpha = Math.max(0, f.life) * flash;
        ctx.fillStyle =
          "rgb(" + f.tone + "," + f.tone + "," + (f.tone + 4) + ")";
        ctx.fillRect(-f.size / 2, -f.size / 6, f.size, f.size / 3);
        ctx.restore();
      }

      if (alive === 0) {
        teardown();
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    function onVisibility() {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
      } else if (running && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }

    function teardown() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      ctx.clearRect(0, 0, w, h);
    }

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);

    return teardown;
  }

  /* ========================================================================
     Scroll sections — standalone route only
     ======================================================================== */
  function buildStory() {
    var frames = S.timeline.map(function (item, i) {
      var isKey = /greenlit/i.test(item.title);
      return el(
        "li",
        {
          class: "mgw-frame mgw-reveal" + (isKey ? " mgw-frame--key" : ""),
          style: "--mgw-i:" + (i % 4)
        },
        [
          el("p", { class: "mgw-frame-date", text: item.date }),
          el("h3", { class: "mgw-frame-title", text: item.title }),
          el("p", { class: "mgw-frame-line", text: item.line })
        ]
      );
    });

    return el("section", { class: "mgw-section", id: "story" }, [
      el("div", { class: "mgw-wrap" }, [
        el("div", { class: "mgw-section-head" }, [
          el("h2", { class: "mgw-h2", text: S.storyTitle }),
          el("p", { class: "mgw-hint", text: S.storyHint + " →" })
        ])
      ]),
      el("ol", { class: "mgw-strip", "aria-label": S.storyTitle }, frames)
    ]);
  }

  function buildItinerary() {
    var stops = S.itinerary.map(function (stop, i) {
      return el("li", { class: "mgw-stop", style: "--mgw-i:" + i }, [
        el("span", { class: "mgw-stop-code", text: stop.code }),
        el("span", { class: "mgw-stop-meta" }, [
          el("span", { class: "mgw-stop-place", text: stop.place }),
          el("span", { class: "mgw-stop-note", text: stop.note })
        ])
      ]);
    });

    return el("section", { class: "mgw-section", id: "itinerary" }, [
      el("div", { class: "mgw-wrap" }, [
        el("div", { class: "mgw-section-head" }, [
          el("h2", { class: "mgw-h2", text: S.itineraryTitle })
        ]),
        el("ul", { class: "mgw-route-list" }, stops)
      ])
    ]);
  }

  function buildPartners() {
    var cards = S.partners.map(function (partner) {
      var empty = !partner.name;
      return el(
        "li",
        { class: "mgw-partner mgw-reveal" + (empty ? " mgw-partner--empty" : "") },
        [
          el("p", {
            class: "mgw-partner-name",
            text: empty ? S.partnerEmpty : partner.name
          }),
          el("p", { class: "mgw-partner-role", text: partner.role })
        ]
      );
    });

    return el("section", { class: "mgw-section", id: "partners" }, [
      el("div", { class: "mgw-wrap" }, [
        el("div", { class: "mgw-section-head" }, [
          el("h2", { class: "mgw-h2", text: S.partnersTitle })
        ]),
        el("ul", { class: "mgw-partners" }, cards),
        el("p", { class: "mgw-note", text: S.partnersNote })
      ])
    ]);
  }

  function buildFooter() {
    var primary = primaryAction();
    var igCta = ctaLink(
      { label: S.instagramCta, href: IG_URL, event: "instagram_cta", external: true },
      "mgw-cta--ghost"
    );

    var mail = el("a", {
      href: "mailto:" + CFG.CONTACT_EMAIL,
      text: S.contactCta
    });
    var home = el("a", { href: homeUrl(), text: S.backHome });

    /* Both accounts again in the footer meta line. */
    var altIg = IG_ALT_URL
      ? el("a", {
          href: IG_ALT_URL,
          target: "_blank",
          rel: "noopener",
          text: S.instagramAltCta
        })
      : null;
    if (altIg) {
      altIg.addEventListener("click", function () {
        track("instagram_cta", CFG.INSTAGRAM_HANDLE_ALT);
      });
    }

    return el("footer", { class: "mgw-footer" }, [
      el("div", { class: "mgw-wrap" }, [
        el("h2", { class: "mgw-h2 mgw-reveal", text: S.footerTitle }),
        el("div", { class: "mgw-actions" }, [
          ctaLink(primary, "mgw-cta--primary"),
          igCta
        ]),
        el("div", { class: "mgw-footer-meta" }, [
          el("span", {}, [mail]),
          altIg ? el("span", {}, [altIg]) : null,
          el("span", {}, [home]),
          el("span", { text: S.route })
        ])
      ])
    ]);
  }

  /* Fade/slide the frames in as they arrive. Falls back to showing
     everything immediately where IntersectionObserver is unavailable. */
  function observeReveals(scope) {
    var targets = scope.querySelectorAll(".mgw-reveal, .mgw-stop");
    if (typeof window.IntersectionObserver !== "function" || reduceMotion) {
      Array.prototype.forEach.call(targets, function (node) {
        node.classList.add("is-in");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
    );

    Array.prototype.forEach.call(targets, function (node) {
      io.observe(node);
    });
  }

  /* ========================================================================
     Overlay mode
     ======================================================================== */
  function mountOverlay(mount) {
    var parts = buildFilm("overlay");

    var closeBtn = el("button", {
      type: "button",
      class: "mgw-close",
      "aria-label": S.close
    });
    closeBtn.appendChild(document.createTextNode("×"));
    parts.film.appendChild(closeBtn);

    /* Named with aria-label rather than aria-labelledby: the <h1> it would
       point at is visibility:hidden until scene 4, which would leave the
       dialog unnamed for the whole film. */
    var dialog = el("dialog", {
      class: "mgw mgw--overlay",
      id: "mgw-overlay",
      "aria-modal": "true",
      "aria-label": S.overlayLabel,
      "data-phase": PHASE,
      "data-scene": "1"
    }, [parts.film]);

    mount.appendChild(dialog);

    var projector = createProjector(dialog, parts);
    var pill = null;

    /* Older browsers without <dialog>: never show the overlay, just offer
       the pill, which links through to the standalone route. */
    var supported = typeof dialog.showModal === "function";

    function open(opts) {
      if (!supported) {
        window.location.href = routeUrl();
        return;
      }
      document.documentElement.classList.add("mgw-locked");
      dialog.showModal();

      if (opts && opts.skipIntro) {
        projector.toHero();
        parts.primaryCta.focus();
      } else {
        projector.run();
        /* Focus the escape hatch first — it is the control a visitor most
           likely wants in the first second. */
        if (!parts.skipBtn.hidden) parts.skipBtn.focus();
        else parts.primaryCta.focus();
      }
      track("open", opts && opts.skipIntro ? "pill" : "auto");
    }

    closeBtn.addEventListener("click", function () {
      track("dismiss", "close_button");
      dialog.close();
    });

    /* Escape fires "cancel" then "close"; the one handler covers both. */
    dialog.addEventListener("cancel", function () {
      track("dismiss", "escape");
    });

    dialog.addEventListener("close", function () {
      document.documentElement.classList.remove("mgw-locked");
      projector.stop();
      rememberDismissal();
      showPill();
    });

    function showPill() {
      if (pill) return;
      pill = el("button", {
        type: "button",
        class: "mgw-pill",
        "aria-label": S.pillAria,
        "aria-haspopup": "dialog",
        "aria-controls": "mgw-overlay"
      }, [
        el("span", { class: "mgw-pill-dot", "aria-hidden": "true" }),
        el("span", { text: S.pill })
      ]);
      pill.addEventListener("click", function () {
        open({ skipIntro: true });
      });
      document.body.appendChild(pill);
    }

    /* ---- Decide whether to play on load ----
       Auto-plays the full film on a first visit. ?mgw or #mgw forces it open
       again even for repeat visitors, so campaign links from Instagram always
       land on the experience (and so you can retest it yourself). */
    var forced = /[?&]mgw\b/.test(window.location.search) ||
      window.location.hash === "#mgw";

    if (!supported) {
      showPill();
    } else if (forced || CFG.ALWAYS_OPEN || !wasDismissed()) {
      /* With ALWAYS_OPEN set, the film itself is still only replayed as
         REPLAY_INTRO allows — otherwise someone clicking through several
         pages would sit through the whole thing each time. */
      open({ skipIntro: CFG.ALWAYS_OPEN && !CFG.REPLAY_INTRO && introSeenThisSession() });
    } else {
      showPill();
    }

    window.MGW = { open: open, close: function () { dialog.close(); }, track: track };
  }

  /* ========================================================================
     Page mode — the standalone route
     ======================================================================== */
  function mountPage(mount) {
    var parts = buildFilm("page");

    var root = el("div", {
      class: "mgw mgw--page",
      "data-phase": PHASE,
      "data-scene": "1"
    }, [
      parts.film,
      buildStory(),
      buildItinerary(),
      buildPartners(),
      buildFooter()
    ]);

    mount.replaceChildren(root);

    var projector = createProjector(root, parts);
    projector.run();
    observeReveals(root);

    track("open", "standalone");
    window.MGW = { track: track, skip: projector.toHero };
  }

  /* ========================================================================
     Boot
     ======================================================================== */
  function boot() {
    var page = document.getElementById("mgw-page");
    if (page) {
      mountPage(page);
      return;
    }
    var overlay = document.getElementById("mgw-root");
    if (overlay) mountOverlay(overlay);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
