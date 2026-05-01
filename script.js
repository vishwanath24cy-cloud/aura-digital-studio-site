(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");
  var navBackdrop = document.getElementById("navBackdrop");
  var scrollLinks = document.querySelectorAll("[data-scroll]");
  var contactForm = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");
  var yearEl = document.getElementById("year");

  var SCROLL_THRESHOLD = 16;
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setHeaderScrolled() {
    if (!header) return;
    var scrolled = window.scrollY > SCROLL_THRESHOLD;
    header.classList.toggle("is-scrolled", scrolled);
  }

  function openNav() {
    if (!header || !navToggle) return;
    header.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
    if (navBackdrop) navBackdrop.removeAttribute("hidden");
  }

  function closeNav() {
    if (!header || !navToggle) return;
    header.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
    if (navBackdrop) navBackdrop.setAttribute("hidden", "");
  }

  function toggleNav() {
    if (header && header.classList.contains("nav-open")) closeNav();
    else openNav();
  }

  function smoothScrollToHash(hash, done) {
    var id = hash && hash.replace("#", "");
    var el = id ? document.getElementById(id) : null;
    if (!el) {
      if (typeof done === "function") done();
      return;
    }
    var headerHeight = header ? header.offsetHeight : 0;
    var top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
    if (prefersReducedMotion) {
      window.scrollTo(0, top);
      if (typeof done === "function") done();
      return;
    }
    window.scrollTo({ top: top, behavior: "smooth" });
    window.setTimeout(function () {
      if (typeof done === "function") done();
    }, 500);
  }

  function onScrollLinkClick(e) {
    var anchor = e.currentTarget.getAttribute("href");
    if (!anchor || anchor.charAt(0) !== "#") return;
    e.preventDefault();
    smoothScrollToHash(anchor, closeNav);
    if (history.pushState) history.pushState(null, "", anchor);
    else window.location.hash = anchor;
  }

  /* Scroll: navbar style */
  window.addEventListener("scroll", setHeaderScrolled, { passive: true });
  setHeaderScrolled();

  /* Mobile menu */
  if (navToggle) {
    navToggle.addEventListener("click", toggleNav);
  }
  if (navBackdrop) {
    navBackdrop.addEventListener("click", closeNav);
  }
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) closeNav();
  });

  scrollLinks.forEach(function (link) {
    link.addEventListener("click", onScrollLinkClick);
  });

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Contact form (demo) */
  if (contactForm && formNote) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      formNote.textContent = "";
      formNote.classList.remove("is-success", "is-error");
      if (!contactForm.checkValidity()) {
        formNote.textContent = "Please fill in all fields correctly.";
        formNote.classList.add("is-error");
        return;
      }
      formNote.textContent = "Thanks — your message has been recorded (demo).";
      formNote.classList.add("is-success");
      contactForm.reset();
    });
  }

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
