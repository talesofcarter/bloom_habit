# Bloom Habit — Project Plan

A lightweight, scalable habit-recovery tracker that helps a user manage and track their journey toward overcoming harmful habits through secure daily check-ins.

---

## 1. Client Needs Analysis

This is not a generic to-do app — it's a **personal recovery support tool**. That reframes the priorities:

- **Trust & privacy are paramount.** Check-in notes may contain sensitive, personal disclosures about cravings, triggers, or setbacks. Data must be treated with the same care as health data, even in a "lightweight" prototype.
- **Core loop must be simple and feel safe.** Sign up → log in securely → write a daily note → see progress over time. Every bit of friction here reduces the odds someone checks in on a hard day.
- **Longevity matters more than features.** A recovery tool needs to still exist and work reliably a year from now. Better to nail auth + check-ins solidly than ship five half-built features.
- **Growth path.** Today it's one user/client, but the architecture should allow adding multiple habits, reminders, streak analytics, or multi-user support later without a rewrite.

### Functional requirements
1. Account creation + secure login (email/password to start)
2. Daily check-in: free-text note, timestamped, one-per-day (or amendable)
3. History view of past check-ins
4. Monthly calendar view showing check-in progress (see §5, Milestone 4)
5. Basic progress indicators (streak count, days since start, month-completion stat)

### Non-functional requirements
- Data privacy (encryption in transit and at rest, no unnecessary data retention)
- Security (hashed passwords, protected sessions)
- Simplicity to ship fast, without boxing in future scale

---

## 2. Architecture

A **modular monolith** — not microservices. Microservices would slow delivery with zero benefit at this stage. The monolith is structured internally so it can be split apart later if scale demands it.

```
┌─────────────────────┐
│   React SPA (Vite)  │  ← Frontend
└──────────┬───────────┘
           │ HTTPS / JSON (REST)
┌──────────▼───────────┐
│  Node.js + Express   │  ← Backend API
│  - Auth module        │
│  - Check-ins module    │
│  - Users module        │
└──────────┬───────────┘
           │ Prisma ORM
┌──────────▼───────────┐
│   PostgreSQL          │  ← Persistent storage
└───────────────────────┘
```

Key decisions:
- **Frontend and backend are separate codebases/deployments from day one.** This is the single biggest thing that makes "scale later" painless, and it costs almost nothing to do now.
- **Stateless API + JWT auth** so the backend can scale horizontally later without sticky sessions.
- **PostgreSQL** over a document store like MongoDB, since the data (users, check-ins, streaks) is naturally relational and benefits from real constraints — important given how much this data matters to the user.

---

## 3. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | **React (Vite) + Tailwind CSS** | Fast dev loop, huge ecosystem, Tailwind keeps styling quick without a design system overhead |
| Backend | **Node.js + Express** | Minimal boilerplate, easy to reason about for a prototype |
| ORM | **Prisma** | Type-safe queries, painless migrations, scales well as schema grows |
| Database | **PostgreSQL** (hosted via Supabase) | Relational integrity, generous free tiers, easy managed upgrade path |
| Auth | **JWT (httpOnly cookies) + bcrypt** | Stateless, secure, standard; avoids storing plaintext or reversible passwords |
| Hosting (prototype) | **Vercel** (frontend) + **Render** (backend) | Fast to deploy, minimal ops overhead, cheap to start |
| Testing | **Jest + Supertest** | Standard JS testing, keeps auth and check-in logic covered as it grows |

### Security notes specific to this app's purpose
- All traffic over HTTPS
- Passwords hashed with bcrypt (never stored raw)
- JWTs in httpOnly cookies (not localStorage, to reduce XSS risk)
- Check-in notes encrypted at rest, given their sensitivity

---

## 4. Feature: Calendar Progress View

In addition to a simple history list, the app displays a **monthly calendar grid** — the kind of visual progress tracker common to most habit apps.

- **Data model:** no structural change needed. The `CheckIns` table (`userId`, `date`, `note`, `createdAt`) already supports this; it's just queried by date range instead of "today only."
- **API:** one new endpoint — `GET /api/checkins?month=2026-07` — returns all check-in dates + metadata for that month, so the frontend can render the grid without N+1 requests.
- **Frontend:** a **custom-built** lightweight calendar grid component (not a heavy library like FullCalendar — we only need a month grid with day states, not scheduling/events). Each day cell reflects one of: checked-in, missed, today, or future/not-yet.
- The streak counter and calendar pull from the same underlying query, so they stay in sync by construction.

---

## 5. Milestones

1. **Foundation** — repo setup, DB schema (Users, CheckIns tables), Prisma config, basic Express server skeleton, React app skeleton.
2. **Authentication** — signup, login, logout, password hashing, JWT session handling, protected routes.
3. **Daily Check-In** — create/view a note for "today," prevent duplicate same-day entries (or allow edits), timestamps.
4. **History, Calendar & Progress** — monthly calendar grid (query check-ins by date range), streak calculation (consecutive days), month-completion stat, click any day to view/edit that day's note.
5. **Polish & Hardening** — input validation, rate limiting on auth routes, basic error handling/logging, responsive UI pass.
6. **Deploy** — ship frontend + backend + DB to hosted environments, environment variables/secrets configured, smoke test the full flow.

Each milestone is independently shippable — the client could start using the app as early as Milestone 3–4 if needed.

---

## 6. Naming

**Chosen name: Bloom Habit**

Other one-word options considered: Anchor, Steady, Foothold, Renew, Mend, Ascend, Reclaim, Compass, Ember.

---

## Status

Plan approved by client. Awaiting go-ahead to begin **Milestone 1**.
