window.addEventListener('DOMContentLoaded', async () => {
  initCommonUI('admin');
  requireAuth();
  if (localStorage.getItem('role') !== 'admin') {
    document.getElementById('adminRoot').innerHTML = '<p>Admin access only.</p>';
    return;
  }

  try {
    const [stats, orders] = await Promise.all([api.getStats(), api.getOrders()]);
    document.getElementById('statsRoot').innerHTML = `
      <div class="stats-grid">
        <article class="card"><h3>Users</h3><p>${stats.users}</p></article>
        <article class="card"><h3>Products</h3><p>${stats.products}</p></article>
        <article class="card"><h3>Orders</h3><p>${stats.orders}</p></article>
        <article class="card"><h3>Revenue</h3><p>$${stats.revenue.toFixed(2)}</p></article>
      </div>
    `;

    document.getElementById('ordersRoot').innerHTML = orders
      .map(
        (order) => `
      <article class="card">
        <h4>Order #${order._id.slice(-6).toUpperCase()}</h4>
        <p>${order.items.length} item(s) • ${order.status}</p>
        <p>Total: $${order.total}</p>
      </article>`
      )
      .join('');
  } catch (error) {
    document.getElementById('adminRoot').innerHTML = `<p>${error.message}</p>`;
  }
});
