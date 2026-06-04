/* ===== product.js — Product detail page ===== */

async function loadProductDetail() {
  const container = document.getElementById("product-detail-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  if (!id) {
    container.innerHTML = `<div class="alert alert-error">No product ID specified.</div>`;
    return;
  }

  try {
    const p = await apiFetch(`/api/products/${id}`);
    document.title = `ShopEasy — ${p.name}`;

    container.innerHTML = `
      <div class="product-detail">
        <img class="product-detail__img" src="${p.image_url}" alt="${escapeHtml(p.name)}" />
        <div>
          <p class="product-detail__category">${escapeHtml(p.category)}</p>
          <h1 class="product-detail__name">${escapeHtml(p.name)}</h1>
          <p class="product-detail__price">$${p.price.toFixed(2)}</p>
          <p class="product-detail__desc">${escapeHtml(p.description)}</p>
          <p class="product-detail__stock ${p.stock === 0 ? "out" : ""}">
            ${p.stock === 0 ? "Out of Stock" : `In Stock (${p.stock} available)`}
          </p>
          ${p.stock > 0 ? `
            <div class="qty-control">
              <label for="qty">Qty:</label>
              <input id="qty" type="number" min="1" max="${p.stock}" value="1" />
            </div>
            <button id="add-btn" class="btn btn-primary" style="min-width:180px;">
              🛒 Add to Cart
            </button>
          ` : `<button class="btn btn-primary" disabled>Out of Stock</button>`}
        </div>
      </div>`;

    const addBtn = document.getElementById("add-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const qty = parseInt(document.getElementById("qty").value) || 1;
        addToCart(p, qty);
        addBtn.textContent = "✔ Added to Cart!";
        addBtn.disabled = true;
        setTimeout(() => { addBtn.textContent = "🛒 Add to Cart"; addBtn.disabled = false; }, 1800);
      });
    }
  } catch (err) {
    container.innerHTML = `
      <div class="alert alert-error">
        ${err.message === "Product not found" ? "Product not found." : `Error: ${escapeHtml(err.message)}`}
      </div>`;
  }
}

document.addEventListener("DOMContentLoaded", loadProductDetail);
