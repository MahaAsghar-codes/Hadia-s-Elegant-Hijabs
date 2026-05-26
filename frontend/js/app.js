const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const state = {
  products: [],
  categories: []
};

const cartKey = 'hadia_cart_local';
const wishlistKey = 'hadia_wishlist_local';

const ui = {
  navCartCount: document.querySelector('#navCartCount'),
  featuredContainer: document.querySelector('#featuredProducts'),
  categoriesContainer: document.querySelector('#categoryGrid'),
  productGrid: document.querySelector('#productGrid')
};

const localCart = {
  get() {
    return JSON.parse(localStorage.getItem(cartKey) || '[]');
  },
  set(items) {
    localStorage.setItem(cartKey, JSON.stringify(items));
    renderCartCount();
  },
  add(product) {
    const cart = this.get();
    const found = cart.find((item) => item._id === product._id);
    if (found) found.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    this.set(cart);
  }
};

const localWishlist = {
  get() {
    return JSON.parse(localStorage.getItem(wishlistKey) || '[]');
  },
  toggle(productId) {
    const set = new Set(this.get());
    if (set.has(productId)) set.delete(productId);
    else set.add(productId);
    localStorage.setItem(wishlistKey, JSON.stringify([...set]));
  }
};

function renderCartCount() {
  if (!ui.navCartCount) return;
  const count = localCart.get().reduce((sum, item) => sum + item.quantity, 0);
  ui.navCartCount.textContent = count;
}

function notify(message) {
  const existing = document.querySelector('.toast-message');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2200);
}

function productCard(product) {
  const wished = localWishlist.get().includes(product._id);
  return `
    <article class="card">
      <a href="/pages/product?id=${product._id}">
      <img src="${product.image || '/assets/placeholder-product.svg'}" alt="${product.name}" />
      </a>
      <p class="badge">${product.category?.name || 'Collection'}</p>
      <h3>${product.name}</h3>
      <p class="muted">${product.description.slice(0, 80)}...</p>
      <strong>${formatter.format(product.price)}</strong>
      <div style="display:flex; gap:8px; margin-top:10px;">
        <button class="btn" data-action="add-cart" data-product-id="${product._id}">Add to cart</button>
        <button class="btn secondary" data-action="toggle-wishlist" data-product-id="${product._id}">${wished ? '♥' : '♡'} Wishlist</button>
      </div>
    </article>
  `;
}

function bindProductActions(scope = document) {
  scope.querySelectorAll('[data-action="add-cart"]').forEach((button) => {
    button.onclick = () => {
      const product = state.products.find((item) => item._id === button.dataset.productId);
      if (!product) return;
      localCart.add(product);
      notify(`${product.name} added to cart`);
    };
  });

  scope.querySelectorAll('[data-action="toggle-wishlist"]').forEach((button) => {
    button.onclick = () => {
      localWishlist.toggle(button.dataset.productId);
      const wished = localWishlist.get().includes(button.dataset.productId);
      button.textContent = `${wished ? '♥' : '♡'} Wishlist`;
      if (document.querySelector('#wishlistGrid')) loadWishlistPage();
    };
  });
}

async function loadHomeData() {
  if (!ui.featuredContainer && !ui.categoriesContainer) return;

  try {
    const [categories, featured] = await Promise.all([
      hadiaApi.request('/categories'),
      hadiaApi.request('/products?featured=true')
    ]);

    state.categories = categories;
    state.products = featured;

    if (ui.categoriesContainer) {
      ui.categoriesContainer.innerHTML = categories
        .map((category) => `<div class="card"><h3>${category.name}</h3><p class="muted">${category.description}</p></div>`)
        .join('');
    }

    if (ui.featuredContainer) {
      ui.featuredContainer.innerHTML = featured.map(productCard).join('');
      bindProductActions(ui.featuredContainer);
    }
  } catch (error) {
    console.error(error);
  }
}

