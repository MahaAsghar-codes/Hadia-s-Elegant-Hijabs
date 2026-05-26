window.addEventListener('DOMContentLoaded', async () => {
  initCommonUI('cart');
  requireAuth();
  const list = document.getElementById('cartItems');
  const subtotalRoot = document.getElementById('subtotal');

  const render = async () => {
    const cart = await api.getCart();
    let subtotal = 0;

    list.innerHTML = cart
      .map((item) => {
        subtotal += item.product.price * item.quantity;
        return `
          <article class="cart-item">
            <img src="${item.product.images?.[0] || 'https://via.placeholder.com/200'}" alt="${item.product.name}" />
            <div>
              <h4>${item.product.name}</h4>
              <p>$${item.product.price} x ${item.quantity}</p>
              <div class="card-actions">
                <button class="btn secondary" data-minus="${item.product._id}">-</button>
                <button class="btn secondary" data-plus="${item.product._id}">+</button>
                <button class="btn secondary" data-remove="${item.product._id}">Remove</button>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    subtotalRoot.textContent = `$${subtotal.toFixed(2)}`;
  };

  try {
    await render();
  } catch (error) {
    list.innerHTML = `<p>${error.message}</p>`;
  }

  list.addEventListener('click', async (event) => {
    const { minus, plus, remove } = event.target.dataset;
    if (!(minus || plus || remove)) return;

    const cart = await api.getCart();
    const item = cart.find((entry) => entry.product._id === (minus || plus || remove));
    if (!item) return;

    try {
      if (remove) await api.removeCartItem(remove);
      if (minus) await api.updateCartItem(minus, Math.max(1, item.quantity - 1));
      if (plus) await api.updateCartItem(plus, item.quantity + 1);
      await render();
    } catch (error) {
      alert(error.message);
    }
  });

  document.getElementById('checkoutForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = {
      shippingAddress: {
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
        city: formData.get('city'),
        addressLine: formData.get('addressLine')
      },
      paymentMethod: formData.get('paymentMethod'),
      shippingFee: 3
    };

    try {
      await api.submitOrder(payload);
      alert('Order placed successfully!');
      await render();
      event.target.reset();
    } catch (error) {
      alert(error.message);
    }
  });
});
