window.addEventListener('DOMContentLoaded', () => {
  initCommonUI();

  const userForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const adminForm = document.getElementById('adminForm');

  if (userForm) {
    userForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.target).entries());
      try {
        const response = await api.login(data);
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        window.location.href = '/frontend/index.html';
      } catch (error) {
        alert(error.message);
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.target).entries());
      try {
        const response = await api.signup(data);
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        window.location.href = '/frontend/index.html';
      } catch (error) {
        alert(error.message);
      }
    });
  }

  if (adminForm) {
    adminForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.target).entries());
      try {
        const response = await api.adminLogin(data);
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        window.location.href = '/frontend/pages/admin.html';
      } catch (error) {
        alert(error.message);
      }
    });
  }

  document.querySelectorAll('[data-logout]').forEach((btn) => {
    btn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/frontend/index.html';
    });
  });
});
