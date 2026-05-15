# Smart Inventory AI – Backend

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)
![Express](https://img.shields.io/badge/Express.js-REST_API-black)
![Status](https://img.shields.io/badge/status-active-success)

Production-style inventory management backend built with Node.js, Express, and PostgreSQL.

---

# 🎯 Project Goal

The goal of this project is to build a scalable and production-style backend system for inventory management.

The project focuses on:

- REST API architecture
- authentication & security
- PostgreSQL relational database design
- validation & normalization
- modular backend structure
- real-world backend practices

This backend simulates how modern inventory systems are built in real production environments.

---

# 🚀 Features

## 🔐 Authentication

- JWT Authentication
- Access Token + Refresh Token
- HTTP-only refresh token cookies
- Refresh token hashing in database
- Password hashing with bcrypt
- Protected routes using middleware

---

## 📦 Inventory Management

### Items

- Full CRUD operations
- Advanced item search
- Pagination
- Sorting
- Filtering
- Stock status system
- Supplier & category relations

### Stock Status Logic

Items automatically receive stock status:

| Status | Meaning                  |
| ------ | ------------------------ |
| out    | quantity = 0             |
| low    | quantity <= min_quantity |
| ok     | quantity > min_quantity  |
| na     | min_quantity = 0         |

---

## 👥 Contacts

- Full CRUD
- Advanced search
- Filtering by:
  - role
  - phone
  - email
- Pagination & sorting

---

## 🏢 Suppliers

- User suppliers
- Default suppliers
- Contact relations
- Address normalization

---

## 📂 Categories

- User categories
- Default categories
- Auto-copy default categories during registration

---

## 🛠 Backend Features

- RESTful API
- PostgreSQL relational database
- Parameterized SQL queries
- Error handling
- Input validation
- Data normalization
- Multi-user architecture
- Protected routes
- Modular project structure

---

# 🛠 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JavaScript (ES Modules)
- bcrypt
- JWT
- cookie-parser
- dotenv

---

# 🧱 Architecture

The project follows modular backend architecture.

## Structure

```bash
controllers/        -> business logic
routes/             -> API routes
middleware/         -> JWT/auth/logger middleware
utils/validators/   -> validation & normalization
config/             -> CORS & config
db.js               -> PostgreSQL connection
```

## Request Flow

Request
↓
Route
↓
Middleware
↓
Controller
↓
Validation / Normalization
↓
Database
↓
Response

---

## 📡 Main API Endpoints

🔐 Auth

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| POST   | `/api/register`     | Register user        |
| POST   | `/api/auth/login`   | Login                |
| GET    | `/api/auth/refresh` | Refresh access token |
| POST   | `/api/auth/logout`  | Logout               |

---

## 📦 Items

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/api/items`        | Get all items        |
| GET    | `/api/items/search` | Advanced item search |
| POST   | `/api/items`        | Create item          |
| PATCH  | `/api/items/:id`    | Update item          |
| DELETE | `/api/items/:id`    | Delete item          |

---

## 👥 Contacts

| Method | Endpoint               | Description      |
| ------ | ---------------------- | ---------------- |
| GET    | `/api/contacts`        | Get all contacts |
| GET    | `/api/contacts/search` | Search contacts  |
| POST   | `/api/contacts`        | Create contact   |
| PATCH  | `/api/contacts/:id`    | Update contact   |
| DELETE | `/api/contacts/:id`    | Delete contact   |

## 🏢 Suppliers

| Method | Endpoint             | Description     |
| ------ | -------------------- | --------------- |
| GET    | `/api/suppliers`     | Get suppliers   |
| POST   | `/api/suppliers`     | Create supplier |
| PATCH  | `/api/suppliers/:id` | Update supplier |
| DELETE | `/api/suppliers/:id` | Delete supplier |

---

## 📂 Categories

| Method | Endpoint              | Description     |
| ------ | --------------------- | --------------- |
| GET    | `/api/categories`     | Get categories  |
| POST   | `/api/categories`     | Create category |
| PATCH  | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

---

## 🔄 Data Processing

The backend validates and normalizes data before database operations.

Examples:

phone normalization
trimming whitespace
converting numeric values
email normalization
validation of IDs & required fields

---

## 🗄 Database

PostgreSQL relational database.

Main Relations
users
├── categories
├── contacts
├── suppliers
└── items

suppliers
└── contacts

items
├── suppliers
└── categories

---

## ⚙️ Environment Variables

Create .env file:
PORT=5000

PG_USER=postgres
PG_PASSWORD=yourpassword
PG_HOST=127.0.0.1
PG_DATABASE=inventory_ai
PG_PORT=5432

ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
NODE_ENV=development

---

## 🧪 Running the Project

Install dependencies
npm install
Start development server

## npm run dev

## 🗄 Database Setup

Create database:

createdb inventory_ai

Import schema:
psql -U postgres -d inventory_ai < schema.sql

Import dump (optional):
psql -U postgres -d inventory_ai < dump.sql

Seed default suppliers:
psql -U postgres -d inventory_ai < seeds/suppliers_default.sql

Seed default categories:
psql -U postgres -d inventory_ai < seeds/categories_default.sql

---

## 🧪 API Testing

The project contains a custom API testing tool:
python3 mini_postman.py requests/items/get_items.json

Available request collections:
requests/auth/
requests/items/
requests/contacts/
requests/suppliers/
requests/categories/

---

## 🌱 Future Improvements

Swagger / OpenAPI documentation
Docker support
Automated tests
React frontend
RBAC permissions system
Warehouse locations module
Activity logs
Inventory analytics

---

## 👨‍💻 Author

Marcin Czapla

Backend Developer focused on:

Node.js
PostgreSQL
REST API architecture
Backend systems
Inventory systems

---

## 📌 Status

Core backend functionality completed.

Project actively developed and expanded with new modules.
