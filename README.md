# Hadia's Elegant Hijabs - Full-Stack E-commerce

Production-ready full-stack e-commerce platform for **Hadia's Elegant Hijabs**.

## Tech Stack
- Frontend: HTML5, CSS3, Vanilla JavaScript
- Backend: Node.js + Express.js
- Database: MongoDB (Atlas-ready)
- Authentication: JWT + role-based access (user/admin)

## Structure

```
backend/
  config controllers middleware models routes utils
frontend/
  assets components css js pages
```

## Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Add environment values:
   ```bash
   cp .env.example .env
   ```
   - Set a strong `ADMIN_PASSWORD` before running seed.
3. Start app:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5000`

## Seed Sample Data
```bash
npm run seed
```

## Deployment

### Backend (Render or Railway)
- Set root to repository root
- Build command: `npm install`
- Start command: `npm start`
- Add env vars from `.env.example`

### Frontend (Vercel/Netlify)
- This project serves frontend from Express static hosting.
- If deploying frontend separately, host `frontend/` and set `window.API_BASE_URL` in `frontend/js/config.js`.
- Set your business WhatsApp number in `frontend/js/config.js` (`window.WHATSAPP_NUMBER`).

### MongoDB Atlas
- Create cluster, DB user, and network access rule
- Copy connection URI into `MONGODB_URI`

## Features
- Responsive homepage with hero, categories, featured products, FAQ, dark mode
- Products listing/detail with search + filters
- Wishlist + cart + checkout UI
- JWT auth (signup/login)
- Admin login and admin dashboard APIs
- Product CRUD, cart APIs, order APIs, contact API
