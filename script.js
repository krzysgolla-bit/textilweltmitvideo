// Textilwelt im Viertel – Navigation & Formulare
(function () {
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (!hamburger || !navLinks) return;

    hamburger.setAttribute('type', 'button');
    hamburger.setAttribute('aria-controls', 'navLinks');
    hamburger.setAttribute('aria-expanded', 'false');

    const closeMenu = () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    };

    const toggleMenu = () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    };

    hamburger.addEventListener('click', toggleMenu);

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) closeMenu();
    });
  }

  function markActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const targetPage = href.split('#')[0];
      if (targetPage === currentPage || (currentPage === '' && targetPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  function initAppointmentForm() {
    // ERGÄNZT/GEÄNDERT: Terminanfragen laufen über Formtorch. Kein mailto-Fallback, kein preventDefault.
  }

  window.submitForm = function () {
    // ERGÄNZT/GEÄNDERT: deaktiviert, damit Formtorch-POST normal abgesendet wird.
    return true;
  };



  // ERGÄNZT/GEÄNDERT: Consent-Logik für Cookie-Banner und Google Maps. Externe Inhalte werden erst nach aktiver Zustimmung geladen.
  function loadGoogleMap() {
    const holder = document.querySelector('.map-consent');
    if (!holder || holder.querySelector('iframe')) return;
    const src = holder.getAttribute('data-map-src');
    if (!src) return;
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = 'Textilwelt im Viertel – Vor dem Steintor 109, 28203 Bremen';
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.loading = 'lazy';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.style.border = '0';
    holder.innerHTML = '';
    holder.appendChild(iframe);
  }

  function initCookieConsent() {
    const banner = document.getElementById('cookieBanner');
    const accept = document.getElementById('cookieAccept');
    const reject = document.getElementById('cookieReject');
    const saved = localStorage.getItem('twivConsent');

    if (saved === 'accepted') {
      loadGoogleMap();
    }
    if (!saved && banner) {
      banner.hidden = false;
    }

    if (accept) {
      accept.addEventListener('click', function () {
        localStorage.setItem('twivConsent', 'accepted');
        if (banner) banner.hidden = true;
        loadGoogleMap();
      });
    }
    if (reject) {
      reject.addEventListener('click', function () {
        localStorage.setItem('twivConsent', 'rejected');
        if (banner) banner.hidden = true;
      });
    }

    const mapButton = document.getElementById('loadMapBtn');
    if (mapButton) {
      mapButton.addEventListener('click', function () {
        localStorage.setItem('twivConsent', 'accepted');
        if (banner) banner.hidden = true;
        loadGoogleMap();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    markActiveNavItem();
    initAppointmentForm();
    initCookieConsent(); // ERGÄNZT/GEÄNDERT
  });
})();


// Galerie-Lightbox mit Vor/Zurück-Navigation
let currentLightboxIndex = 0;
function getGalleryItems() {
  return Array.from(document.querySelectorAll('.gallery-item'));
}
function showLightboxItem(index) {
  const items = getGalleryItems();
  if (!items.length) return;
  currentLightboxIndex = (index + items.length) % items.length;
  const item = items[currentLightboxIndex];
  const img = item.querySelector('img');
  const src = item.getAttribute('data-full') || (img ? img.src : '');
  const caption = item.getAttribute('data-caption') || item.querySelector('.gallery-caption-text')?.textContent || '';
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const overlay = document.getElementById('lightbox-overlay');
  if (!lightboxImg || !overlay) return;
  lightboxImg.src = src;
  if (lightboxCaption) lightboxCaption.textContent = caption;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function openLightbox(el) {
  const items = getGalleryItems();
  const index = Math.max(0, items.indexOf(el));
  showLightboxItem(index);
}
function changeLightbox(direction) {
  showLightboxItem(currentLightboxIndex + direction);
}
function closeLightbox(event) {
  if (!event || event.target === document.getElementById('lightbox-overlay')) closeLightboxDirect();
}
function closeLightboxDirect() {
  const overlay = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  if (overlay) overlay.classList.remove('active');
  if (lightboxImg) lightboxImg.src = '';
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function(event) {
  const overlay = document.getElementById('lightbox-overlay');
  if (!overlay || !overlay.classList.contains('active')) return;
  if (event.key === 'Escape') closeLightboxDirect();
  if (event.key === 'ArrowLeft') changeLightbox(-1);
  if (event.key === 'ArrowRight') changeLightbox(1);
});
