# Finance Dashboard Backend

A production-grade RESTful API for a finance dashboard system with role-based access control, financial record management, and analytical summaries.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (Access + Refresh Token)
- **Validation:** Joi
- **Security:** bcrypt, helmet, cors, cookie-parser

## Architecture

```
backend/
├── config/
│   └── db.js                  # MongoDB connection
├── controller/
│   ├── auth.controller.js     # Register, Login, Refresh Token
│   ├── record.controller.js   # CRUD for financial records
│   ├── dashboard.controller.js# Aggregation pipelines
│   └── user.controller.js     # Admin user management
├── middlewares/
│   ├── auth.middleware.js     # JWT verification & RBAC guards
│   └── validate.js            # Joi validation middleware
├── models/
│   ├── User.js                # User schema with roles & status
│   └── Record.js              # Financial record schema
├── routes/
│   ├── auth.route.js
│   ├── record.route.js
│   ├── dashboard.route.js
│   └── user.route.js
├── utils/
│   ├── generateToken.js       # JWT token pair generator
│   └── validators.js          # Joi validation schemas
├── server.js                  # Entry point
└── .env                       # Environment variables
```

## Setup & Installation

```bash
git clone <repository-url>
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/Finance-tracker
PORT=3000
JWT_SECRET=your_jwt_secret_key
REFRESH_SECRET=your_refresh_secret_key
NODE_ENV=development
```

Start the server:

```bash
npm run dev
```

## Authentication Strategy

This application implements a **dual-token authentication** system designed to balance security with user experience:

| Token | Storage | Lifetime | Purpose |
|-------|---------|----------|---------|
| Access Token | Client memory (JS variable) | 10 minutes | Authorizes API requests |
| Refresh Token | HttpOnly cookie | 7 days | Silently generates new access tokens |

**Why this approach?**
- Access tokens stored in memory are immune to XSS attacks (unlike localStorage).
- Refresh tokens in HttpOnly cookies are immune to JavaScript-based theft.
- Short-lived access tokens reduce the damage window if somehow compromised.
- Silent refresh on page load provides a seamless UX without re-login.

## Roles & Permissions

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| View records | ✅ | ✅ | ✅ |
| Filter/search records | ✅ | ✅ | ✅ |
| View dashboard analytics | ❌ | ✅ | ✅ |
| Create records | ❌ | ❌ | ✅ |
| Update records | ❌ | ❌ | ✅ |
| Delete records | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| Toggle user active/inactive | ❌ | ❌ | ✅ |

Access control is enforced through two middleware layers:
1. `protect` — Verifies the JWT access token from the Authorization header.
2. `restrictTo(...roles)` — Checks if the authenticated user's role is in the allowed list.

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Create a new user | No |
| POST | `/login` | Login and receive tokens | No |
| POST | `/refresh-token` | Get new access token via cookie | Cookie |

### Records (`/api/records`)

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/` | List records (paginated, filterable) | All |
| POST | `/` | Create a record | Admin |
| PATCH | `/:id` | Update a record | Admin |
| DELETE | `/:id` | Delete a record | Admin |

**Query Parameters for GET /records:**
- `type` — Filter by `income` or `expense`
- `category` — Search by category name (case-insensitive)
- `startDate` / `endDate` — Date range filter
- `page` / `limit` — Pagination (default: page 1, limit 20)

### Dashboard (`/api/dashboard`)

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/summary` | Total income, expense, net balance | Admin, Analyst |
| GET | `/categories` | Category-wise totals | Admin, Analyst |
| GET | `/recent` | Last 10 records | Admin, Analyst |
| GET | `/trends` | Monthly income/expense trends | Admin, Analyst |

### Users (`/api/users`)

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/` | List all users | Admin |
| PATCH | `/:id/role` | Update user role | Admin |
| PATCH | `/:id/status` | Toggle active/inactive | Admin |

## Validation

Input validation is implemented using **Joi** schemas applied as Express middleware. Invalid requests receive a `400` response with detailed error messages:

```json
{
  "message": "Validation failed",
  "errors": [
    "Email is required",
    "Password must be at least 6 characters"
  ]
}
```

Validated endpoints:
- `POST /api/auth/register` — name, email, password, role
- `POST /api/auth/login` — email, password
- `POST /api/records` — amount, type, category, notes, date

## Error Handling

The API uses standard HTTP status codes:

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Resource created |
| 400 | Bad request / Validation error |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (insufficient role or deactivated account) |
| 404 | Resource not found |
| 500 | Internal server error |

## Design Decisions & Assumptions

1. **Roles are set at registration** — In a real system, only admins would assign roles. For demo purposes, users can select their role during registration.
2. **Deactivated users cannot login** — The login endpoint checks `isActive` status before authenticating.
3. **Records are globally visible** — All authenticated users can view all records (not just their own). This simulates a shared finance dashboard for an organization.
4. **MongoDB aggregation pipelines** — Used for dashboard analytics instead of fetching all records and computing on the server, which is more performant at scale.
5. **No email verification** — Skipped for simplicity. Would be added in production.

## Assumptions

- The system represents a single organization's finance dashboard where all users share the same data.
- Category names are free-form strings (not from a predefined list) for flexibility.
- Dates default to the current timestamp if not provided during record creation.
- The refresh token rotation strategy issues a new refresh token on each refresh call.
