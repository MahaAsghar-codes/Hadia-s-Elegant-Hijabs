(function () {
  const brand = "Hadia's Elegant Hijabs";
  window.renderLayout = function renderLayout(active = '') {
    const nav = `
      <header class="site-header">
        <div class="container nav-row">
          <a class="brand" href="/frontend/index.html">${brand}</a>
          <button id="menuToggle" class="menu-toggle" aria-label="Toggle menu">☰</button>
          <nav id="mainNav" class="main-nav">
            <a href="/frontend/index.html" ${active === 'home' ? 'class="active"' : ''}>Home</a>
            <a href="/frontend/pages/products.html" ${active === 'products' ? 'class="active"' : ''}>Shop</a>
            <a href="/frontend/pages/wishlist.html" ${active === 'wishlist' ? 'class="active"' : ''}>Wishlist</a>
            <a href="/frontend/pages/cart.html" ${active === 'cart' ? 'class="active"' : ''}>Cart</a>
            <a href="/frontend/pages/about.html" ${active === 'about' ? 'class="active"' : ''}>About</a>
            <a href="/frontend/pages/contact.html" ${active === 'contact' ? 'class="active"' : ''}>Contact</a>
            <a href="/frontend/pages/faq.html" ${active === 'faq' ? 'class="active"' : ''}>FAQ</a>
            <a href="/frontend/pages/admin.html" ${active === 'admin' ? 'class="active"' : ''}>Admin</a>
          </nav>
          <button id="themeToggle" class="theme-toggle" aria-label="Toggle theme">🌓</button>
        </div>
      </header>`;

    const footer = `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div>
            <h4>${brand}</h4>
            <p>Elegant, modern and modest essentials for students and working women.</p>
          </div>
          <div>
            <h5>Follow us</h5>
            <div class="social-links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a>
            </div>
          </div>
        </div>
      </footer>
      <a class="whatsapp-float" href="https://wa.me/923000000000" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">💬</a>
    `;

    const headerRoot = document.getElementById('layout-header');
    const footerRoot = document.getElementById('layout-footer');
    if (headerRoot) headerRoot.innerHTML = nav;
    if (footerRoot) footerRoot.innerHTML = footer;

    const menuBtn = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    if (menuBtn && mainNav) {
      menuBtn.addEventListener('click', () => mainNav.classList.toggle('show'));
    }
  };
})();
