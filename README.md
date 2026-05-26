# Hadia's Elegant Hijabs — Full-Stack E-commerce Starter

Production-ready starter for a modest fashion brand with vanilla frontend + Node/Express/MongoDB backend.

## Project structure

- `frontend/`
  - `assets/`
  - `components/`
  - `css/`
  - `js/`
  - `pages/`
- `backend/`
  - `src/config`
  - `src/controllers`
  - `src/routes`
  - `src/models`
  - `src/middleware`
  - `src/utils`
  - `src/data`
  - `src/scripts`

## Features implemented

- JWT auth: signup, user login, admin login
- MongoDB models: Users, Products, Orders, Categories, Reviews
- Product CRUD APIs (admin-protected)
- Cart APIs + wishlist + checkout/order creation
- Admin APIs: dashboard stats, order management, user management
- Contact form API
- Responsive frontend: home, products, product detail, cart/checkout, wishlist, about, contact, FAQ, admin
- Search/filter, dark/light mode, social links, WhatsApp floating button, hover/animation effects

## Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

API base URL: `http://localhost:5000/api`

## Frontend setup

Serve repository root with any static server (for example VS Code Live Server) and open:

- `http://localhost:<port>/frontend/index.html`

If backend URL differs, update in browser console once:

```js
localStorage.setItem('apiBaseUrl', 'https://your-backend-domain/api');
location.reload();
```

## Deployment guide

### MongoDB Atlas
1. Create a cluster and user.
2. Whitelist required IP ranges.
3. Copy connection string to `MONGODB_URI`.

### Backend (Render/Railway)
- Deploy `backend` directory as Node service.
- Set env vars from `.env.example`.
- Start command: `npm start`.

### Frontend (Vercel/Netlify)
- Deploy `frontend` directory as static site.
- Ensure backend CORS `FRONTEND_URL` includes the deployed frontend origin.

## API overview

- Auth: `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/admin/login`, `GET /api/auth/me`
- Products: `GET /api/products`, `GET /api/products/:id`, admin `POST/PUT/DELETE /api/products`
- Categories: `GET /api/categories`, admin `POST /api/categories`
- Cart: `GET/POST /api/cart`, `PATCH/DELETE /api/cart/:productId`, `POST /api/cart/wishlist/:productId`
- Orders: `POST /api/orders`, `GET /api/orders/mine`, admin `GET /api/orders`, `PATCH /api/orders/:id/status`
- Admin: `GET /api/admin/stats`, `GET /api/admin/users`, `PATCH /api/admin/users/:id/role`, `DELETE /api/admin/users/:id`
- Contact: `POST /api/contact`
- Reviews: `GET/POST /api/products/:productId/reviews`

## Notes

- Seed script creates sample categories/products and an admin user.
- Use strong credentials for production (`JWT_SECRET`, admin password, database user/password).
