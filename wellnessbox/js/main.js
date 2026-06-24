/* RagnarOak Wellness Box — timer + scroll animations */

(function () {
  let secs = 29 * 60 + 54;
  const el = document.getElementById('timer');
  if (!el) return;

  const tick = () => {
    if (secs <= 0) { el.textContent = '00:00'; return; }
    secs--;
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    el.textContent = `${m}:${s}`;
    setTimeout(tick, 1000);
  };
  tick();
})();

(function () {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
      el.classList.add('fade-up');
    });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
    observer.observe(el);
  });
})();
