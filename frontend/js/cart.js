/* ===== cart.js — localStorage cart logic (shared by all pages) ===== */

const CART_KEY = "shopeasy_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = total;
  badge.style.display = total === 0 ? "none" : "flex";
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity,
    });
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  saveCart(getCart().filter((i) => i.id !== productId));
}

function updateQuantity(productId, quantity) {
  if (quantity < 1) { removeFromCart(productId); return; }
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (item) { item.quantity = quantity; saveCart(cart); }
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function cartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
}

// Initialise badge on every page load
document.addEventListener("DOMContentLoaded", updateCartBadge);


/* ===== Cart Page rendering (only runs on cart.html) ===== */
function renderCartPage() {
  const container = document.getElementById("cart-container");
  if (!container) return;

  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Your cart is empty.</p>
        <a href="index.html" class="btn btn-primary">Continue Shopping</a>
      </div>`;
    return;
  }

  const itemsHTML = cart.map((item) => `
    <div class="cart-item" data-id="${item.id}">
      <img class="cart-item__img" src="${item.image_url}" alt="${escapeHtml(item.name)}" />
      <div>
        <div class="cart-item__name">${escapeHtml(item.name)}</div>
        <div class="cart-item__price">$${item.price.toFixed(2)} each</div>
      </div>
      <div class="cart-item__controls">
        <span class="cart-item__subtotal">$${(item.price * item.quantity).toFixed(2)}</span>
        <input
          class="qty-input"
          type="number"
          min="1"
          value="${item.quantity}"
          data-id="${item.id}"
          aria-label="Quantity for ${escapeHtml(item.name)}"
        />
        <button class="btn-remove" data-id="${item.id}" aria-label="Remove ${escapeHtml(item.name)}">✕ Remove</button>
      </div>
    </div>
  `).join("");

  const subtotal = cartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  container.innerHTML = `
    <div class="cart-layout">
      <div id="cart-items">${itemsHTML}</div>
      <aside class="cart-summary">
        <h2>Order Summary</h2>
        <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? "FREE" : "$" + shipping.toFixed(2)}</span></div>
        ${shipping > 0 ? `<p style="font-size:.8rem;color:var(--muted);margin-bottom:.5rem;">Free shipping on orders over $50</p>` : ""}
        <div class="summary-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
        <a href="checkout.html" class="btn btn-primary btn-block" style="margin-top:1.25rem;">Proceed to Checkout</a>
        <a href="index.html" class="btn btn-secondary btn-block" style="margin-top:.5rem;">Continue Shopping</a>
      </aside>
    </div>`;

  // Quantity change
  container.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      updateQuantity(parseInt(e.target.dataset.id), parseInt(e.target.value) || 1);
      renderCartPage();
    });
  });

  // Remove
  container.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      removeFromCart(parseInt(e.target.dataset.id));
      renderCartPage();
    });
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

document.addEventListener("DOMContentLoaded", renderCartPage);
