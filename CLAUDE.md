# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Kyepa is a static website: plain HTML/CSS with no build tooling, package manager, framework, or test suite. `index.html` currently renders a placeholder "Hello, World!" landing page styled by `style.css`.

Per the README (`# kyepa` / "38 multipurpose website"), this is the early scaffold for a general-purpose site — expect the structure to grow beyond a single page.

## Working with this repo

- There is no build step: open `index.html` directly in a browser, or serve the directory with any static file server (e.g. `python3 -m http.server`) to view it with relative paths resolved.
- There is no linter, formatter, or test runner configured. Don't assume `npm`/`node` tooling exists — the `.gitignore` has boilerplate Node entries but no `package.json` is present.
- Keep new pages/styles consistent with the existing plain HTML/CSS approach unless the user asks to introduce a framework or bundler.

## Other files

- `shortcut.md` is a standalone reference doc (keyboard shortcuts for a beginner programmer) — it's learning material, not project documentation, and is unrelated to the site's code.

## Git workflow

- The user is a novice programmer — explain git/CLI actions in plain terms as you make them.
- The user has pre-authorized committing and pushing to `origin/main` automatically once a unit of requested work is complete, without waiting for explicit confirmation each time. Still surface what was committed/pushed afterward. This does not extend to destructive operations (force-push, reset --hard, etc.) — confirm those as usual.
