/* ==========================================================================
   STYLED IN MOTION — client results
   ==========================================================================
   The quotes in the "Client results" section of /styling/. Separate from
   styling.config.js because this is the one list that should grow steadily,
   and because real people's words deserve a file you can scan in one go.

   Each entry:
     quote        what they said, in their words. Keep it specific — "I
                  stopped apologising for taking up space" beats "great
                  service". No exclamation marks you had to add yourself.
     name         how they want to be credited
     role         their title, the stage, or the year — the context that
                  makes the quote land
     photo        path relative to this folder, or "" for an initials tile
     alt          describe the photo for screen readers
     before/after optional pair of image paths. Set BOTH or neither; a
                  single one renders nothing.
     placeholder  true while this is filler. It makes the card say so, on
                  the page, in plain sight. Delete the line when the quote
                  is real.

   Publishing a made-up quote as if it were real is the one thing on this
   page that could actually damage you. While `placeholder` is true the card
   is visibly labelled, and these entries are also excluded from the
   structured data search engines read, so nothing invented ends up in a
   Google review snippet. Replace them before the page gets traffic —
   three real sentences beat thirty invented ones.
   TODO(Kyle): swap all three for real clients, with their permission.
   ========================================================================== */

window.STYLING_TESTIMONIALS = [
  {
    quote:
      "Placeholder — replace with what a delegate actually said about " +
      "walking out in a look you built.",
    name: "Client name",
    role: "Pageant delegate",
    photo: "",
    alt: "",
    before: "",
    after: "",
    placeholder: true
  },
  {
    quote:
      "Placeholder — replace with a performer on what changed once the " +
      "clothes stopped fighting the choreography.",
    name: "Client name",
    role: "Performer",
    photo: "",
    alt: "",
    before: "",
    after: "",
    placeholder: true
  },
  {
    quote:
      "Placeholder — replace with someone on the wardrobe edit, and what " +
      "they stopped wearing.",
    name: "Client name",
    role: "Full Image Sprint",
    photo: "",
    alt: "",
    before: "",
    after: "",
    placeholder: true
  }
];
