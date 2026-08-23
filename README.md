# Bloom Habit

A lightweight, scalable habit-recovery tracker that helps a user manage and track their journey toward overcoming harmful habits through secure, daily check-ins.

---

## ✨ Overview

Bloom Habit is not a generic to-do app; it's a **personal recovery support tool**. The core mission is to provide a safe, private, and simple space for users to document their journey. Trust and privacy are paramount, as the app is designed to handle sensitive personal disclosures.

The core application loop is intentionally simple:

1.  **Sign Up / Log In:** Securely access your account.
2.  **Daily Check-in:** Write a private, timestamped note about your day.
3.  **Track Progress:** Visualize your consistency and progress over time.
4.

## 🚀 Key Features

- **Secure Accounts:** Standard email/password authentication with hashed passwords.
- **Daily Check-ins:** A simple, free-text note for each day. Entries can be amended.
- **History View:** A chronological list of all past check-in notes.
- **Calendar View:** A monthly grid that visually represents your check-in streak and consistency.
- **Progress Indicators:** At-a-glance stats like current streak, total days, and month-completion percentage.

## 🏗️ Architecture

The project is built as a **modular monolith** with a decoupled frontend and backend. This approach allows for rapid development and easy deployment while keeping the system structured for future scalability. Microservices were intentionally avoided to reduce complexity at this early stage.

```
┌─────────────────────┐
│   React SPA (Vite)  │  ← Frontend
└──────────┬──────────┘
           │ HTTPS / JSON (REST)
┌──────────▼───────────┐
│  Node.js + Express   │  ← Backend API
│  - Auth module       │
│  - Check-ins module  │
│  - Users module      │
└──────────┬───────────┘
           │ Prisma ORM
┌──────────▼───────────┐
│   PostgreSQL         │  ← Persistent storage
└──────────────────────┘
```

### Key Decisions

- **Separate Codebases:** The frontend (React) and backend (Node.js) are in separate packages from day one, making future scaling and deployment straightforward.
- **Stateless API:** The backend API uses JSON Web Tokens (JWTs) for authentication, ensuring it is stateless and can be scaled horizontally without managing session affinity.
- **Relational Database:** PostgreSQL was chosen for its data integrity, relational structure, and robust constraints, which are critical for reliably storing user recovery data.

## 🚦 API Endpoints

Here is a summary of the core API endpoints. All authenticated routes are protected and require a valid JWT sent via an `httpOnly` cookie.

| Method             | Endpoint               | Description                                                      | Auth Required |
| :----------------- | :--------------------- | :--------------------------------------------------------------- | :-----------: |
| **Authentication** |                        |                                                                  |               |
| `POST`             | `/api/auth/register`   | Creates a new user account.                                      |     ❌ No     |
| `POST`             | `/api/auth/login`      | Authenticates a user and returns a JWT cookie.                   |     ❌ No     |
| `POST`             | `/api/auth/logout`     | Clears the user's session cookie.                                |    ✅ Yes     |
| **User**           |                        |                                                                  |               |
| `GET`              | `/api/users/me`        | Retrieves the profile and progress stats for the logged-in user. |    ✅ Yes     |
| **Check-ins**      |                        |                                                                  |               |
| `POST`             | `/api/check-ins`       | Creates a new daily check-in for the logged-in user.             |    ✅ Yes     |
| `GET`              | `/api/check-ins`       | Retrieves a list of all check-ins for the user.                  |    ✅ Yes     |
| `GET`              | `/api/check-ins/:date` | Retrieves a single check-in by its date (`YYYY-MM-DD`).          |    ✅ Yes     |
| `PUT`              | `/api/check-ins/:date` | Updates an existing check-in by its date.                        |    ✅ Yes     |

## 🛠️ Tech Stack

| Layer              | Choice                               | Why                                                                          |
| ------------------ | ------------------------------------ | ---------------------------------------------------------------------------- |
| **Frontend**       | React (Vite) + Tailwind CSS          | Fast dev loop, huge ecosystem, and rapid styling.                            |
| **Backend**        | Node.js + Express                    | Minimal boilerplate and easy to reason about for a prototype.                |
| **ORM**            | Prisma                               | Type-safe queries, painless migrations, and scales well with the schema.     |
| **Database**       | PostgreSQL (hosted via Supabase)     | Relational integrity, generous free tiers, and an easy managed upgrade path. |
| **Authentication** | JWT (httpOnly cookies) + bcrypt      | Stateless, secure, and standard; avoids storing plaintext passwords.         |
| **Hosting**        | Vercel (Frontend) + Render (Backend) | Fast to deploy, minimal ops overhead, and cost-effective for starting out.   |
| **Testing**        | Jest + Supertest                     | Standard for JavaScript, covering auth and core logic.                       |

## 🔒 Security Considerations

Given the sensitive nature of the data, security is a top priority.

- **Encryption:** All traffic is served over HTTPS. Check-in notes are encrypted at rest in the database.
- **Password Security:** Passwords are never stored in plaintext. They are hashed using `bcrypt`.
- **Session Management:** JWTs are stored in `httpOnly` cookies to mitigate XSS (Cross-Site Scripting) risks. `localStorage` is not used for tokens.
- **Rate Limiting:** Authentication routes are rate-limited to prevent brute-force attacks.

## 🏁 Getting Started

Follow these instructions to get the project running locally for development and testing.

### Prerequisites

- Node.js (v20.x or later recommended)
- pnpm
- Git

### 1. Clone the Repository

```bash
git clone <https://github.com/your-username/bloom-habit.git>
cd bloom-habit
```

### 2. Install Dependencies

Install all dependencies for the frontend and backend from the root of the monorepo.

```bash
pnpm install
```

### 3. Configure Environment Variables

The project uses environment variables for configuration. You'll need to create a `.env` file in both the backend and frontend packages.

**Backend (`/packages/api/.env`)**

```env
# Example .env for the backend

# The connection string for your PostgreSQL database.
# Example for a local Supabase instance:
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/postgres"

# A strong, random secret for signing JWTs.
JWT_SECRET="your-super-secret-jwt-key"

# The port the API server will run on.
PORT=3001
```

**Frontend (`/packages/web/.env.local`)**

```env
# Example .env.local for the frontend

# The URL of the backend API.
VITE_API_BASE_URL="http://localhost:3001"
```

### 4. Set Up the Database

Run the Prisma migrations to set up your database schema.

```bash
pnpm --filter api prisma migrate dev
```

### 5. Run the Application

You can run both the frontend and backend concurrently from the root directory.

```bash
# Start the backend API server (e.g., on http://localhost:3001)
pnpm --filter api dev

# In a separate terminal, start the frontend dev server (e.g., on http://localhost:5173)
pnpm --filter web dev
```

The React application should now be running and connected to your local API server.

## 🚀 Deployment

The project is configured for easy deployment to modern hosting platforms:

- **Frontend:** The React SPA can be deployed as a static site to **Vercel**.
- **Backend:** The Node.js/Express API can be deployed as a web service to **Render**.
- **Database:** **Supabase** is recommended for a hosted PostgreSQL database.

Ensure that the appropriate environment variables are configured in the respective hosting provider's dashboard.

## 🤝 Contributing

Contributions are welcome! Please open an issue to discuss a new feature or bug fix before submitting a pull request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
