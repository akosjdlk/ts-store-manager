# ts-store-manager

A small TypeScript frontend for managing a simple store (products, sales).

**Features**
- Simple product and sales management UI (sales, checkout, stockup)
- Backend API emulated with `json-server` using `db.local.json`
- Built with TypeScript and Vite, lightweight components under `src/components`

**Tech**
- TypeScript, Vite
- `json-server` for a local REST API
- Tailwind / Flowbite for styles and UI bits

**Quick Start**

Prerequisites: Node.js (16+), npm

1. Install dependencies

```bash
npm install
```

2. Prepare the local DB

On Linux/macOS:

```bash
npm run migrate-db-unix
```

On Windows (PowerShell/CMD):

```bash
npm run migrate-db
```

`migrate-db` copies `db.json` → `db.local.json` which the local API serves.

3. Start the dev environment (Vite + json-server)

```bash
npm run dev
```

- The frontend will be served by Vite on port 8000.
- The fake REST API is available on port 8080 by `json-server` (host 0.0.0.0).

**Scripts**
- `npm run dev` — run Vite and `json-server` concurrently
- `npm run vite` — run only Vite
- `npm run json-server` — run only `json-server`
- `npm run build` — TypeScript compile + Vite build
- `npm run lint` — run ESLint and auto-fix issues

**Project Structure**

- `index.html` — simple entry page; `test.html` and other pages are in `pages/`
- `db.json` — canonical fixtures for the fake API
- `db.local.json` — local copy used by `json-server` (generated via migrate script)
- `src/main.ts` — app entry
- `src/api/` — small API wrappers used by the UI
	- `products.ts` — product-related API calls
	- `sales.ts` — sales-related API calls
- `src/components/` — UI components for the different pages
	- `checkout.ts`, `sales.ts`, `stockup.ts`, `backend_data.ts`, `backend_charts.ts`
- `src/styles/style.css` — base styles
- `test.ts` — small test/experiment file

**Pages**
- `pages/checkout.html` — checkout UI
- `pages/sales.html` — sales listing
- `pages/stockup.html` — stock management
- `pages/backend_data.html` — raw data view
- `pages/backend_charts.html` — charts (backend analytics)

**API & Data**

The project uses `json-server` to expose `db.local.json` as a REST API. Common endpoints (depending on `db.json` shape):

- `GET /products` — list products
- `GET /sales` — list sales
- `POST /sales` — add a sale

Check `src/api/products.ts` and `src/api/sales.ts` for the client wrappers used by the UI.

**Development Notes**
- If you change `db.json`, run the migrate script to copy it to `db.local.json` before restarting `json-server`.
- Use `npm run dev-lint` to run linting before development.
