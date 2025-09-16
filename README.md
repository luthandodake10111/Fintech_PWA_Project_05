
# Escrow Service Web Application (Fintech PWA)

## 📌 Overview

This project is an **Escrow Service Web Application** that facilitates secure transactions between buyers and sellers. Payments are managed via **PayFast**, and funds are released only when both parties agree that the terms of the transaction have been met.

This is a **template** guide. The structure, pages, and modules defined here are starting points and **can be modified or expanded** as development progresses.

---

## 🛠 Tech Stack

* **Frontend:** React + Vite
* **Backend:** Node.js + Express + PostgreSQL (Prisma ORM)
* **Payments:** PayFast API (Sandbox → Production)
* **Hosting:** Railway (backend + DB), Vercel (frontend)
* **Authentication:** JWT (with 2FA support planned)

---

## 📂 Project Structure (Template)

```
/fintech-escrow-app
├── backend/                   # Node.js + Express + PostgreSQL (Prisma)
│   ├── src/
│   │   ├── config/            # DB connection, JWT, etc.
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── models/            # Prisma models / DB logic
│   │   ├── routes/            # API endpoint definitions
│   │   ├── services/          # Business logic (transactions, payments, disputes)
│   │   ├── tests/             # Unit & integration tests
│   │   └── app.js             # Express entry point
│   ├── prisma/                # Schema + migrations
│   └── package.json
│
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── assets/            # Images, global styles
│   │   ├── components/        # Shared UI components
│   │   ├── features/          # Feature-based structure
│   │   │   ├── auth/          # Login, Register, AuthContext
│   │   │   ├── transactions/  # Buyer/Seller transaction pages
│   │   │   ├── disputes/      # Dispute management
│   │   │   └── admin/         # Admin dashboard features
│   │   ├── api/               # API calls (axios/fetch)
│   │   ├── store/             # State management
│   │   └── App.jsx
│   └── package.json
│
├── design/                    # UI/UX Design Specs 
│   ├── wireframes/            # Screens (low/high fidelity)
│   ├── mockups/               # Final UI mockups (Figma exports, PNGs)
│   ├── styleguide/            # Fonts, colors, spacing rules
│   └── flows/                 # User flows & journey maps
│
├── docs/                      # Documentation
│   ├── api-contracts/         # Swagger/OpenAPI, Postman collections
│   ├── db-diagrams/           # ERDs, schema diagrams
│   └── architecture.md        # High-level project architecture
│
└── .github/                   # GitHub Actions (CI/CD)
    └── workflows/
        ├── backend-ci.yml     # Backend lint/tests
        └── frontend-ci.yml    # Frontend build/tests

```

## 📑 Core Pages & Dashboards (Template)

These are the **initial important pages**. More can be added as requirements develop.

### Authentication & Onboarding

* Login Page
* Register Page
* Profile Setup Page

### Buyer Pages

* Buyer Dashboard (overview of transactions & balances)
* Create Transaction Page
* Transaction Detail Page
* Dispute Page
* Transaction History Page

### Seller Pages

* Seller Dashboard (incoming transactions & balances)
* Transaction Detail Page
* Funds Release Page
* Transaction History Page

### Admin Pages

* Admin Dashboard (system overview)
* User Management Page
* Dispute Management Page
* Transaction Monitoring Page
* Reports Page

### General Pages

* Landing Page (optional for MVP)
* Help/Support Page
* Notifications (system alerts & updates)

---

## Workflow & Collaboration

### Branching Strategy

* **main** → Production-ready code (protected)
* **dev** → Staging branch for integration
* **feature/**\* → Feature-specific branches

### GitHub Workflow

1. Pull latest from `dev`
2. Create a new branch:

   ```bash
   git checkout -b feature/your-task-name
   ```
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/):

   ```
   feat: add transaction creation endpoint
   fix: correct login validation
   ```
4. Push your branch and open a Pull Request to `dev`.
5. At least one reviewer approval required before merging.

---

## Key Notes

* This is a **template**, not a fixed rulebook.
* Teams can **add, refine, or adjust** folders and pages as development evolves.
* Backend must keep API contracts in `/docs/api-contracts/` so frontend & QA stay aligned.
* QA will test full flows (Register → Create Transaction → PayFast Payment → Release Funds → History/Disputes).

---

## Development Milestones (Suggested)

1. **Sprint 1:** Authentication + Database setup.
2. **Sprint 2:** Transactions + PayFast integration.
3. **Sprint 3:** Disputes + Admin + Full integration testing.

---

## Collaboration

This structure and page list exist to give us a **shared starting point**. As requirements expand, each team will refine their part while keeping the whole project aligned.

