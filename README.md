# Finance Data Processing and Access Control Backend

A full-stack finance dashboard system built with **Node.js, Express, MongoDB** (backend) and **React + Vite + Tailwind** (frontend), featuring role-based access control, JWT authentication, and MongoDB aggregation-powered analytics.

## Project Structure

```
AssignmentInterviwe/
├── backend/               # Node.js + Express REST API
│   ├── config/            # Database connection
│   ├── controller/        # Business logic (auth, records, dashboard, users)
│   ├── middlewares/       # JWT auth guard, RBAC, Joi validation
│   ├── models/            # Mongoose schemas (User, Record)
│   ├── routes/            # Express route definitions
│   ├── utils/             # Token generator, validation schemas
│   ├── server.js          # Entry point
│   └── README.md          # Detailed API documentation
├── frontend/              # React + Vite + Tailwind (Bonus)
│   ├── src/
│   │   ├── components/    # Layout, ProtectedRoute
│   │   ├── context/       # AuthContext (in-memory token management)
│   │   ├── pages/         # Login, Register, Dashboard, Records
│   │   └── utils/         # Axios interceptor configuration
│   └── ...
└── README.md              # This file
```

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/Finance-tracker
PORT=3000
JWT_SECRET=your_jwt_secret_key
REFRESH_SECRET=your_refresh_secret_key
NODE_ENV=development
```

```bash
npm run dev
```

Server runs at `http://localhost:3000`

### Frontend Setup (Optional)

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Core Features

### 1. User & Role Management
- Three roles: **Viewer**, **Analyst**, **Admin**
- Admin can list all users, update roles, and toggle active/inactive status
- Deactivated users are blocked from logging in

### 2. Financial Records (CRUD)
- Create, Read, Update, Delete financial entries
- Filter by type (income/expense), category (case-insensitive search), and date range
- Paginated responses (`?page=1&limit=20`)
- Only Admins can create, update, or delete records

### 3. Dashboard Analytics (MongoDB Aggregation)
- **Summary**: Total income, total expense, net balance
- **Category-wise totals**: Grouped by type and category
- **Recent activity**: Last 10 records with user info
- **Monthly trends**: Income/expense grouped by month and year
- Accessible to Admin and Analyst roles only

### 4. Access Control (RBAC)
Enforced via two Express middlewares:
- `protect` — Verifies JWT access token from the `Authorization: Bearer <token>` header
- `restrictTo(...roles)` — Checks if the user's role is authorized for the endpoint

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| View records | ✅ | ✅ | ✅ |
| View dashboard | ❌ | ✅ | ✅ |
| Create/Update/Delete records | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

### 5. Validation & Error Handling
- **Joi** schemas validate all input (register, login, record creation)
- Proper HTTP status codes (400, 401, 403, 404, 500)
- Custom error messages for every failure case

### 6. Data Persistence
- **MongoDB Atlas** with Mongoose ODM
- Schemas include timestamps, references (Record → User), and enum validations

## Authentication Strategy

| Token | Where | Lifetime | Purpose |
|-------|-------|----------|---------|
| Access Token | Client JS memory | 10 min | API authorization |
| Refresh Token | HttpOnly cookie | 7 days | Silent token renewal |

- Access token is **never stored in localStorage** (XSS protection)
- Refresh token is in an **HttpOnly, Secure, SameSite cookie** (CSRF protection)
- On page reload, the frontend silently hits `/api/auth/refresh-token` to restore the session

## API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a user | Public |
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/refresh-token` | Refresh access token | Cookie |
| GET | `/api/records` | List records (paginated) | All roles |
| POST | `/api/records` | Create a record | Admin |
| PATCH | `/api/records/:id` | Update a record | Admin |
| DELETE | `/api/records/:id` | Delete a record | Admin |
| GET | `/api/dashboard/summary` | Income/Expense/Balance | Admin, Analyst |
| GET | `/api/dashboard/categories` | Category-wise breakdown | Admin, Analyst |
| GET | `/api/dashboard/recent` | Last 10 records | Admin, Analyst |
| GET | `/api/dashboard/trends` | Monthly trends | Admin, Analyst |
| GET | `/api/users` | List all users | Admin |
| PATCH | `/api/users/:id/role` | Update user role | Admin |
| PATCH | `/api/users/:id/status` | Toggle active/inactive | Admin |

> For detailed request/response examples, see [`backend/README.md`](./backend/README.md)

## Design Decisions & Assumptions

1. **Dual-token auth** was chosen over session-based auth for stateless scalability and enhanced security.
2. **Roles are user-selectable at registration** for demo purposes. In production, only admins would assign roles.
3. **All records are globally visible** to simulate a shared organizational dashboard.
4. **MongoDB aggregation pipelines** are used for dashboard analytics instead of client-side computation for better performance at scale.
5. **Category names are free-form** strings for flexibility (not from a predefined list).
6. **Frontend is a bonus addition** — the assignment focused on backend, but a React dashboard was built to demonstrate full-stack integration.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (jsonwebtoken, bcrypt) |
| Validation | Joi |
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Charts | Recharts |

## Author

**Rudra Gajjar**
rudragajjar744@gmail.com
