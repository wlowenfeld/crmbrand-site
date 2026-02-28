/* ============================================
   SteadyLayer — Landing Page Interactions
   Redesign: Hub-Spoke + Motion
   ============================================ */

(function () {
  'use strict';

  // Check for reduced motion preference
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Easing ----
  var EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

  // ---- Navbar scroll state ----
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navMobile = document.getElementById('navMobile');

  function onScroll() {
    if (window.scrollY > 10) {
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

  // ---- Helper: IntersectionObserver wrapper ----
  function observeOnce(elements, callback, options) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      // Immediately trigger callback for all elements
      elements.forEach(function (el, i) { callback(el, i); });
      return;
    }

    var opts = Object.assign({ threshold: 0.1, rootMargin: '0px 0px -40px 0px' }, options || {});
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var idx = Array.prototype.indexOf.call(elements, el);
          callback(el, idx);
          observer.unobserve(el);
        }
      });
    }, opts);

    elements.forEach(function (el) { observer.observe(el); });
  }

  // ============================================
  // Products — Radial Hub-and-Spoke Animations
  // ============================================

  var hubSpokeContainer = document.getElementById('hubSpoke');
  var spokeCards = document.querySelectorAll('.spoke-card');
  var spokeLines = document.querySelectorAll('.spoke-line');
  var hubCenter = document.getElementById('hubCenter');
  var pulseRing = hubCenter ? hubCenter.querySelector('.hub-pulse-ring') : null;
  var moreComing = document.querySelector('.more-coming');

  function animateSpokes() {
    if (!hubSpokeContainer) return;

    // Animate SVG spoke lines (draw in)
    spokeLines.forEach(function (line, i) {
      var length = line.getTotalLength ? line.getTotalLength() : 400;
      line.style.strokeDasharray = length;
      line.style.strokeDashoffset = length;
      line.style.transition = 'stroke-dashoffset 0.8s ' + EASE + ' ' + (i * 100) + 'ms';
    });

    // Set up observer on the hub-spoke container
    observeOnce([hubSpokeContainer], function () {
      // 1. Draw lines
      setTimeout(function () {
        spokeLines.forEach(function (line) {
          line.style.strokeDashoffset = '0';
        });
      }, 100);

      // 2. Pulse ring on hub
      if (pulseRing) {
        setTimeout(function () {
          pulseRing.classList.add('pulse-active');
        }, 300);
      }

      // 3. Reveal cards with stagger
      spokeCards.forEach(function (card, i) {
        setTimeout(function () {
          card.classList.add('card-visible');
        }, 400 + i * 120);
      });

      // 4. Activate live badge glow
      setTimeout(function () {
        var liveBadge = document.querySelector('.spoke-badge-live');
        if (liveBadge) liveBadge.classList.add('glow-active');
      }, 800);

      // 5. Show ghost circles + "more coming"
      setTimeout(function () {
        hubSpokeContainer.classList.add('revealed');
      }, 900);

      // 6. Show "more coming" text
      if (moreComing) {
        setTimeout(function () {
          moreComing.classList.add('visible');
        }, 1200);
      }
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
  }

  animateSpokes();

  // ============================================
  // Why SteadyLayer — Slide-in animations
  // ============================================

  var valueCards = document.querySelectorAll('.value-card');

  valueCards.forEach(function (card) {
    var dir = card.getAttribute('data-anim');
    if (dir === 'slide-left') {
      card.classList.add('anim-hidden-left');
    } else if (dir === 'slide-right') {
      card.classList.add('anim-hidden-right');
    }
  });

  observeOnce(valueCards, function (el, idx) {
    var delay = Math.max(0, idx % 2) * 120 + Math.floor(idx / 2) * 200;
    setTimeout(function () {
      el.classList.remove('anim-hidden-left', 'anim-hidden-right');
      el.classList.add('anim-visible');
    }, delay);
  }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

  // ============================================
  // Blog — Fade-up with stagger
  // ============================================

  var blogCards = document.querySelectorAll('.blog-card');

  blogCards.forEach(function (card) {
    card.classList.add('anim-hidden');
  });

  observeOnce(blogCards, function (el, idx) {
    setTimeout(function () {
      el.classList.remove('anim-hidden');
      el.classList.add('anim-visible');
    }, idx * 100);
  }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

  // ============================================
  // Smooth scroll for anchor links
  // ============================================

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

  // ============================================
  // Safety fallback — reveal everything after 3s
  // ============================================

  setTimeout(function () {
    spokeCards.forEach(function (c) { c.classList.add('card-visible'); });
    valueCards.forEach(function (c) {
      c.classList.remove('anim-hidden-left', 'anim-hidden-right');
      c.classList.add('anim-visible');
    });
    blogCards.forEach(function (c) {
      c.classList.remove('anim-hidden');
      c.classList.add('anim-visible');
    });
    if (moreComing) moreComing.classList.add('visible');
    if (hubSpokeContainer) hubSpokeContainer.classList.add('revealed');
    spokeLines.forEach(function (line) {
      line.style.strokeDashoffset = '0';
    });
    var liveBadge = document.querySelector('.spoke-badge-live');
    if (liveBadge) liveBadge.classList.add('glow-active');
  }, 3500);

})();