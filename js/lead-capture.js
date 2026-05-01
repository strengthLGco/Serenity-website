// =============================================================================
// SERENITY RESEARCH LABS — LEAD CAPTURE + SERENITY15 UNLOCK
// Shows after age verification, captures email/SMS opt-in, and gates SERENITY15.
// =============================================================================
(function () {
  const DISMISSED_KEY = "serenity_lead_capture_dismissed_at";
  const UNLOCK_KEY = "serenity_promo_unlocked";
  const EMAIL_KEY = "serenity_lead_email";
  const PHONE_KEY = "serenity_lead_phone";
  const PROMO_CODE = "SERENITY15";
  const DISMISS_DAYS = 7;

  function $(id) { return document.getElementById(id); }

  function daysSince(timestamp) {
    if (!timestamp) return Infinity;
    return (Date.now() - Number(timestamp)) / (1000 * 60 * 60 * 24);
  }

  function isUnlocked() {
    return localStorage.getItem(UNLOCK_KEY) === "true";
  }

  function shouldShow() {
    if (isUnlocked()) return false;
    return daysSince(localStorage.getItem(DISMISSED_KEY)) >= DISMISS_DAYS;
  }

  function injectStyles() {
    if ($("serenity-lead-style")) return;
    const style = document.createElement("style");
    style.id = "serenity-lead-style";
    style.textContent = `
      #serenity-lead-modal { position: fixed; inset: 0; z-index: 95; display: none; align-items: center; justify-content: center; padding: 24px; background: rgba(0,0,0,.64); backdrop-filter: blur(10px); }
      #serenity-lead-modal.active { display: flex; }
      .serenity-lead-card { width: min(100%, 460px); border-radius: 28px; background: #fff; color: #1d1d1f; box-shadow: 0 28px 90px rgba(0,0,0,.38); overflow: hidden; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif; }
      .serenity-lead-top { background: #0a0a0c; color: #fff; padding: 28px 28px 22px; text-align: center; }
      .serenity-lead-kicker { color: #79b7ff; font-size: 11px; letter-spacing: .22em; text-transform: uppercase; font-weight: 800; margin-bottom: 10px; }
      .serenity-lead-title { font-size: 30px; line-height: 1.04; letter-spacing: -.04em; font-weight: 850; margin: 0; }
      .serenity-lead-copy { color: rgba(255,255,255,.66); font-size: 13px; line-height: 1.6; margin: 14px auto 0; max-width: 340px; }
      .serenity-lead-body { padding: 24px 28px 26px; }
      .serenity-lead-field { width: 100%; border: 1.5px solid rgba(0,0,0,.08); border-radius: 14px; padding: 14px 15px; font-size: 15px; margin-bottom: 10px; outline: none; background: #f5f5f7; color: #1d1d1f; }
      .serenity-lead-field:focus { border-color: #0a84ff; background: #fff; box-shadow: 0 0 0 3px rgba(10,132,255,.11); }
      .serenity-lead-check { display: flex; align-items: flex-start; gap: 10px; margin: 12px 0 16px; font-size: 11px; line-height: 1.45; color: #6e6e73; }
      .serenity-lead-check input { margin-top: 2px; width: 16px; height: 16px; accent-color: #0a84ff; flex: 0 0 auto; }
      .serenity-lead-submit { width: 100%; border: 0; border-radius: 15px; padding: 15px 18px; color: #fff; background: #0a84ff; font-size: 15px; font-weight: 800; cursor: pointer; transition: transform .18s ease, background .18s ease; }
      .serenity-lead-submit:hover { background: #0071e3; transform: translateY(-1px); }
      .serenity-lead-submit:disabled { opacity: .65; cursor: wait; transform: none; }
      .serenity-lead-secondary { width: 100%; border: 0; background: transparent; color: #86868b; font-size: 12px; font-weight: 700; padding: 12px 0 0; cursor: pointer; }
      .serenity-lead-status { min-height: 16px; margin-top: 10px; font-size: 12px; font-weight: 700; text-align: center; }
      .serenity-lead-fine { color: #86868b; font-size: 10px; line-height: 1.45; margin-top: 12px; text-align: center; }
      .serenity-lead-pill { display: inline-flex; align-items: center; gap: 6px; margin-top: 16px; padding: 8px 12px; border-radius: 999px; background: rgba(10,132,255,.12); color: #79b7ff; font-size: 12px; font-weight: 800; }
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
          <div class="serenity-lead-kicker">Qualified Researcher Offer</div>
          <h2 id="serenity-lead-title" class="serenity-lead-title">Unlock 15% off your first order.</h2>
          <p class="serenity-lead-copy">Join the Serenity list for product availability notes, documentation updates, and researcher-only offers.</p>
          <div class="serenity-lead-pill">Code: ${PROMO_CODE}</div>
        </div>
        <form id="serenity-lead-form" class="serenity-lead-body">
          <input id="serenity-lead-email" class="serenity-lead-field" type="email" autocomplete="email" placeholder="Email address" required />
          <input id="serenity-lead-phone" class="serenity-lead-field" type="tel" autocomplete="tel" placeholder="Phone number for SMS reminders (optional)" />
          <label class="serenity-lead-check">
            <input id="serenity-lead-sms-consent" type="checkbox" />
            <span>I agree to receive automated SMS updates and offers from Serenity Research Labs. Consent is not required to purchase. Msg/data rates may apply. Reply STOP to opt out.</span>
          </label>
          <button id="serenity-lead-submit" class="serenity-lead-submit" type="submit">Unlock SERENITY15</button>
          <button id="serenity-lead-skip" class="serenity-lead-secondary" type="button">Maybe later</button>
          <div id="serenity-lead-status" class="serenity-lead-status"></div>
          <p class="serenity-lead-fine">For research purposes only. Not for human consumption. Offers are sent only to opted-in contacts.</p>
        </form>
      </div>`;
    document.body.appendChild(modal);

    $("serenity-lead-skip").addEventListener("click", closeModal);
    $("serenity-lead-modal").addEventListener("click", (event) => {
      if (event.target.id === "serenity-lead-modal") closeModal();
    });
    $("serenity-lead-form").addEventListener("submit", submitLead);
  }

  function showModal() {
    if (!shouldShow()) return;
    injectStyles();
    buildModal();
    setTimeout(() => $("serenity-lead-modal").classList.add("active"), 250);
  }

  function closeModal() {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    const modal = $("serenity-lead-modal");
    if (modal) modal.classList.remove("active");
  }

  function unlock(email, phone) {
    localStorage.setItem(UNLOCK_KEY, "true");
    if (email) localStorage.setItem(EMAIL_KEY, email);
    if (phone) localStorage.setItem(PHONE_KEY, phone);
    window.dispatchEvent(new CustomEvent("serenity:promo-unlocked", { detail: { email, phone, promoCode: PROMO_CODE } }));
  }

  async function submitLead(event) {
    event.preventDefault();
    const email = $("serenity-lead-email").value.trim();
    const phone = $("serenity-lead-phone").value.trim();
    const smsConsent = $("serenity-lead-sms-consent").checked;
    const status = $("serenity-lead-status");
    const button = $("serenity-lead-submit");

    if (!email) {
      status.style.color = "#ff3b30";
      status.textContent = "Enter an email to unlock the code.";
      return;
    }
    if (phone && !smsConsent) {
      status.style.color = "#ff3b30";
      status.textContent = "Check SMS consent to use the phone field, or leave phone blank.";
      return;
    }

    button.disabled = true;
    status.style.color = "#6e6e73";
    status.textContent = "Unlocking...";

    try {
      const response = await fetch("/api/lead-capture", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, smsConsent, source: window.location.pathname, promoCode: PROMO_CODE }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || "Could not save signup");
      unlock(email, phone);
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
