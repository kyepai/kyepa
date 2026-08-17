// Play both background videos at a barely-perceptible crawl, like paint drying.
const videoA = document.querySelector(".bg-video-a");
const videoB = document.querySelector(".bg-video-b");
[videoA, videoB].forEach((v) => {
  if (v) v.playbackRate = 0.1;
});

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