async function loadProductsPage() {
  if (!ui.productGrid) return;

  const searchInput = document.querySelector('#searchInput');
  const categorySelect = document.querySelector('#categorySelect');
  const priceSelect = document.querySelector('#priceSelect');

  try {
    const categories = await hadiaApi.request('/categories');
    categorySelect.innerHTML = `<option value="">All categories</option>${categories
      .map((category) => `<option value="${category._id}">${category.name}</option>`)
      .join('')}`;
  } catch (_) {}

  const fetchAndRender = async () => {
    const params = new URLSearchParams();
    if (searchInput.value.trim()) params.set('q', searchInput.value.trim());
    if (categorySelect.value) params.set('category', categorySelect.value);
    if (priceSelect.value) {
      const [min, max] = priceSelect.value.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }

    try {
      const products = await hadiaApi.request(`/products?${params.toString()}`);
      state.products = products;
      ui.productGrid.innerHTML = products.length
        ? products.map(productCard).join('')
        : '<p class="muted">No products found for selected filters.</p>';
      bindProductActions(ui.productGrid);
    } catch (error) {
      ui.productGrid.innerHTML = `<p>${error.message}</p>`;
    }
  };

  [searchInput, categorySelect, priceSelect].forEach((el) => el?.addEventListener('input', fetchAndRender));
  [categorySelect, priceSelect].forEach((el) => el?.addEventListener('change', fetchAndRender));

  fetchAndRender();
}

