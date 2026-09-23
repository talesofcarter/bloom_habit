# Bloom Habit

A lightweight habit-recovery tracker that helps a user manage and track their journey toward overcoming harmful habits through secure, daily check-ins.

---

## Overview

Bloom Habit is not a generic to-do app. It is a personal recovery support tool. The core mission is to provide a safe, private, and simple space for users to document their journey. Trust and privacy are paramount, as the app is designed to handle sensitive personal disclosures.

The core application loop is intentionally simple:

1. **Sign Up / Log In:** Securely access your account.
2. **Daily Check-in:** Write a private, timestamped note about your day, and mark whether it was a setback.
3. **Track Progress:** Visualize your consistency, streaks, and milestones over time.
4. **Reflect:** Read a daily Bible verse selected around themes of grace, love, and freedom from sin.

## Key Features

- **Secure Accounts:** Email/password authentication with hashed passwords and an httpOnly JWT session cookie.
- **Daily Check-ins:** A simple, titled, free-text note for each day, with an optional "setback" flag.
- **Backfill Any Date:** Click any past date on the calendar grid to add or edit a check-in for that day, whether or not you already logged one. This makes it easy to catch up after forgetting to check in.
- **Inline History Editing:** Edit the title and note of any past entry directly from the timeline view.
- **Calendar View:** A monthly grid that visually marks which days have a check-in, and flags setbacks separately from clean days.
- **Streaks and Milestones:** Current streak, lifetime totals, and a growing list of milestone badges (from a first check-in through a full year), unlocked automatically as the streak grows.
- **Weekly Insights:** A comparison of this week's check-ins against last week's, the best streak achieved so far, and days since the last setback.
- **Daily Verse:** A Bible verse generated per day (Amplified and NIV translations), cached client-side for 24 hours, with a small archive of past verses.
- **Account Settings:** Update your password or permanently delete your account and all associated data.

## Architecture

The project is a monorepo with two apps that talk to each other over a REST API:

- **`apps/web`**: A React 19 single-page app built with Vite and styled with Tailwind CSS v4. It handles routing, authentication state, and all UI.
- **`apps/api`**: A Node.js and Express API that owns authentication, check-ins, users, and the daily verse. It talks to PostgreSQL through Prisma.
- **PostgreSQL**: The single source of truth for users, check-ins, and verses, accessed exclusively through Prisma's generated client.

Requests flow from the React app to the Express API over HTTPS and JSON, and the API is the only thing that talks to the database. There is no shared backend state between requests: sessions are carried entirely in a signed JWT stored in an httpOnly cookie, so the API can be scaled horizontally without sticky sessions.

### Key Decisions

- **Separate Codebases:** The frontend (`apps/web`) and backend (`apps/api`) live in separate packages from day one, making future scaling and deployment straightforward.
- **Stateless API:** The backend uses JSON Web Tokens (JWTs) for authentication, so it can be scaled horizontally without managing session affinity.
- **Relational Database:** PostgreSQL was chosen for its data integrity, relational structure, and robust constraints, which are important for reliably storing recovery data such as the one-check-in-per-day rule.

## API Endpoints

All authenticated routes require a valid JWT sent via an httpOnly `jwt` cookie.

| Method             | Endpoint               | Description                                                                                    |     Auth Required     |
| :----------------- | :--------------------- | :--------------------------------------------------------------------------------------------- | :-------------------: |
| **Health**         |                        |                                                                                                |                       |
| `GET`              | `/api/health`          | Simple health check.                                                                           |          No           |
| **Authentication** |                        |                                                                                                |                       |
| `POST`             | `/api/auth/register`   | Creates a new user account and sets the session cookie.                                        |          No           |
| `POST`             | `/api/auth/login`      | Authenticates a user and sets the session cookie.                                              |          No           |
| `POST`             | `/api/auth/logout`     | Clears the session cookie.                                                                     |          No           |
| `GET`              | `/api/auth/me`         | Returns the currently logged-in user based on the session cookie.                              | No (relies on cookie) |
| **Check-ins**      |                        |                                                                                                |                       |
| `POST`             | `/api/check-ins`       | Creates a check-in. Accepts an optional `date`, so a specific past day can be logged directly. |          Yes          |
| `GET`              | `/api/check-ins`       | Returns all check-ins for the logged-in user, newest first.                                    |          Yes          |
| `GET`              | `/api/check-ins/stats` | Returns total check-ins, current streak, and milestone progress.                               |          Yes          |
| `PUT`              | `/api/check-ins/:id`   | Updates the title, note, and setback flag of an existing check-in.                             |          Yes          |
| **Users**          |                        |                                                                                                |                       |
| `PUT`              | `/api/users/password`  | Updates the logged-in user's password.                                                         |          Yes          |
| `DELETE`           | `/api/users`           | Permanently deletes the logged-in user's account and all their data.                           |          Yes          |
| **Verses**         |                        |                                                                                                |                       |
| `GET`              | `/api/verses/today`    | Returns today's verse, generating one if it does not exist yet.                                |          Yes          |
| `GET`              | `/api/verses`          | Returns the full verse archive.                                                                |          Yes          |

