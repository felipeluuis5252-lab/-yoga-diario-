// ==========================================================================
// YÔGA DIÁRIO — script.js
// Vanilla JS only. No dependencies, no build step.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initAccordion();
  initGalleryLightbox();
  initLegalModals();
  initCookieConsent();
  initContactForm();
  initScrollReveal();
  initSmoothAnchorFocus();
  document.getElementById('year').textContent = new Date().getFullYear();
});

// --------------------------------------------------------------------------
// Sticky header: switch from transparent to solid on scroll
// --------------------------------------------------------------------------
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const setState = () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  setState();
  window.addEventListener('scroll', setState, { passive: true });
}

// --------------------------------------------------------------------------
// Mobile hamburger menu
// --------------------------------------------------------------------------
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

// --------------------------------------------------------------------------
// Accessible accordion for FAQ
// --------------------------------------------------------------------------
function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all others (single-open accordion)
      items.forEach((other) => {
        other.classList.remove('is-open');
        const otherTrigger = other.querySelector('.accordion-trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// --------------------------------------------------------------------------
// Gallery lightbox
// --------------------------------------------------------------------------
function initGalleryLightbox() {
  const grid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const closeBtn = document.getElementById('lightbox-close');
  if (!grid || !lightbox || !lightboxImage || !closeBtn) return;

  let lastFocused = null;

  const openLightbox = (src, alt) => {
    lastFocused = document.activeElement;
    lightboxImage.src = src;
    lightboxImage.alt = alt || '';
    lightbox.hidden = false;
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImage.src = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  grid.querySelectorAll('.gallery-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const full = btn.getAttribute('data-full');
      const img = btn.querySelector('img');
      openLightbox(full, img ? img.alt : '');
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
}

// --------------------------------------------------------------------------
// Legal modals (privacy / cookies / terms / cookie preferences)
// --------------------------------------------------------------------------
function initLegalModals() {
  const openers = document.querySelectorAll('[data-modal]');
  const modals = document.querySelectorAll('.modal');

  const closeAll = () => {
    modals.forEach((m) => { m.hidden = true; });
    document.body.style.overflow = '';
  };

  openers.forEach((opener) => {
    opener.addEventListener('click', () => {
      const targetId = opener.getAttribute('data-modal');
      const modal = document.getElementById(targetId);
      if (modal) {
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
      }
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAll();
    });
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeAll);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });

  // Expose a helper so the cookie banner can open the preferences modal too
  window.__openModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    }
  };
  window.__closeAllModals = closeAll;
}

// --------------------------------------------------------------------------
// Cookie consent banner
// Non-essential scripts (analytics/marketing) must only run after consent.
// This is a static site, so we simply store the choice in localStorage and
// expose a place (loadNonEssentialScripts) where real tracking snippets
// should be added later, gated by consent.
// --------------------------------------------------------------------------
function initCookieConsent() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');
  const prefsBtn = document.getElementById('cookie-preferences');
  const savePrefsBtn = document.getElementById('save-cookie-prefs');
  const analyticsCheckbox = document.getElementById('pref-analytics');
  const marketingCheckbox = document.getElementById('pref-marketing');
  if (!banner) return;

  const STORAGE_KEY = 'yogadiario_cookie_consent';

  const getStoredConsent = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  const storeConsent = (consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (e) {
      /* localStorage unavailable — banner will simply reappear next visit */
    }
  };

  const applyConsent = (consent) => {
    if (consent.analytics) {
      // Placeholder: load analytics script here only after consent.
      // Example: injectScript('https://example.com/analytics.js');
    }
    if (consent.marketing) {
      // Placeholder: load marketing/ads pixels here only after consent.
    }
  };

  const existing = getStoredConsent();
  if (existing) {
    applyConsent(existing);
  } else {
    banner.hidden = false;
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      const consent = { essential: true, analytics: true, marketing: true };
      storeConsent(consent);
      applyConsent(consent);
      banner.hidden = true;
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      const consent = { essential: true, analytics: false, marketing: false };
      storeConsent(consent);
      banner.hidden = true;
    });
  }

  if (prefsBtn) {
    prefsBtn.addEventListener('click', () => {
      window.__openModal('modal-cookie-prefs');
    });
  }

  if (savePrefsBtn) {
    savePrefsBtn.addEventListener('click', () => {
      const consent = {
        essential: true,
        analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
        marketing: marketingCheckbox ? marketingCheckbox.checked : false,
      };
      storeConsent(consent);
      applyConsent(consent);
      window.__closeAllModals();
      banner.hidden = true;
    });
  }
}

// --------------------------------------------------------------------------
// Contact form — static site, so submissions open the user's email client
// --------------------------------------------------------------------------
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const mensagem = form.mensagem.value.trim();

    const subject = encodeURIComponent(`Contacto via website — ${nome || 'Novo pedido'}`);
    const body = encodeURIComponent(
      `Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`
    );

    window.location.href = `mailto:yogadiario.oficial@gmail.com?subject=${subject}&body=${body}`;
  });
}

// --------------------------------------------------------------------------
// Gentle fade-in on scroll for section headings and cards
// --------------------------------------------------------------------------
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.section-heading, .offer-card, .teacher-card, .testimonial-card, .step, .identification-text'
  );
  targets.forEach((el) => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window) || targets.length === 0) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

// --------------------------------------------------------------------------
// Move focus to the target section when navigating via anchor links,
// which helps keyboard and screen-reader users track where they landed.
// --------------------------------------------------------------------------
function initSmoothAnchorFocus() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        target.setAttribute('tabindex', '-1');
        window.setTimeout(() => target.focus({ preventScroll: true }), 400);
      }
    });
  });
}
