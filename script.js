/* ==========================================================================
   YOGA DIÁRIO — script.js
   ========================================================================== */

/* -------------------- CHECKOUT LINK --------------------
   This is the ONLY place you should need to change the checkout link.
   Every "Start Your Yoga Journey" / "Explore Yoga Diário" button uses this
   variable through the goToCheckout() function below.
---------------------------------------------------------- */
const CHECKOUT_URL = "https://pay.hotmart.com/U5885677J?sck=HOTMART_PRODUCT_PAGE&off=zdnla3kd&hotfeature=32&_gl=1*17ngjro*_ga*MjYwNjE2MzYwLjE3NTk5NTQ3NTQ.*_ga_GQH2V1F11Q*czE3OTA1MTczNjMkbzEzJGcxJHQxNzkwNTE4MTM1JGo2MCRsMCRoMTY1MDIwMjkyMA..&bid=1790518153854";

/* -------------------- META PIXEL PREPARATION --------------------
   Paste your real Meta Pixel base code in the <head> or right after <body>
   in index.html (look for the "META PIXEL CODE GOES HERE" comment).
   The functions below only fire if fbq() has actually been loaded by that
   pixel code — they never send fake events without a real Pixel ID.
------------------------------------------------------------------ */
function trackPageView() {
  if (typeof fbq === "function") {
    fbq("track", "PageView");
  }
}

function trackViewContent() {
  if (typeof fbq === "function") {
    fbq("track", "ViewContent", {
      content_name: "Yoga Diário",
      content_type: "product",
      currency: "EUR",
      value: 9.90
    });
  }
}

function trackInitiateCheckout() {
  if (typeof fbq === "function") {
    fbq("track", "InitiateCheckout", {
      content_name: "Yoga Diário",
      currency: "EUR",
      value: 9.90
    });
  }
}

/* -------------------- CHECKOUT REDIRECT -------------------- */
function goToCheckout() {
  trackInitiateCheckout();
  window.location.href = CHECKOUT_URL;
}

document.addEventListener("DOMContentLoaded", () => {
  trackPageView();
  trackViewContent();

  /* Wire up every CTA button that carries data-checkout */
  document.querySelectorAll("[data-checkout]").forEach((btn) => {
    btn.addEventListener("click", goToCheckout);
  });

  /* -------------------- MOBILE NAV -------------------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* -------------------- FAQ ACCORDION -------------------- */
  document.querySelectorAll(".accordion__trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion__item");
      const panel = item.querySelector(".accordion__panel");
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      /* Close any other open item for a clean single-open accordion */
      document.querySelectorAll(".accordion__trigger[aria-expanded='true']").forEach((openTrigger) => {
        if (openTrigger !== trigger) {
          openTrigger.setAttribute("aria-expanded", "false");
          openTrigger.closest(".accordion__item").querySelector(".accordion__panel").style.maxHeight = null;
        }
      });

      trigger.setAttribute("aria-expanded", String(!isOpen));
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + "px";
    });
  });

  /* -------------------- SCROLL REVEAL -------------------- */
  const reveals = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
  }

  /* -------------------- STICKY MOBILE CTA -------------------- */
  const stickyCta = document.getElementById("stickyCta");
  const heroSection = document.getElementById("home");

  if (stickyCta && heroSection && "IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          stickyCta.classList.toggle("is-visible", !entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );
    heroObserver.observe(heroSection);
  }
});
