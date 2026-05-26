window.addEventListener('DOMContentLoaded', async () => {
  initCommonUI('wishlist');
  requireAuth();
  const root = document.getElementById('wishlistRoot');

  try {
    const user = await api.getMe();
    root.innerHTML = user.wishlist.length
      ? user.wishlist
          .map(
            (product) => `
      <article class="card">
        <img src="${product.images?.[0] || 'https://via.placeholder.com/600x700'}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <a class="btn" href="/frontend/pages/product.html?id=${product._id}">View</a>
      </article>`
          )
          .join('')
      : '<p>Your wishlist is empty.</p>';
  } catch (error) {
    root.innerHTML = `<p>${error.message}</p>`;
  }
});
