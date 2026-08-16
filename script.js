// Play the background video at a barely-perceptible crawl, like paint drying.
const video = document.querySelector(".bg-video");
if (video) {
  video.playbackRate = 0.1;
}

// Track scroll progress over the first viewport height and expose it as a
// CSS variable, driving the blur layer crawling over the video and the
// splash copy being pushed up out of view.
function updateScrollProgress() {
  const progress = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
  document.documentElement.style.setProperty("--progress", progress.toFixed(4));
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();
