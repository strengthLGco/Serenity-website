// =============================================================================
// SERENITY RESEARCH LABS — SHARED CART SYSTEM
// All product pages and checkout include this file.
// Cart data lives in localStorage so it persists across pages.
// =============================================================================

const SerenityCart = (() => {
  const STORAGE_KEY = "serenity_cart";

  // ---------------------------------------------------------------------------
  // Core cart operations
  // ---------------------------------------------------------------------------
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function addItem(product) {
    const cart = getCart();
    const subscription = product.subscription || "one-time";
    const existing = cart.find(item => item.id === product.id && (item.subscription || "one-time") === subscription);
    if (existing) {
      existing.qty += product.qty || 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        desc: product.desc || "",
        price: product.price,
        qty: product.qty || 1,
        icon: product.icon || "science",
        subscription: subscription,
        subscriptionLabel: product.subscriptionLabel || "One-time purchase",
        discount: product.discount || 0,
      });
    }
    saveCart(cart);
    updateCartBadge();
    return cart;
  }

  function removeItem(productId) {
    let cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    updateCartBadge();
    return cart;
  }

  function updateQty(productId, qty) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.qty = Math.max(1, qty);
    }
    saveCart(cart);
    updateCartBadge();
    return cart;
  }

  function clearCart() {
    localStorage.removeItem(STORAGE_KEY);
    updateCartBadge();
  }

  function getTotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function getItemCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
  }

  // ---------------------------------------------------------------------------
  // Badge — updates the cart icon count on any page
  // ---------------------------------------------------------------------------
  function updateCartBadge() {
    const count = getItemCount();
    const badges = document.querySelectorAll("[data-cart-badge]");
    badges.forEach(badge => {
      if (count > 0) {
        badge.textContent = count > 9 ? "9+" : count;
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Product page: quantity selector + add to cart
  // ---------------------------------------------------------------------------
  function initProductPage() {
    let qty = 1;
    const qtyDisplay = document.querySelector("[data-qty-display]");
    const minusBtn = document.querySelector("[data-qty-minus]");
    const plusBtn = document.querySelector("[data-qty-plus]");
    const addBtn = document.querySelector("[data-add-to-cart]");

    if (!addBtn) return; // not a product page

    if (minusBtn) {
      minusBtn.addEventListener("click", () => {
        qty = Math.max(1, qty - 1);
        if (qtyDisplay) qtyDisplay.textContent = qty;
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener("click", () => {
        qty = Math.min(10, qty + 1);
        if (qtyDisplay) qtyDisplay.textContent = qty;
      });
    }

    addBtn.addEventListener("click", () => {
      const product = {
        id: addBtn.dataset.productId,
        name: addBtn.dataset.productName,
        desc: addBtn.dataset.productDesc || "",
        price: parseFloat(addBtn.dataset.productPrice),
        icon: addBtn.dataset.productIcon || "science",
        qty: qty,
        subscription: addBtn.dataset.subscription || "one-time",
        subscriptionLabel: addBtn.dataset.subscriptionLabel || "One-time purchase",
        discount: parseInt(addBtn.dataset.discount || "0", 10),
      };

      addItem(product);

      // Visual feedback
      const origText = addBtn.textContent;
      addBtn.textContent = "✓ Added to Cart";
      addBtn.classList.add("!bg-green-600");
      setTimeout(() => {
        addBtn.textContent = origText;
        addBtn.classList.remove("!bg-green-600");
      }, 1500);
    });

    // Also wire up cross-sell "add" buttons if present
    document.querySelectorAll("[data-cross-sell-add]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const product = {
          id: btn.dataset.productId,
          name: btn.dataset.productName,
          desc: btn.dataset.productDesc || "",
          price: parseFloat(btn.dataset.productPrice),
          icon: btn.dataset.productIcon || "science",
          qty: 1,
          subscription: btn.dataset.subscription || "one-time",
          subscriptionLabel: btn.dataset.subscriptionLabel || "One-time purchase",
          discount: parseInt(btn.dataset.discount || "0", 10),
        };
        addItem(product);
        btn.textContent = "✓ Added";
        btn.classList.add("!bg-green-600", "!text-white");
        setTimeout(() => {
          btn.textContent = "Add";
          btn.classList.remove("!bg-green-600", "!text-white");
        }, 1500);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Cart icon click → go to checkout
  // ---------------------------------------------------------------------------
  function initCartIcon() {
    document.querySelectorAll("[data-cart-link]").forEach(el => {
      el.addEventListener("click", () => {
        // Navigate relative to current page
        const depth = window.location.pathname.split("/").filter(Boolean).length;
        const prefix = depth > 1 ? "../" : "";
        window.location.href = prefix + "checkout/code.html";
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Init: run on every page
  // ---------------------------------------------------------------------------
  function init() {
    updateCartBadge();
    initCartIcon();
    initProductPage();
  }

  // Auto-init when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Public API
  return { getCart, addItem, removeItem, updateQty, clearCart, getTotal, getItemCount, updateCartBadge };
})();