function loadCartPage() {
  const cartList = document.querySelector('#cartList');
  const totalEl = document.querySelector('#cartTotal');
  const checkoutForm = document.querySelector('#checkoutForm');
  if (!cartList || !totalEl || !checkoutForm) return;

  const render = () => {
    const cart = localCart.get();
    if (!cart.length) {
      cartList.innerHTML = '<p class="muted">Your cart is empty.</p>';
      totalEl.textContent = formatter.format(0);
      return;
    }

    cartList.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-row">
        <div>
          <strong>${item.name}</strong>
          <p class="muted">${formatter.format(item.price)} × ${item.quantity}</p>
        </div>
        <button class="btn secondary" data-remove-id="${item._id}">Remove</button>
      </div>`
      )
      .join('');

    cartList.querySelectorAll('[data-remove-id]').forEach((button) => {
      button.onclick = () => {
        const updatedCart = localCart.get().filter((item) => item._id !== button.dataset.removeId);
        localCart.set(updatedCart);
        render();
      };
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalEl.textContent = formatter.format(total);
  };

  checkoutForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(checkoutForm);
    const shippingAddress = {
      fullName: formData.get('fullName'),
      city: formData.get('city'),
      address: formData.get('address'),
      phone: formData.get('phone')
    };

    try {
      await hadiaApi.request('/orders', {
        method: 'POST',
        body: JSON.stringify({ shippingAddress })
      });
      localCart.set([]);
      render();
      notify('Order placed successfully!');
    } catch (error) {
      notify(`Checkout requires login/API token: ${error.message}`);
    }
  });

  render();
}

function applyTheme() {
  const toggle = document.querySelector('#themeToggle');
  if (!toggle) return;

  const saved = localStorage.getItem('hadia_theme');
  if (saved === 'dark') document.body.classList.add('dark');

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('hadia_theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });
}

function setupContactForm() {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    try {
      await hadiaApi.request('/contact', { method: 'POST', body: JSON.stringify(payload) });
      form.reset();
      notify('Message sent successfully. We will contact you soon.');
    } catch (error) {
      notify(error.message);
    }
  });
}

function setupAuthForms() {
  const signupForm = document.querySelector('#signupForm');
  const loginForm = document.querySelector('#loginForm');
  const adminLoginForm = document.querySelector('#adminLoginForm');

  if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(signupForm));
      const response = await hadiaApi.request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
      hadiaApi.setToken(response.token);
      notify('Signup successful');
      window.location.href = '/';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(loginForm));
      const response = await hadiaApi.request('/auth/login', { method: 'POST', body: JSON.stringify(data) });
      hadiaApi.setToken(response.token);
      notify('Login successful');
      window.location.href = '/';
    });
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(adminLoginForm));
      const response = await hadiaApi.request('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      hadiaApi.setToken(response.token);
      notify('Admin login successful');
      window.location.href = '/pages/admin';
    });
  }
}

async function loadAdminPage() {
  const statsWrap = document.querySelector('#adminStats');
  const usersWrap = document.querySelector('#adminUsers');
  const ordersWrap = document.querySelector('#adminOrders');
  const productsWrap = document.querySelector('#adminProducts');
  const productForm = document.querySelector('#productForm');
  if (!statsWrap || !usersWrap || !ordersWrap || !productsWrap || !productForm) return;

  try {
    const [stats, users, orders, products] = await Promise.all([
      hadiaApi.request('/admin/stats'),
      hadiaApi.request('/admin/users'),
      hadiaApi.request('/orders'),
      hadiaApi.request('/products')
    ]);

    statsWrap.innerHTML = `
      <div class="card"><h3>${stats.users}</h3><p class="muted">Users</p></div>
      <div class="card"><h3>${stats.products}</h3><p class="muted">Products</p></div>
      <div class="card"><h3>${stats.orders}</h3><p class="muted">Orders</p></div>
      <div class="card"><h3>${formatter.format(stats.totalSales)}</h3><p class="muted">Total Sales</p></div>
    `;

    usersWrap.innerHTML = users
      .map((user) => `<div class="card"><strong>${user.name}</strong><p class="muted">${user.email} · ${user.role}</p></div>`)
      .join('');

    productsWrap.innerHTML = products
      .map(
        (product) =>
          `<div class="card"><strong>${product.name}</strong><p class="muted">${formatter.format(product.price)} · Stock ${product.stock}</p>
          <button class="btn secondary" data-product-delete="${product._id}">Delete</button></div>`
      )
      .join('');

    productsWrap.querySelectorAll('[data-product-delete]').forEach((button) => {
      button.addEventListener('click', async () => {
        await hadiaApi.request(`/products/${button.dataset.productDelete}`, { method: 'DELETE' });
        window.location.reload();
      });
    });

    productForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(productForm));
      await hadiaApi.request('/products', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          price: Number(data.price),
          stock: Number(data.stock)
        })
      });
      productForm.reset();
      window.location.reload();
    });

    ordersWrap.innerHTML = orders
      .map(
        (order) =>
          `<div class="card"><strong>${order.user?.name || 'User'}</strong><p class="muted">${formatter.format(
            order.totalPrice
          )} · ${order.status}</p>
          <select data-order-id="${order._id}" class="order-status">
            ${['pending', 'processing', 'shipped', 'delivered']
              .map((status) => `<option value="${status}" ${order.status === status ? 'selected' : ''}>${status}</option>`)
              .join('')}
          </select>
          </div>`
      )
      .join('');

    ordersWrap.querySelectorAll('.order-status').forEach((select) => {
      select.addEventListener('change', async () => {
        await hadiaApi.request(`/orders/${select.dataset.orderId}/status`, {
          method: 'PUT',
          body: JSON.stringify({ status: select.value })
        });
      });
    });
  } catch (error) {
    statsWrap.innerHTML = `<p class="muted">Admin data unavailable: ${error.message}</p>`;
  }
}

async function loadProductDetailPage() {
  const detail = document.querySelector('#productDetail');
  if (!detail) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    detail.innerHTML = '<p class="muted">Product not found.</p>';
    return;
  }

  try {
    const product = await hadiaApi.request(`/products/${id}`);
    state.products = [product];
    detail.innerHTML = `
      <div class="grid cols-2" style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        <img src="${product.image || '/assets/placeholder-product.svg'}" alt="${product.name}" style="width:100%; border-radius:12px;" />
        <div>
          <p class="badge">${product.category?.name || 'Collection'}</p>
          <h1>${product.name}</h1>
          <p class="muted">${product.description}</p>
          <p><strong>${formatter.format(product.price)}</strong></p>
          <button class="btn" data-action="add-cart" data-product-id="${product._id}">Add to cart</button>
          <button class="btn secondary" data-action="toggle-wishlist" data-product-id="${product._id}" style="margin-left:8px;">Wishlist</button>
        </div>
      </div>
    `;
    bindProductActions(detail);
  } catch (error) {
    detail.innerHTML = `<p class="muted">${error.message}</p>`;
  }
}

async function loadWishlistPage() {
  const wrap = document.querySelector('#wishlistGrid');
  if (!wrap) return;

  const ids = localWishlist.get();
  if (!ids.length) {
    wrap.innerHTML = '<p class="muted">No items in wishlist yet.</p>';
    return;
  }

  const items = await Promise.all(
    ids.map(async (id) => {
      try {
        return await hadiaApi.request(`/products/${id}`);
      } catch (_) {
        return null;
      }
    })
  );

  state.products = items.filter(Boolean);
  wrap.innerHTML = state.products.length
    ? state.products.map(productCard).join('')
    : '<p class="muted">No wishlist items available.</p>';
  bindProductActions(wrap);
}

function initializeApp() {
  renderCartCount();
  applyTheme();
  loadHomeData();
  loadProductsPage();
  loadProductDetailPage();
  loadWishlistPage();
  loadCartPage();
  setupContactForm();
  setupAuthForms();
  loadAdminPage();
  const whatsappButton = document.querySelector('#whatsappBtn');
  if (whatsappButton) whatsappButton.href = `https://wa.me/${window.WHATSAPP_NUMBER}`;
}

initializeApp();
document.addEventListener('layoutLoaded', () => {
  renderCartCount();
  applyTheme();
});
