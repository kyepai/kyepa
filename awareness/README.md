# Awareness — `/awareness/`

A page that only opens for someone holding the link.

## How it works

`content.json` holds the copy as AES-256-GCM ciphertext. **The key is not in
this repository.** It lives in the fragment of the link — the part after the
`#` — which browsers never send to a server. So the key exists only in the
link itself, and only you decide who has it.

This repo is public, so a secret *path* would have protected nothing: anyone
browsing GitHub would see it. Encryption is what makes this real. The
ciphertext can be downloaded by anyone and is useless without the key.

A missing key, a wrong key and a damaged file all produce the same line —
"Nothing to see at this address." Someone who opens the bare URL cannot tell
whether anything is here at all.

## What it does and does not protect

**Does:** the content is unreadable without the key. Not obscured — properly
encrypted. It is also `noindex`, so it stays out of search results.

**Does not:** anyone holding the link can read it, and can forward it. It is
a key, not an identity check. Treat the link the way you would a door key —
send it one person at a time, in something that does not keep history.

The link will sit in the browser history of anyone who opens it.

## Changing the copy, or rotating the key

Both are the same job, and I have to do it — the plaintext is not in the
repo either. Ask, and you get fresh ciphertext and a fresh link. The old
link stops working the moment the key changes, which is also how you revoke
access if a link gets passed somewhere you did not intend.

## One trade-off worth knowing

This page does **not** work opened from disk, unlike the rest of the site.
Browsers only expose the crypto API on `https://` or `localhost`, so a
`file://` page cannot decrypt anything and will show the quiet message. Serve
the folder (`python3 -m http.server`) to test it locally.
