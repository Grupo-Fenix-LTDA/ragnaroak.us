/* ==========================================================================
   RagnarOak — interactions
   - Mobile navigation toggle (hamburger ↔ panel)
   - Auto-close mobile nav after the user taps a link
   - Smooth FAQ accordion (height-animated open/close on <details>)
   - Smooth scroll is handled natively via CSS (scroll-behavior: smooth)
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Mobile navigation ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    function toggleNav() {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    }
    function closeNav() {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    hamburger.addEventListener('click', toggleNav);
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) closeNav();
    });
  }


  /* ---------- FAQ accordion (smooth open/close) ----------
     <details> snaps open/closed natively. We hijack the click on
     <summary> so we can animate the answer's height before toggling
     the [open] attribute, giving a polished accordion feel without
     losing the underlying semantic element. */
  const DURATION = 280;
  const EASING   = 'cubic-bezier(0.4, 0, 0.2, 1)';

  document.querySelectorAll('.faq-item').forEach(function (item) {
    const summary = item.querySelector('summary');
    const answer  = item.querySelector('.faq-a');
    if (!summary || !answer) return;

    summary.addEventListener('click', function (e) {
      // We're taking over the open/close — block the native toggle.
      e.preventDefault();
      if (item.dataset.animating === '1') return;
      item.dataset.animating = '1';

      if (item.open) {
        // ----- Closing -----
        const startHeight = answer.scrollHeight;
        answer.style.overflow = 'hidden';
        answer.style.height = startHeight + 'px';
        // Force a reflow so the browser registers the starting height.
        void answer.offsetHeight;
        answer.style.transition = 'height ' + DURATION + 'ms ' + EASING;
        answer.style.height = '0px';

        const onEnd = function () {
          answer.removeEventListener('transitionend', onEnd);
          item.open = false;
          answer.style.transition = '';
          answer.style.height = '';
          answer.style.overflow = '';
          item.dataset.animating = '';
        };
        answer.addEventListener('transitionend', onEnd);
      } else {
        // ----- Opening -----
        item.open = true;
        const endHeight = answer.scrollHeight;
        answer.style.overflow = 'hidden';
        answer.style.height = '0px';
        void answer.offsetHeight;
        answer.style.transition = 'height ' + DURATION + 'ms ' + EASING;
        answer.style.height = endHeight + 'px';

        const onEnd = function () {
          answer.removeEventListener('transitionend', onEnd);
          answer.style.transition = '';
          answer.style.height = '';
          answer.style.overflow = '';
          item.dataset.animating = '';
        };
        answer.addEventListener('transitionend', onEnd);
      }
    });
  });
})();
