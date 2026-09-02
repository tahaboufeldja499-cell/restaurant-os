# Restaurant OS

A premium, multilingual (Arabic / French / English) restaurant ordering system.
Customers scan a QR code or open the site, pick their table, browse the menu, and
send their order — no account, no login. Admins manage everything (orders,
products, categories, tables, and restaurant settings) from a protected dashboard.

## Features

- **No customer accounts.** Table selection → menu → cart → order. That's it.
- **Hidden admin access.** Reached only via *Settings → Admin*, protected by an
  admin code that is checked on the backend and never shipped to the browser.
- **Secure sessions.** Admin sessions use a signed, `HttpOnly`, `SameSite` cookie
  with an expiration; `Secure` is enabled automatically in production.
- **Real backend.** Node.js + Express + SQLite (`better-sqlite3`). The server
  always recomputes order totals from the database — it never trusts prices
  sent by the browser.
- **Full admin dashboard.** Stats, order status workflow (`NEW → PREPARING →
  READY → COMPLETED` / `CANCELLED`), products, categories, tables, and
  restaurant settings (name, logo, phone, address, open/closed).
- **Premium dark UI.** Glassmorphism, gradients, soft shadows, smooth
  animations, toasts, skeleton/empty states — tuned to stay light on mobile.
- **Mobile-first & responsive.** Works cleanly on phones, tablets, and desktop,
  with no horizontal overflow.
- **Arabic (RTL), French, and English**, switchable from *Settings*, saved
  locally in the browser.

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer

## Installation

```bash
npm install
```

## Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Then open `.env` and set real values:

```env
PORT=3000
NODE_ENV=development
ADMIN_CODE=CHANGE_THIS_ADMIN_CODE
SESSION_SECRET=CHANGE_THIS_SESSION_SECRET
SESSION_HOURS=12
```

- **`ADMIN_CODE`** — the code your staff types in the *Settings → Admin* dialog
  to reach the dashboard. Pick something long and hard to guess; it is only
  ever checked on the server.
- **`SESSION_SECRET`** — a long random string used to sign the admin session
  cookie. Generate one, for example:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- Set `NODE_ENV=production` when you deploy behind HTTPS so the session cookie
  is marked `Secure`.

## Run

```bash
npm start
```

Then open:

```
http://localhost:3000
```

The database (`data/restaurant.db`) is created automatically on first run,
along with 12 demo tables, the default categories, and a handful of demo
products — so the app is fully usable right away.

## Changing the admin code later

1. Edit `ADMIN_CODE` in your `.env` file.
2. Restart the server (`npm start`).
3. Existing admin sessions remain valid until they expire (`SESSION_HOURS`);
   new logins immediately require the new code.

## Project structure

```
restaurant-os/
├── package.json
├── server.js            # Express app, API routes, DB setup & seeding
├── .env.example
├── .gitignore
├── README.md
├── public/
│   ├── index.html        # Single-page app shell (customer + admin screens)
│   ├── app.js             # Frontend logic, i18n, cart, admin dashboard
│   └── style.css          # Premium dark glassmorphism UI
└── data/
    └── restaurant.db      # SQLite database (created automatically)
```

## API overview

| Method | Path                          | Description                              |
|--------|-------------------------------|-------------------------------------------|
| GET    | `/api/public`                  | Restaurant info, active tables, categories, available products |
| POST   | `/api/orders`                  | Create an order (server recomputes total) |
| POST   | `/api/admin/login`              | Log in with the admin code |
| POST   | `/api/admin/logout`             | Clear the admin session |
| GET    | `/api/admin/me`                 | Check if the current session is an admin |
| GET    | `/api/admin/stats`              | Dashboard statistics |
| GET    | `/api/admin/orders`             | List all orders with their items |
| PATCH  | `/api/admin/orders/:id`         | Update an order's status |
| GET    | `/api/admin/data`               | All products, categories, tables, settings |
| POST/PUT/DELETE | `/api/admin/products[/:id]` | Manage products |
| POST/PUT/DELETE | `/api/admin/categories[/:id]` | Manage categories |
| POST/PATCH | `/api/admin/tables[/:id]`   | Manage tables |
| PUT    | `/api/admin/settings`            | Update restaurant settings |

All `/api/admin/*` routes (except `login`/`logout`/`me`) require a valid admin
session cookie.

## Security notes

- The real admin code lives only in `.env` and is checked server-side —
  it is never embedded in any JavaScript sent to the browser.
- Admin cookies are `HttpOnly`, `SameSite=Lax`, `Secure` in production, and
  expire after `SESSION_HOURS` hours.
- All admin API routes are protected by session middleware.
- Order totals are always recalculated from the database; the frontend's
  numbers are never trusted.
- All database access uses parameterized (prepared) statements — no raw SQL
  string concatenation, so no SQL injection surface.
- User-supplied text is HTML-escaped before being rendered in the frontend.
- `.env` and the SQLite database file are excluded from Git via `.gitignore`.

## Deploying to production

- Set `NODE_ENV=production` and use strong, unique `ADMIN_CODE` and
  `SESSION_SECRET` values.
- Serve the app behind HTTPS so the `Secure` cookie flag applies.
- Back up `data/restaurant.db` regularly.
