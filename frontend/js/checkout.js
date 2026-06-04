/* ===== checkout.js — Checkout form + order submission ===== */

function renderCheckoutPage() {
  const container = document.getElementById("checkout-container");
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Your cart is empty. Add some products first!</p>
        <a href="index.html" class="btn btn-primary">Go Shopping</a>
      </div>`;
    return;
  }

  const subtotal = cartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const orderItemsHTML = cart.map((item) => `
    <div class="order-item-row">
      <span>${escapeHtml(item.name)} × ${item.quantity}</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join("");

  container.innerHTML = `
    <h1 class="page-title">Checkout</h1>
    <div class="checkout-layout">

      <form id="checkout-form">
        <div class="form-card">
          <h2>Contact Information</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="name">Full Name *</label>
              <input id="name" type="text" required placeholder="Jane Doe" autocomplete="name" />
            </div>
            <div class="form-group">
              <label for="email">Email Address *</label>
              <input id="email" type="email" required placeholder="jane@example.com" autocomplete="email" />
            </div>
          </div>
        </div>

        <div class="form-card" style="margin-top:1.25rem;">
          <h2>Shipping Address</h2>
          <div class="form-group">
            <label for="street">Street Address *</label>
            <input id="street" type="text" required placeholder="123 Main St, Apt 4B" autocomplete="street-address" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="city">City *</label>
              <input id="city" type="text" required placeholder="New York" autocomplete="address-level2" />
            </div>
            <div class="form-group">
              <label for="zip">ZIP / Postal Code *</label>
              <input id="zip" type="text" required placeholder="10001" autocomplete="postal-code" />
            </div>
          </div>
          <div class="form-group">
            <label for="country">Country *</label>
            <input id="country" type="text" required placeholder="United States" autocomplete="country-name" />
          </div>
        </div>

        <div id="form-error" style="margin-top:1rem;"></div>

        <button type="submit" class="btn btn-success btn-block" style="margin-top:1.25rem;padding:.85rem;">
          Place Order
        </button>
      </form>

      <aside class="order-summary">
        <h2>Order Summary</h2>
        ${orderItemsHTML}
        <div class="order-item-row">
          <span>Shipping</span>
          <span>${shipping === 0 ? "FREE" : "$" + shipping.toFixed(2)}</span>
        </div>
        <div class="order-total-row">
          <span>Total</span>
          <span>$${total.toFixed(2)}</span>
        </div>
      </aside>
    </div>`;

  document.getElementById("checkout-form").addEventListener("submit", handleSubmit);
}

async function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector("[type=submit]");
  const errorDiv = document.getElementById("form-error");
  errorDiv.innerHTML = "";
  btn.disabled = true;
  btn.textContent = "Placing Order…";

  const name    = document.getElementById("name").value.trim();
  const email   = document.getElementById("email").value.trim();
  const street  = document.getElementById("street").value.trim();
  const city    = document.getElementById("city").value.trim();
  const zip     = document.getElementById("zip").value.trim();
  const country = document.getElementById("country").value.trim();
  const address = `${street}, ${city}, ${zip}, ${country}`;

  const cart = getCart();
  const items = cart.map((i) => ({
    product_id: i.id,
    quantity: i.quantity,
    price_at_purchase: i.price,
  }));

  try {
    const order = await apiFetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        customer_name: name,
        customer_email: email,
        address,
        items,
      }),
    });

    clearCart();
    renderConfirmation(order);
  } catch (err) {
    errorDiv.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
    btn.disabled = false;
    btn.textContent = "Place Order";
  }
}

function renderConfirmation(order) {
  const container = document.getElementById("checkout-container");
  container.innerHTML = `
    <div class="confirmation-box">
      <div class="check-icon">✅</div>
      <h1>Order Confirmed!</h1>
      <p>Thank you, <strong>${escapeHtml(order.customer_name)}</strong>. Your order has been placed successfully.</p>
      <p>A confirmation will be sent to <strong>${escapeHtml(order.customer_email)}</strong>.</p>
      <div class="order-id">Order #${order.id}</div>
      <p style="margin-bottom:1.75rem;">
        Total paid: <strong>$${parseFloat(order.total).toFixed(2)}</strong>
      </p>
      <a href="index.html" class="btn btn-primary">Continue Shopping</a>
    </div>`;
  updateCartBadge();
}

document.addEventListener("DOMContentLoaded", renderCheckoutPage);
