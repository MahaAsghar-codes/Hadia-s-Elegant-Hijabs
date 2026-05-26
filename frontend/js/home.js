window.addEventListener('DOMContentLoaded', async () => {
  initCommonUI('home');
  const productsRoot = document.getElementById('featuredProducts');
  const categoriesRoot = document.getElementById('categoriesRoot');

  try {
    const [products, categories] = await Promise.all([
      api.getProducts('?featured=true'),
      api.getCategories()
    ]);

    productsRoot.innerHTML = products
      .slice(0, 4)
      .map(
        (product) => `
      <article class="card fade-in">
        <img src="${product.images?.[0] || 'https://via.placeholder.com/600x700'}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <a class="btn" href="/frontend/pages/product.html?id=${product._id}">View</a>
      </article>`
      )
      .join('');

    categoriesRoot.innerHTML = categories
      .map(
        (cat) => `
      <a class="category-pill" href="/frontend/pages/products.html?category=${cat._id}">${cat.name}</a>`
      )
      .join('');
  } catch (error) {
    productsRoot.innerHTML = `<p>${error.message}</p>`;
  }
});
