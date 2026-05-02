// =============================================================================
// SERENITY RESEARCH LABS — CONTACT CAPTURE + SERENITY15 UNLOCK
// Captures simple researcher contact info after age verification and unlocks SERENITY15.
// =============================================================================
(function () {
  const DISMISSED_KEY = "serenity_lead_capture_dismissed_at";
  const UNLOCK_KEY = "serenity_promo_unlocked";
  const EMAIL_KEY = "serenity_lead_email";
  const PHONE_KEY = "serenity_lead_phone";
  const NAME_KEY = "serenity_lead_name";
  const PROMO_CODE = "SERENITY15";
  const DISMISS_DAYS = 7;

  function $(id) { return document.getElementById(id); }

  function safeStorageGet(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }

  function safeStorageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (_) {}
  }

  function daysSince(timestamp) {
    if (!timestamp) return Infinity;
    return (Date.now() - Number(timestamp)) / (1000 * 60 * 60 * 24);
  }

  function isUnlocked() {
    return safeStorageGet(UNLOCK_KEY) === "true";
  }

  function shouldShow() {
    if (isUnlocked()) return false;
    return daysSince(safeStorageGet(DISMISSED_KEY)) >= DISMISS_DAYS;
  }

  function injectStyles() {
    if ($("serenity-lead-style")) return;
    const style = document.createElement("style");
    style.id = "serenity-lead-style";
    style.textContent = `
      #serenity-lead-modal { position: fixed; inset: 0; z-index: 120; display: none; align-items: center; justify-content: center; padding: 18px; background: rgba(0,0,0,.64); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
      #serenity-lead-modal.active { display: flex; }
      .serenity-lead-card { width: min(100%, 480px); max-height: min(92vh, 760px); overflow-y: auto; border-radius: 28px; background: #fff; color: #1d1d1f; box-shadow: 0 28px 90px rgba(0,0,0,.38); font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif; pointer-events: auto; }
      .serenity-lead-top { background: #0a0a0c; color: #fff; padding: 26px 26px 21px; text-align: center; }
      .serenity-lead-kicker { color: #79b7ff; font-size: 11px; letter-spacing: .22em; text-transform: uppercase; font-weight: 800; margin-bottom: 10px; }
      .serenity-lead-title { font-size: clamp(25px, 6vw, 31px); line-height: 1.04; letter-spacing: -.04em; font-weight: 850; margin: 0; }
      .serenity-lead-copy { color: rgba(255,255,255,.68); font-size: 13px; line-height: 1.6; margin: 14px auto 0; max-width: 360px; }
      .serenity-lead-body { padding: 22px 26px 24px; }
      .serenity-lead-field { display: block; width: 100%; border: 1.5px solid rgba(0,0,0,.08); border-radius: 14px; padding: 14px 15px; font-size: 16px; line-height: 1.2; margin-bottom: 10px; outline: none; background: #f5f5f7; color: #1d1d1f; appearance: none; -webkit-appearance: none; pointer-events: auto; user-select: text; }
      .serenity-lead-field:focus { border-color: #0a84ff; background: #fff; box-shadow: 0 0 0 3px rgba(10,132,255,.11); }
      .serenity-lead-field::placeholder { color: #86868b; opacity: 1; }
      .serenity-lead-helper { margin: -2px 0 12px; color: #6e6e73; font-size: 11px; line-height: 1.45; }
      .serenity-lead-check { display: flex; align-items: flex-start; gap: 10px; margin: 12px 0 16px; font-size: 11px; line-height: 1.45; color: #6e6e73; }
      .serenity-lead-check input { margin-top: 2px; width: 16px; height: 16px; accent-color: #0a84ff; flex: 0 0 auto; }
      .serenity-lead-submit { width: 100%; border: 0; border-radius: 15px; padding: 15px 18px; color: #fff; background: #0a84ff; font-size: 15px; font-weight: 800; cursor: pointer; transition: transform .18s ease, background .18s ease; }
      .serenity-lead-submit:hover { background: #0071e3; transform: translateY(-1px); }
      .serenity-lead-submit:disabled { opacity: .65; cursor: wait; transform: none; }
      .serenity-lead-secondary { width: 100%; border: 0; background: transparent; color: #86868b; font-size: 12px; font-weight: 700; padding: 12px 0 0; cursor: pointer; }
      .serenity-lead-status { min-height: 16px; margin-top: 10px; font-size: 12px; font-weight: 700; text-align: center; }
      .serenity-lead-fine { color: #86868b; font-size: 10px; line-height: 1.45; margin-top: 12px; text-align: center; }
      .serenity-lead-pill { display: inline-flex; align-items: center; gap: 6px; margin-top: 16px; padding: 8px 12px; border-radius: 999px; background: rgba(10,132,255,.12); color: #79b7ff; font-size: 12px; font-weight: 800; }
      @media (max-width: 420px) { #serenity-lead-modal { align-items: flex-end; padding: 12px; } .serenity-lead-card { border-radius: 24px; } .serenity-lead-top { padding: 24px 20px 18px; } .serenity-lead-body { padding: 20px; } }
    `;
    document.head.appendChild(style);
  }

  function buildModal() {
    if ($("serenity-lead-modal")) return;
    const modal = document.createElement("div");
    modal.id = "serenity-lead-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "serenity-lead-title");
    modal.innerHTML = `
      <div class="serenity-lead-card">
        <div class="serenity-lead-top">
          <div class="serenity-lead-kicker">Researcher Contact List</div>
          <h2 id="serenity-lead-title" class="serenity-lead-title">Unlock 15% off your first order.</h2>
          <p class="serenity-lead-copy">Leave your best contact info for inventory notes, documentation updates, and researcher-only offers.</p>
          <div class="serenity-lead-pill">Code: ${PROMO_CODE}</div>
        </div>
        <form id="serenity-lead-form" class="serenity-lead-body" novalidate>
          <input id="serenity-lead-name" class="serenity-lead-field" type="text" autocomplete="name" placeholder="Name (optional)" />
          <input id="serenity-lead-email" class="serenity-lead-field" type="email" autocomplete="email" placeholder="Email address" />
          <input id="serenity-lead-phone" class="serenity-lead-field" type="tel" autocomplete="tel" inputmode="tel" placeholder="Phone number (optional)" />
          <p class="serenity-lead-helper">Email or phone is enough. No separate area-code field.</p>
          <label class="serenity-lead-check">
            <input id="serenity-lead-sms-consent" type="checkbox" />
            <span>Text me recurring availability, documentation, and offer reminders from Serenity Research Labs. Consent is not required to purchase. Msg/data rates may apply. Reply STOP to opt out.</span>
          </label>
          <button id="serenity-lead-submit" class="serenity-lead-submit" type="submit">Save contact & unlock ${PROMO_CODE}</button>
          <button id="serenity-lead-skip" class="serenity-lead-secondary" type="button">Maybe later</button>
          <div id="serenity-lead-status" class="serenity-lead-status"></div>
          <p class="serenity-lead-fine">For research purposes only. Not for human consumption. SMS reminders are sent only to opted-in contacts.</p>
        </form>
      </div>`;
    document.body.appendChild(modal);

    $("serenity-lead-skip").addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    $("serenity-lead-form").addEventListener("submit", submitLead);
  }

  function showModal() {
    if (!shouldShow()) return;
    injectStyles();
    buildModal();
    setTimeout(() => {
      const modal = $("serenity-lead-modal");
      if (!modal) return;
      modal.classList.add("active");
      const email = $("serenity-lead-email");
      if (email && window.matchMedia("(min-width: 768px)").matches) email.focus({ preventScroll: true });
    }, 250);
  }

  function closeModal() {
    safeStorageSet(DISMISSED_KEY, String(Date.now()));
    const modal = $("serenity-lead-modal");
    if (modal) modal.classList.remove("active");
  }

  function unlock(contact) {
    safeStorageSet(UNLOCK_KEY, "true");
    if (contact.email) safeStorageSet(EMAIL_KEY, contact.email);
    if (contact.phone) safeStorageSet(PHONE_KEY, contact.phone);
    if (contact.name) safeStorageSet(NAME_KEY, contact.name);
    window.dispatchEvent(new CustomEvent("serenity:promo-unlocked", { detail: { ...contact, promoCode: PROMO_CODE } }));
  }

  function looksLikeEmail(email) {
    return !email || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }

  function normalizePhone(phone) {
    return phone.replace(/[^0-9+().\-\s]/g, "").replace(/\s+/g, " ").trim();
  }

  async function submitLead(event) {
    event.preventDefault();
    const name = ($("serenity-lead-name")?.value || "").trim();
    const email = ($("serenity-lead-email")?.value || "").trim().toLowerCase();
    const phone = normalizePhone(($("serenity-lead-phone")?.value || "").trim());
    const smsConsent = Boolean($("serenity-lead-sms-consent")?.checked && phone);
    const status = $("serenity-lead-status");
    const button = $("serenity-lead-submit");
    const contact = { name, email, phone, smsConsent };

    if (!email && !phone) {
      status.style.color = "#ff3b30";
      status.textContent = "Add an email or phone number so we can save your contact.";
      return;
    }
    if (!looksLikeEmail(email)) {
      status.style.color = "#ff3b30";
      status.textContent = "Enter a valid email, or leave email blank and use phone.";
      return;
    }

    button.disabled = true;
    status.style.color = "#6e6e73";
    status.textContent = "Saving contact...";

    try {
      const response = await fetch("/api/lead-capture", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contact, source: window.location.pathname, promoCode: PROMO_CODE }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.error) throw new Error(data.error || "Could not save contact");
      unlock(contact);
      status.style.color = "#16a34a";
      status.textContent = `${PROMO_CODE} unlocked — applying it at checkout.`;
      setTimeout(() => {
        const modal = $("serenity-lead-modal");
        if (modal) modal.classList.remove("active");
      }, 900);
    } catch (error) {
      status.style.color = "#ff3b30";
      status.textContent = error.message || "Something went wrong. Try again.";
    } finally {
      button.disabled = false;
    }
  }

  window.SerenityLeadCapture = { show: showModal, isUnlocked, promoCode: PROMO_CODE };

  window.addEventListener("serenity:age-verified", () => setTimeout(showModal, 700));
  document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/age-status", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((d) => { if (d.verified) setTimeout(showModal, 1200); })
      .catch(() => {});
  });
})();
