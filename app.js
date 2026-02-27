/* ============================================
   Steady — Landing Page Interactions
   ============================================ */

(function () {
  'use strict';

  // ---- Navbar scroll state ----
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navMobile = document.getElementById('navMobile');

  function onScroll() {
    var scrollY = window.scrollY;
    if (scrollY > 10) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile nav toggle ----
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      navMobile.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMobile.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // ---- Scroll-triggered reveal animations ----
  // Step 1: Mark all animatable elements as hidden via JS (not CSS, so no-JS users see content)
  var animTargets = document.querySelectorAll('.spoke-card, .value-card, .blog-card');
  animTargets.forEach(function (el, i) {
    el.classList.add('anim-hidden');
  });

  // Step 2: Set up IntersectionObserver to reveal them
  function setupReveal() {
    if (!('IntersectionObserver' in window)) {
      // No observer support — show everything immediately
      animTargets.forEach(function (el) { el.classList.remove('anim-hidden'); el.classList.add('anim-visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            // Determine stagger delay based on position among siblings
            var siblings = el.parentElement.querySelectorAll('.anim-hidden, .anim-visible');
            var idx = Array.prototype.indexOf.call(siblings, el);
            var delay = Math.max(0, idx) * 80;

            setTimeout(function () {
              el.classList.remove('anim-hidden');
              el.classList.add('anim-visible');
            }, delay);

            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '80px 0px 0px 0px',
      }
    );

    animTargets.forEach(function (el) {
      observer.observe(el);
    });

    // Safety fallback: reveal everything after 1.5s
    setTimeout(function () {
      animTargets.forEach(function (el) {
        el.classList.remove('anim-hidden');
        el.classList.add('anim-visible');
      });
    }, 1500);
  }

  setupReveal();

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;

      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var navHeight = nav ? nav.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
