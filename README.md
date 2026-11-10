# Ecom

A full-stack e-commerce demo with a React storefront, product catalog, shopping cart, login and registration, and a product administration screen. The frontend is built with Vite and Tailwind CSS; the API uses Express and MongoDB.

## Features

- Browse products and open product detail pages.
- Add products to a shopping cart, adjust quantities, and remove items.
- Register and log in with email and password.
- View a profile and log out.
- View and manage products from the admin screen.
- Use short-lived access tokens with refresh-token renewal.

## Tech stack

- **Frontend:** React, Vite, React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** bcrypt, JWT access and refresh tokens, HTTP-only refresh cookie

## Project structure

```text
Ecom/
├── backend/
│   ├── server.js
│   └── src/
│       ├── config/       # MongoDB connection
│       ├── middlewares/  # JWT authentication
│       ├── model/        # User and product models
│       └── routes/       # Authentication and product APIs
├── src/
│   ├── api/              # Axios client and API helpers
│   ├── admin/            # Product and user admin interface
│   ├── component/        # Shared UI, navigation, product cards
│   ├── Layouts/          # Storefront layout and cart state
│   ├── pages/            # Store, product, account pages
│   └── Routes/           # Frontend route definitions
└── index.html
```

## Requirements

- Node.js and npm
- MongoDB connection string (local MongoDB or hosted)

## Getting started

### 1. Configure the backend

Create `backend/.env`:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/ecom
JWT_SECRET=replace-with-a-long-random-secret
REFRESH_SECRET=use-a-different-long-random-secret
```

Use different, private random values for the JWT secrets. Do not commit `.env` files.

The frontend Axios client reads its API base URL from `VITE_API_URL`, falling back to `http://localhost:3000`. Copy `.env.example` to `.env.local` for local development and set the URL if your backend uses a different port. Vite embeds this value at build time, so set `VITE_API_URL` in the frontend hosting provider before building/deploying. `FRONTEND_URL` must match the browser origin used by Vite.

### 2. Install dependencies

From the project root:

```bash
npm install
cd backend
npm install
```

### 3. Start the API and frontend

Run each command in a separate terminal, from the project root:

```bash
cd backend
npm run dev
```

```bash
npm run dev
```

Vite prints the frontend URL when it starts (normally `http://localhost:5173`). The backend connects to MongoDB when it starts.

## Available scripts

Run frontend scripts from the project root:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production frontend build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

Run the backend from `backend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |

## Routes

### Frontend

| Path | Page |
| --- | --- |
| `/` | Storefront and product catalog |
| `/products/:id` | Product details |
| `/about` | About page |
| `/login` | Login |
| `/register` | Registration |
| `/profile` | Profile (requires an access-token value in local storage) |
| `/admin` | Admin interface (requires an access-token value in local storage) |

### API

All API routes are prefixed with `/api`.

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| `GET` | `/api/products` | List products | No |
| `GET` | `/api/products/:id` | Get a product | No |
| `POST` | `/api/products` | Create a product | Access token |
| `PUT` | `/api/products/:id` | Update a product | Access token |
| `DELETE` | `/api/products/:id` | Delete a product | Access token |
| `POST` | `/api/auth/register` | Register a user | No |
| `POST` | `/api/auth/login` | Log in and issue tokens | No |
| `GET` | `/api/auth/me` | Get the authenticated user | Access token |
| `GET` | `/api/auth/users` | List users | No |
| `POST` | `/api/auth/refresh-token` | Exchange refresh cookie for an access token | Refresh cookie |
| `POST` | `/api/auth/logout` | Clear the refresh cookie and revoke its stored token | No |

Product records include a title, price, description, category, image URL, rating, stock, and status.

## Authentication notes

- Access tokens expire after **15 minutes**; refresh tokens expire after **7 days**.
- The frontend stores the access token in `localStorage` and sends it in the `Authorization` request header.
- The refresh token is stored in an HTTP-only cookie. On an authenticated API request that receives a 401, the Axios interceptor attempts a refresh and retries the original request once.
- If refresh fails because the refresh token is missing, expired, or invalid, the client clears the saved user and access token and redirects to `/login`.
- The route guard currently checks that an access-token value exists; it does not independently validate its expiration before rendering a protected page.

## Current limitations

- The cart is held in frontend memory. It is not persisted between reloads and there is no checkout or payment flow.
- The admin page is protected by token presence, but there is no role-based authorization. Product write APIs require any valid access token.
- Product images are represented by URLs; an image-upload flow is not connected.
