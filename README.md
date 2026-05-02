# ⚡ Taskflow — Full-Stack Project Manager

A Trello-inspired project management app built with **Next.js 15**, **TypeScript**, and **Prisma**. Users can sign up, create boards, add columns and tasks — all protected behind authentication.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?style=flat-square&logo=tailwindcss)

🌐 **Live Demo:** [taskflow-mauve-nine.vercel.app](https://taskflow-mauve-nine.vercel.app)

---

## ✨ Features

- 🔐 **Authentication** — Secure sign up, login, logout with NextAuth.js and bcrypt password hashing
- 📋 **Boards** — Create, color-code, and delete project boards per user
- 📝 **Columns** — Add custom columns to organize your workflow
- ✅ **Tasks** — Add and delete tasks inside any column
- 👤 **User isolation** — Each user sees only their own boards and data
- 📱 **Responsive UI** — Works on desktop and mobile
- 🛡️ **Protected routes** — Unauthenticated users are redirected to login

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 15 (App Router) | Full-stack React framework |
| Language | TypeScript | Type safety |
| Auth | NextAuth.js v5 | JWT sessions + credentials provider |
| ORM | Prisma 5 | Database access layer |
| Database | PostgreSQL (Neon) | Cloud persistent storage |
| Styling | Tailwind CSS | Utility-first UI |
| Security | bcryptjs | Password hashing |
| Deployment | Vercel | Frontend + serverless functions |

---

## 🗄️ Database Schema
User    → has many Boards
Board   → has many Columns
Column  → has many Tasks
Task    → belongs to Column

All relationships cascade on delete — removing a board removes all its columns and tasks automatically.

---

## 📁 Project Structure

```
taskflow/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── boards/route.ts
│   │   ├── boards/[id]/route.ts
│   │   ├── boards/[id]/columns/route.ts
│   │   ├── columns/[id]/route.ts
│   │   ├── columns/[id]/tasks/route.ts
│   │   ├── tasks/[id]/route.ts
│   │   └── register/route.ts
│   ├── boards/[id]/
│   │   ├── page.tsx
│   │   ├── BoardClient.tsx
│   │   └── TaskCard.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── DashboardClient.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── page.tsx
├── lib/
│   ├── auth.ts
│   └── prisma.ts
├── prisma/
│   └── schema.prisma
└── .env
```

---


## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/abdallah-bazia/taskflow.git
cd taskflow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create `.env`:

```env
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Set up the database

```bash
npx prisma db push
npx prisma generate
```

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), register an account and start managing your projects!

---

## 👤 Author

**Abdallah Bazia**
- GitHub: [@abdallah-bazia](https://github.com/abdallah-bazia)
- Portfolio: [portfolio-jet-three-82.vercel.app](https://portfolio-jet-three-82.vercel.app)
