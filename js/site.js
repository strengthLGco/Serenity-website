// =============================================================================
// SERENITY RESEARCH LABS — SHARED SITE INTERACTIONS
// Keeps global UI behavior consistent across generated static pages.
// =============================================================================
(function () {
  const AGE_STORAGE_KEY = 'serenity_age_verified';
  const AGE_VERIFIED_VALUE = 'true';

  function hasAgeLocalProof() {
    try {
      return localStorage.getItem(AGE_STORAGE_KEY) === AGE_VERIFIED_VALUE;
    } catch (_) {
      return false;
    }
  }

  function saveAgeLocalProof() {
    try {
      localStorage.setItem(AGE_STORAGE_KEY, AGE_VERIFIED_VALUE);
    } catch (_) {
      // Ignore storage failures; server cookie still handles verification.
    }
  }



  const MOBILE_MENU_HTML = `
    <div id="mobile-menu-overlay" onclick="closeMobileMenu()"></div>
    <div id="mobile-menu" aria-hidden="true">
      <button class="close-btn" type="button" onclick="closeMobileMenu()" aria-label="Close menu">
        <span class="material-symbols-outlined" style="font-size:24px;">close</span>
      </button>
      <a href="../homepage/code.html">Home</a>
      <a href="../products_page/code.html">Shop</a>
      <a href="../faq_page/code.html">Support</a>
      <a href="../about/code.html">About</a>
      <a href="../checkout/code.html">Cart</a>
    </div>`;

  function ensureMobileMenu() {
    if (!document.getElementById('mobile-menu-overlay') || !document.getElementById('mobile-menu')) {
      const wrap = document.createElement('div');
      wrap.innerHTML = MOBILE_MENU_HTML;
      while (wrap.firstElementChild) document.body.appendChild(wrap.firstElementChild);
    }
  }

  function openCatalogSearch() {
    const productsPath = '../products_page/code.html';
    if (window.location.pathname.includes('/products_page/')) {
      const input = document.querySelector('input[type="search"], input[placeholder*="Search" i], input[placeholder*="compound" i]');
      if (input) {
        input.focus();
        input.scrollIntoView({ block: 'center', behavior: 'smooth' });
        return;
      }
    }
    window.location.href = productsPath;
  }

  function initSearchTriggers() {
    document.querySelectorAll('.material-symbols-outlined').forEach(function (icon) {
      if ((icon.textContent || '').trim() !== 'search') return;
      icon.setAttribute('role', 'button');
      icon.setAttribute('tabindex', '0');
      icon.setAttribute('aria-label', 'Search catalog');
      icon.addEventListener('click', openCatalogSearch);
      icon.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openCatalogSearch();
        }
      });
    });
  }

  function getAgeGate() {
    return document.getElementById('age-gate');
  }

  function hideAgeGate() {
    const gate = getAgeGate();
    if (!gate) return;
    gate.classList.remove('active');
    gate.style.display = 'none';
    document.body.style.overflow = '';
  }

  function showAgeGate() {
    const gate = getAgeGate();
    if (!gate) return;
    gate.classList.add('active');
    gate.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function calculateAge(mm, dd, yyyy) {
    const birth = new Date(yyyy, mm - 1, dd);
    const validDate = birth.getFullYear() === yyyy && birth.getMonth() === mm - 1 && birth.getDate() === dd;
    if (!validDate) return -1;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  window.verifyAge = function verifyAge() {
    const mm = parseInt(document.getElementById('age-mm')?.value || '', 10);
    const dd = parseInt(document.getElementById('age-dd')?.value || '', 10);
    const yyyy = parseInt(document.getElementById('age-yyyy')?.value || '', 10);

    if (calculateAge(mm, dd, yyyy) >= 18) {
      saveAgeLocalProof();
      hideAgeGate();
      fetch('/api/verify-age', { method: 'POST', credentials: 'same-origin' }).catch(function () {});
      window.dispatchEvent(new CustomEvent('serenity:age-verified'));
    } else {
      alert('You must be 18 or older to access this site.');
    }
  };

  window.__serenityEnsureMobileMenu = ensureMobileMenu;

  window.openMobileMenu = function openMobileMenu() {
    ensureMobileMenu();
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-menu-overlay');
    if (!menu || !overlay) return;
    menu.classList.add('active');
    menu.setAttribute('aria-hidden', 'false');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeMobileMenu = function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-menu-overlay');
    if (!menu || !overlay) return;
    menu.classList.remove('active');
    menu.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('active');
    if (!getAgeGate()?.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  };

  function initAgeGate() {
    ensureMobileMenu();
    initSearchTriggers();
    const gate = getAgeGate();
    if (!gate) return;

    // Prevent the verified-user flash: localStorage is available immediately,
    // while the secure server cookie check takes a network round trip.
    if (hasAgeLocalProof()) {
      hideAgeGate();
      // Legacy per-page age scripts can finish after this shared script and
      // re-lock body scrolling on static/local preview. Re-apply once the
      // current microtask/network race settles so verified users never get a
      // hidden page that still cannot scroll.
      setTimeout(hideAgeGate, 0);
      setTimeout(hideAgeGate, 150);
      setTimeout(hideAgeGate, 600);
      fetch('/api/age-status', { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.json() : { verified: true }; })
        .then(function (d) {
          if (!d.verified) fetch('/api/verify-age', { method: 'POST', credentials: 'same-origin' }).catch(function () {});
        })
        .catch(function () {});
      return;
    }

    fetch('/api/age-status', { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.verified) {
          saveAgeLocalProof();
          hideAgeGate();
        } else {
          showAgeGate();
        }
      })
      .catch(function () {
        // If the API is temporarily unavailable, do not block the whole UI.
        // Show the gate only on first visit when we have no local proof.
        showAgeGate();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAgeGate);
  } else {
    initAgeGate();
  }
})();