## Tech Stack

| Layer              | Choice                                                            | Why                                                                                    |
| ------------------ | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Frontend**       | React 19 (Vite) + Tailwind CSS v4                                 | Fast dev loop, huge ecosystem, and rapid styling.                                      |
| **Backend**        | Node.js + Express 5                                               | Minimal boilerplate and easy to reason about.                                          |
| **ORM**            | Prisma 7 (with the `pg` driver adapter)                           | Type-safe queries, painless migrations, and scales well with the schema.               |
| **Database**       | PostgreSQL                                                        | Relational integrity and strong constraints, including the one-check-in-per-day rule.  |
| **Authentication** | JWT (httpOnly cookies) + bcrypt                                   | Stateless, secure, and avoids storing plaintext passwords or tokens in `localStorage`. |
| **Daily Verse**    | Hugging Face inference router (with a local fallback set)         | Generates fresh, themed verses while degrading gracefully if the request fails.        |
| **Hosting**        | Vercel (frontend) + a Node-friendly host such as Render (backend) | Fast to deploy, minimal ops overhead for a project at this stage.                      |

## Security Considerations

Given the sensitive nature of the data, security is a priority.

- **Password Security:** Passwords are never stored in plaintext. They are hashed with `bcrypt`.
- **Session Management:** JWTs are stored in httpOnly cookies to reduce the risk of XSS-based token theft. Tokens are never kept in `localStorage`.
- **Ownership Checks:** Every check-in update verifies that the entry belongs to the requesting user before it can be edited.
- **Account Deletion:** Deleting an account cascades to remove all of that user's check-ins from the database.

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

- Node.js (v20 or later recommended)
- pnpm
- A PostgreSQL database (a local instance or a hosted one such as Supabase)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bloom-habit.git
cd bloom-habit
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

**Backend (`apps/api/.env`)**

```env
# Connection string for your PostgreSQL database.
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/postgres"

# A strong, random secret for signing JWTs.
JWT_SECRET="your-super-secret-jwt-key"

# The port the API server will run on.
PORT=5000

# The frontend origin allowed by CORS.
FRONTEND_URL="http://localhost:5173"

# Optional. Enables live daily verse generation through Hugging Face's
# router. Without it, the API falls back to a small built-in set of verses.
HF_TOKEN="your-hugging-face-token"
```

**Frontend (`apps/web/.env`)**

```env
# The base URL of the backend API, including the /api prefix.
VITE_API_URL="http://localhost:5000/api"
```

### 4. Set Up the Database

Run the Prisma migrations to set up your database schema.

```bash
pnpm --filter api exec prisma migrate deploy
```

### 5. Run the Application

```bash
# Start the backend API server (http://localhost:5000)
pnpm --filter api dev

# In a separate terminal, start the frontend dev server (http://localhost:5173)
pnpm --filter web dev
```

The React application should now be running and connected to your local API server.

## Deployment

- **Frontend:** The React SPA can be deployed as a static site to Vercel. A `vercel.json` rewrite is already configured so client-side routing works correctly.
- **Backend:** The Express API can be deployed to any Node-friendly host. Run `pnpm --filter api build` to generate the Prisma client and compile TypeScript, then `pnpm --filter api start` to apply migrations and start the server.
- **Database:** A managed PostgreSQL provider such as Supabase works well for this project.

Make sure the environment variables above are configured in each hosting provider's dashboard.

## Contributing

Contributions are welcome. Please open an issue to discuss a new feature or bug fix before submitting a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
