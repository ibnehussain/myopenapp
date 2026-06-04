# ShopEasy — E-Commerce App

A full-stack e-commerce MVP built with a **Flask (Python)** REST API backend and a plain **HTML/CSS/JavaScript** frontend.

---

## Features

- Product listing with category filter (Electronics, Clothing, Books)
- Product detail page
- Persistent cart via `localStorage`
- Mock checkout with order confirmation
- SQLite database (zero-config, file-based)

---

## Project Structure

```
myopenapp/
├── backend/
│   ├── app.py              # Flask entry point
│   ├── database.py         # SQLite schema & connection
│   ├── models.py           # DB helper functions
│   ├── seed.py             # Seed 10 sample products
│   ├── requirements.txt
│   └── routes/
│       ├── products.py     # GET /api/products, GET /api/products/<id>
│       └── orders.py       # POST /api/orders, GET /api/orders/<id>
└── frontend/
    ├── index.html          # Product listing
    ├── product.html        # Product detail
    ├── cart.html           # Cart
    ├── checkout.html       # Checkout & confirmation
    ├── css/style.css
    └── js/
        ├── api.js          # Fetch wrapper
        ├── products.js
        ├── product.js
        ├── cart.js
        └── checkout.js
```

---

## Local Development

### 1. Clone the repo

```bash
git clone https://github.com/ibnehussain/myopenapp.git
cd myopenapp
```

### 2. Set up the backend

```bash
cd backend
pip install -r requirements.txt
python seed.py        # Populates shop.db with 10 sample products
python app.py         # Starts Flask on http://localhost:5000
```

### 3. Open the frontend

Open `frontend/index.html` in your browser (or use the **Live Server** extension in VS Code).

> The frontend talks to `http://localhost:5000` by default. To change this, edit `BASE_URL` in `frontend/js/api.js`.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List all products (optional `?category=Electronics`) |
| `GET` | `/api/products/<id>` | Single product |
| `POST` | `/api/orders` | Place an order |
| `GET` | `/api/orders/<id>` | Order details |
| `GET` | `/api/health` | Health check |

---

## Deploy to Azure

The backend is deployed as an **Azure App Service** (Python web app) and the frontend as an **Azure Static Web App**.

### Prerequisites

- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) installed and logged in  
  ```bash
  az login
  ```
- An active Azure subscription

---

### Step 1 — Create a Resource Group

```bash
az group create \
  --name shopeasy-rg \
  --location eastus
```

---

### Step 2 — Deploy the Backend (Azure App Service)

#### 2a. Create an App Service Plan (Free tier)

```bash
az appservice plan create \
  --name shopeasy-plan \
  --resource-group shopeasy-rg \
  --sku FREE \
  --is-linux
```

#### 2b. Create the Web App

```bash
az webapp create \
  --name shopeasy-api \
  --resource-group shopeasy-rg \
  --plan shopeasy-plan \
  --runtime "PYTHON:3.12"
```

> Replace `shopeasy-api` with a globally unique name.

#### 2c. Add a startup command

```bash
az webapp config set \
  --name shopeasy-api \
  --resource-group shopeasy-rg \
  --startup-file "gunicorn --bind=0.0.0.0 --timeout 600 app:app"
```

#### 2d. Add `gunicorn` to requirements

Add the following line to `backend/requirements.txt`:

```
gunicorn==23.0.0
```

Then commit and push:

```bash
git add backend/requirements.txt
git commit -m "Add gunicorn for Azure App Service"
git push
```

#### 2e. Seed the database on first deploy

Add a startup script `backend/startup.sh`:

```bash
#!/bin/bash
python seed.py
gunicorn --bind=0.0.0.0 --timeout 600 app:app
```

Update the startup command to use the script:

```bash
az webapp config set \
  --name shopeasy-api \
  --resource-group shopeasy-rg \
  --startup-file "bash startup.sh"
```

#### 2f. Deploy from local via ZIP deploy

```bash
cd backend
zip -r ../backend.zip .
az webapp deploy \
  --name shopeasy-api \
  --resource-group shopeasy-rg \
  --src-path ../backend.zip \
  --type zip
```

#### 2g. Note the backend URL

```
https://shopeasy-api.azurewebsites.net
```

Verify: `https://shopeasy-api.azurewebsites.net/api/health` should return `{"status":"ok"}`.

> **SQLite note:** App Service uses ephemeral local storage — the database resets on container restarts. For a persistent production database, migrate to [Azure Database for PostgreSQL](https://learn.microsoft.com/azure/postgresql/) or [Azure SQL](https://learn.microsoft.com/azure/azure-sql/).

---

### Step 3 — Update the Frontend API URL

Edit `frontend/js/api.js` — replace `localhost:5000` with your App Service URL:

```js
const BASE_URL = "https://shopeasy-api.azurewebsites.net";
```

Commit and push:

```bash
git add frontend/js/api.js
git commit -m "Point frontend to Azure App Service URL"
git push
```

---

### Step 4 — Deploy the Frontend (Azure Static Web Apps)

#### Option A — Via Azure CLI

```bash
az staticwebapp create \
  --name shopeasy-frontend \
  --resource-group shopeasy-rg \
  --source https://github.com/ibnehussain/myopenapp \
  --location eastus2 \
  --branch main \
  --app-location "/frontend" \
  --login-with-github
```

Follow the GitHub OAuth prompt to authorize Azure Static Web Apps to connect to your repo. Azure will create a GitHub Actions workflow that auto-deploys on every push to `main`.

#### Option B — Manual ZIP deploy

```bash
cd frontend
zip -r ../frontend.zip .

az staticwebapp create \
  --name shopeasy-frontend \
  --resource-group shopeasy-rg \
  --location eastus2

az staticwebapp deploy \
  --name shopeasy-frontend \
  --resource-group shopeasy-rg \
  --source ../frontend.zip
```

Your frontend will be live at:

```
https://shopeasy-frontend.azurestaticapps.net
```

---

### Step 5 — Configure CORS on the Backend

Allow requests from your Static Web App origin:

```bash
az webapp cors add \
  --name shopeasy-api \
  --resource-group shopeasy-rg \
  --allowed-origins "https://shopeasy-frontend.azurestaticapps.net"
```

---

### Step 6 — Verify End-to-End

1. Open `https://shopeasy-frontend.azurestaticapps.net`
2. Products should load from the Azure backend
3. Add items to cart → proceed to checkout → place order
4. Check `https://shopeasy-api.azurewebsites.net/api/orders/<id>` to confirm the order was saved

---

## Architecture Overview

```
Browser
  │
  ├── Static HTML/CSS/JS ──► Azure Static Web Apps
  │                               (frontend/)
  │
  └── REST API calls ──────► Azure App Service (Python 3.12)
                                  (backend/ — Flask + SQLite)
```

---

## License

MIT
