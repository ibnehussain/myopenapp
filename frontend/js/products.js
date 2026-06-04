/* ===== products.js — Product listing page ===== */

let currentCategory = "";

async function loadProducts(category = "") {
  const container = document.getElementById("product-container");
  if (!container) return;

  container.innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>';

  try {
    const path = category ? `/api/products?category=${encodeURIComponent(category)}` : "/api/products";
    const products = await apiFetch(path);

    if (products.length === 0) {
      container.innerHTML = `<div class="empty-state"><p>No products found in this category.</p></div>`;
      return;
    }

    container.innerHTML = `
      <div class="product-grid">
        ${products.map(renderProductCard).join("")}
      </div>`;

    container.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const product = products.find((p) => p.id === parseInt(btn.dataset.id));
        if (product) {
          addToCart(product, 1);
          btn.textContent = "✔ Added!";
          btn.disabled = true;
          setTimeout(() => { btn.textContent = "Add to Cart"; btn.disabled = false; }, 1500);
        }
      });
    });
  } catch (err) {
    container.innerHTML = `
      <div class="alert alert-error">Failed to load products: ${escapeHtml(err.message)}</div>`;
  }
}

function renderProductCard(p) {
  return `
    <div class="product-card">
      <a href="product.html?id=${p.id}">
        <img class="product-card__img" src="${p.image_url}" alt="${escapeHtml(p.name)}" loading="lazy" />
      </a>
      <div class="product-card__body">
        <span class="product-card__category">${escapeHtml(p.category)}</span>
        <a href="product.html?id=${p.id}">
          <div class="product-card__name">${escapeHtml(p.name)}</div>
        </a>
        <div class="product-card__price">$${p.price.toFixed(2)}</div>
      </div>
      <div class="product-card__footer">
        <a href="product.html?id=${p.id}" class="btn btn-secondary" style="flex:1;">View</a>
        <button class="btn btn-primary add-to-cart-btn" data-id="${p.id}" style="flex:2;" ${p.stock === 0 ? "disabled" : ""}>
          ${p.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>`;
}

function initFilterBar() {
  const bar = document.getElementById("filter-bar");
  if (!bar) return;

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    bar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    loadProducts(currentCategory);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initFilterBar();
  loadProducts();
});
