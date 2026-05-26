window.addEventListener('DOMContentLoaded', async () => {
  initCommonUI('products');
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category') || '';
  const list = document.getElementById('productList');
  const searchInput = document.getElementById('searchInput');
  const categorySelect = document.getElementById('categorySelect');

  const renderProducts = async () => {
    const query = new URLSearchParams();
    if (searchInput.value.trim()) query.set('search', searchInput.value.trim());
    if (categorySelect.value) query.set('category', categorySelect.value);

    const products = await api.getProducts(`?${query.toString()}`);
    list.innerHTML = products
      .map(
        (product) => `
        <article class="card">
          <img src="${product.images?.[0] || 'https://via.placeholder.com/600x700'}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
          <div class="card-actions">
            <a class="btn" href="/frontend/pages/product.html?id=${product._id}">Details</a>
            <button class="btn secondary" data-add="${product._id}" data-name="${product.name}">Add to cart</button>
          </div>
        </article>
      `
      )
      .join('');
  };

  try {
    const categories = await api.getCategories();
    categorySelect.innerHTML = ['<option value="">All categories</option>']
      .concat(
        categories.map(
          (item) => `<option value="${item._id}" ${category === item._id ? 'selected' : ''}>${item.name}</option>`
        )
      )
      .join('');

    await renderProducts();
  } catch (error) {
    list.innerHTML = `<p>${error.message}</p>`;
  }

  document.getElementById('filterForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await renderProducts();
  });

  list.addEventListener('click', async (event) => {
    const id = event.target.dataset.add;
    if (!id) return;
    const productName = event.target.dataset.name || 'item';
    try {
      await api.addToCart({ productId: id, quantity: 1 });
      alert(`Added ${productName} to cart`);
    } catch (error) {
      alert(`${error.message}. Please login first.`);
    }
  });
});
