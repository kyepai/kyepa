// Play both background videos at a barely-perceptible crawl, like paint drying.
const videoA = document.querySelector(".bg-video-a");
const videoB = document.querySelector(".bg-video-b");
if (videoA) videoA.playbackRate = 0.4;
if (videoB) videoB.playbackRate = 0.3;

// Swap to the second video once the blur layer has crawled over 67% of the
// view (from the bottom), so the change happens while mostly hidden. Swaps
// back once the user scrolls back up past that point, toward the splash.
const SWAP_THRESHOLD = 0.67;
let usingSecondary = false;

// Track scroll progress over the first viewport height and expose it as a
// CSS variable, driving the blur layer crawling over the video and the
// splash copy being pushed up out of view.
function updateScrollProgress() {
  const progress = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
  document.documentElement.style.setProperty("--progress", progress.toFixed(4));

  const shouldUseSecondary = progress >= SWAP_THRESHOLD;
  if (shouldUseSecondary !== usingSecondary) {
    usingSecondary = shouldUseSecondary;
    if (videoA) videoA.classList.toggle("is-active", !usingSecondary);
    if (videoB) videoB.classList.toggle("is-active", usingSecondary);
  }
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

// Techno Reclamation pop-up: opens on the "survival guide" line, closes via
// its own button or a click on the backdrop.
const technoTrigger = document.getElementById("techno-reclamation-trigger");
const technoModal = document.getElementById("techno-reclamation-modal");
const technoClose = document.getElementById("techno-reclamation-close");

if (technoTrigger && technoModal) {
  technoTrigger.addEventListener("click", () => technoModal.showModal());
}
if (technoClose && technoModal) {
  technoClose.addEventListener("click", () => technoModal.close());
}
if (technoModal) {
  technoModal.addEventListener("click", (event) => {
    if (event.target === technoModal) technoModal.close();
  });
}

// Two Books pop-up: same open/close pattern as the Techno Reclamation one.
const booksTrigger = document.getElementById("books-trigger");
const booksModal = document.getElementById("books-modal");
const booksClose = document.getElementById("books-close");

if (booksTrigger && booksModal) {
  booksTrigger.addEventListener("click", () => booksModal.showModal());
}
if (booksClose && booksModal) {
  booksClose.addEventListener("click", () => booksModal.close());
}
if (booksModal) {
  booksModal.addEventListener("click", (event) => {
    if (event.target === booksModal) booksModal.close();
  });
}
