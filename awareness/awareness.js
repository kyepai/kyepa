/* ==========================================================================
   AWARENESS — a page that only opens with the key in its own link
   ==========================================================================
   content.json holds AES-256-GCM ciphertext. The key never appears in this
   repository: it lives in the URL fragment of the link Kyle shares, and a
   fragment is never sent to the server, so it stays between him and the
   person he sent it to.

   The repo is public, so obscurity would protect nothing — a secret path
   would be sitting in plain sight on GitHub. This is real encryption
   instead: the ciphertext can be downloaded by anyone and is useless
   without the key.

   What it does NOT do: anyone holding the link can read it, and can pass
   it on. It is a key, not an identity check.
   ========================================================================== */

const MOUNT = document.getElementById("aw-mount");

/* Deliberately the same message for a missing key, a wrong key and a
   corrupted file. A visitor without the key learns nothing about whether
   there is anything here at all. */
const QUIET = "Nothing to see at this address.";

function say(text) {
  MOUNT.replaceChildren(
    Object.assign(document.createElement("p"), { className: "aw-waiting", textContent: text })
  );
}

function fromBase64Url(s) {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function render(payload) {
  const panel = document.createDocumentFragment();

  const name = document.createElement("h1");
  name.className = "aw-title";
  name.textContent = payload.title || "";
  panel.appendChild(name);

  if (payload.price) {
    const price = document.createElement("p");
    price.className = "aw-price";
    price.textContent = payload.price;
    panel.appendChild(price);
  }

  (payload.body || []).forEach((para) => {
    const p = document.createElement("p");
    p.className = "aw-body";
    p.textContent = para;
    panel.appendChild(p);
  });

  if (payload.contact) {
    const wrap = document.createElement("p");
    wrap.className = "aw-contact";
    const a = document.createElement("a");
    a.className = "contact-button";
    a.href = "mailto:" + payload.contact;
    a.textContent = "Start the conversation";
    wrap.appendChild(a);
    panel.appendChild(wrap);
  }

  MOUNT.replaceChildren(panel);
}

async function open_() {
  // The key rides in the fragment, which browsers never put on the wire.
  const key = location.hash.replace(/^#/, "").trim();
  if (!key) return say(QUIET);

  let file;
  try {
    const res = await fetch("content.json", { cache: "no-store" });
    if (!res.ok) throw new Error("missing");
    file = await res.json();
  } catch (err) {
    return say(QUIET);
  }

  try {
    const raw = fromBase64Url(key);
    if (raw.length !== 32) return say(QUIET);

    const cryptoKey = await crypto.subtle.importKey(
      "raw", raw, { name: "AES-GCM" }, false, ["decrypt"]
    );
    // GCM verifies the tag, so a wrong key throws rather than returning junk.
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64Url(file.iv) },
      cryptoKey,
      fromBase64Url(file.data)
    );
    render(JSON.parse(new TextDecoder().decode(plain)));
  } catch (err) {
    say(QUIET);
  }
}

// crypto.subtle needs a secure context: https, or localhost while testing.
if (!window.isSecureContext || !window.crypto || !crypto.subtle) {
  say(QUIET);
} else {
  open_();
}
