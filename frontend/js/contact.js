window.addEventListener('DOMContentLoaded', () => {
  initCommonUI('contact');
  document.getElementById('contactForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await api.submitContact(payload);
      alert(response.message);
      event.target.reset();
    } catch (error) {
      alert(error.message);
    }
  });
});
