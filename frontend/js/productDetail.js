window.addEventListener('DOMContentLoaded', async () => {
  initCommonUI('products');
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const root = document.getElementById('productDetailRoot');

  if (!id) {
    root.innerHTML = '<p>Product not found.</p>';
    return;
  }

  try {
    const product = await api.getProduct(id);
    root.innerHTML = `
      <div class="detail-layout">
        <img src="${product.images?.[0] || 'https://via.placeholder.com/600x700'}" alt="${product.name}" />
        <div>
          <h1>${product.name}</h1>
          <p>${product.description}</p>
          <p><strong>Price:</strong> $${product.price}</p>
          <p><strong>Category:</strong> ${product.category?.name || '-'}</p>
          <button id="addToCartBtn" class="btn">Add to cart</button>
          <button id="wishlistBtn" class="btn secondary">Toggle wishlist</button>
        </div>
      </div>
    `;

    document.getElementById('addToCartBtn').addEventListener('click', async () => {
      try {
        await api.addToCart({ productId: id, quantity: 1 });
        alert(`Added ${product.name} to cart`);
      } catch (error) {
        alert(`${error.message}. Please login first.`);
      }
    });

    document.getElementById('wishlistBtn').addEventListener('click', async () => {
      try {
        const wishlist = await api.toggleWishlist(id);
        const isAdded = wishlist.some((item) => item._id === id);
        alert(isAdded ? `Added ${product.name} to wishlist` : `Removed ${product.name} from wishlist`);
      } catch (error) {
        alert(`${error.message}. Please login first.`);
      }
    });
  } catch (error) {
    root.innerHTML = `<p>${error.message}</p>`;
  }
});
