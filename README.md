# Classly - Hackathon Challenge Platform

> A platform connecting sponsors with builders through coding challenges. Built in 48 hours.

![Classly Screenshot](./docs/screenshot.png)

## Live Demo

[https://25-hackathon.vercel.app](https://25-hackathon.vercel.app)

---

## What It Does

Classly is a two-sided platform:
- **Sponsors** create coding challenges with prizes
- **Builders** compete, submit solutions, and climb the leaderboard

Think of it as a hackathon-in-a-box — sponsors get talent discovery, builders get opportunities.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Components** | shadcn/ui (Radix primitives) |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **AI** | Groq SDK (Llama 3.1) |
| **Forms** | React Hook Form + Zod |
| **Deployment** | Vercel |

---

## Features

### For Builders
- Browse and filter challenges
- Submit solutions with live preview
- Track position on leaderboard
- Profile with submission history

### For Sponsors
- Create challenges with custom requirements
- Set prize pools and deadlines
- Review submissions in dashboard
- Manage participant engagement

### UX Details I'm Proud Of
- **Smart redirects** — authenticated users go straight to their dashboard
- **Role-based navigation** — sponsors and builders see different interfaces
- **Toast notifications** — Sonner for non-intrusive feedback
- **Form validation** — Zod schemas with helpful error messages
- **Loading states** — Skeleton components during data fetches

---

## Project Structure

```
app/
├── (auth)/           # Login, signup, onboarding
├── challenges/       # Challenge listing and details
├── submissions/      # Submission flow
├── leaderboard/      # Rankings
├── sponsor/          # Sponsor dashboard
├── profile/          # User profiles
└── api/              # API routes

components/
├── ui/               # shadcn/ui components
└── ...               # Feature-specific components

lib/
├── auth/             # Auth hooks and context
├── supabase/         # Database client
└── utils/            # Helpers
```

---

## Run Locally

```bash
# Clone
git clone https://github.com/allands365-hub/25_hackathon.git
cd 25_hackathon

# Install
npm install

# Environment
cp .env.example .env.local
# Add your Supabase credentials

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Design Decisions

### Why shadcn/ui?
Copy-paste components I can customize. No fighting with library defaults — I own the code.

### Why Supabase?
Auth + Database + Realtime in one. Row Level Security means I don't need a separate backend for access control.

### Why Groq?
Fast inference for AI features. Response times matter for UX.

---

## What I Learned

- Building role-based UIs that feel native to each user type
- Designing submission flows that reduce friction
- Implementing leaderboards that update in near-realtime

---

## Future Improvements

- [ ] Real-time leaderboard updates via Supabase subscriptions
- [ ] Challenge categories and tags
- [ ] Team submissions
- [ ] Integration with GitHub for code submissions

---

Built by [Allan D'Souza](https://allan-portfolio.framer.website/) | [GitHub](https://github.com/allands365-hub)
