(function () {
  const token = () => localStorage.getItem('token');

  const request = async (path, options = {}) => {
    const response = await fetch(`${window.APP_CONFIG.API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token() ? { Authorization: 'Bearer ' + token() } : {}),
        ...(options.headers || {})
      },
      ...options
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  };

  window.api = {
    request,
    getProducts: (query = '') => request(`/products${query}`),
    getProduct: (id) => request(`/products/${id}`),
    getCategories: () => request('/categories'),
    login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    signup: (payload) => request('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
    adminLogin: (payload) => request('/auth/admin/login', { method: 'POST', body: JSON.stringify(payload) }),
    getMe: () => request('/auth/me'),
    getCart: () => request('/cart'),
    addToCart: (payload) => request('/cart', { method: 'POST', body: JSON.stringify(payload) }),
    updateCartItem: (productId, quantity) => request(`/cart/${productId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
    removeCartItem: (productId) => request(`/cart/${productId}`, { method: 'DELETE' }),
    toggleWishlist: (productId) => request(`/cart/wishlist/${productId}`, { method: 'POST' }),
    submitOrder: (payload) => request('/orders', { method: 'POST', body: JSON.stringify(payload) }),
    submitContact: (payload) => request('/contact', { method: 'POST', body: JSON.stringify(payload) }),
    getStats: () => request('/admin/stats'),
    getOrders: () => request('/orders')
  };
})();
