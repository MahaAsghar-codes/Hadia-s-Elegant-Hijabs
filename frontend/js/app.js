(function () {
  window.initCommonUI = function initCommonUI(active) {
    if (window.renderLayout) window.renderLayout(active);

    const root = document.documentElement;
    const storedTheme = localStorage.getItem('theme') || 'light';
    root.setAttribute('data-theme', storedTheme);

    document.addEventListener('click', (event) => {
      if (event.target && event.target.id === 'themeToggle') {
        const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      }
    });
  };

  window.requireAuth = () => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/frontend/pages/login.html';
    }
  };
})();
