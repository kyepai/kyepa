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

// Belle Histoire pop-up: "Movement is Life" banner is a role="button" div
// (not a real <button>, since it wraps an <h2>), so it needs a keydown
// handler too, matching native button Enter/Space activation.
const movementTrigger = document.getElementById("movement-trigger");
const movementModal = document.getElementById("movement-modal");
const movementClose = document.getElementById("movement-close");

if (movementTrigger && movementModal) {
  movementTrigger.addEventListener("click", () => movementModal.showModal());
  movementTrigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      movementModal.showModal();
    }
  });
}
if (movementClose && movementModal) {
  movementClose.addEventListener("click", () => movementModal.close());
}
if (movementModal) {
  movementModal.addEventListener("click", (event) => {
    if (event.target === movementModal) movementModal.close();
  });
}

// Shimmer sweep on the "Movement is Life" banner: fires 2s after every
// second mouse-move/scroll "gesture" (continuous movement is throttled down
// to one counted gesture per second so a single drag/scroll doesn't rack up
// several), alternating between the rolling and racing animation styles.
const shimmerArrow = document.querySelector("#movement-trigger .shimmer-arrow");
if (shimmerArrow) {
  let gestureCount = 0;
  let gestureThrottled = false;
  let useRacing = false;

  function countGesture() {
    if (gestureThrottled) return;
    gestureThrottled = true;
    setTimeout(() => { gestureThrottled = false; }, 1000);

    gestureCount++;
    if (gestureCount % 2 === 0) {
      setTimeout(() => {
        shimmerArrow.classList.remove("shimmer-rolling", "shimmer-racing");
        void shimmerArrow.offsetWidth; // restart animation if still running
        shimmerArrow.classList.add(useRacing ? "shimmer-racing" : "shimmer-rolling");
        useRacing = !useRacing;
      }, 2000);
    }
  }

  window.addEventListener("mousemove", countGesture, { passive: true });
  window.addEventListener("scroll", countGesture, { passive: true });
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
