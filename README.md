# Hackathon Project

A Next.js project with React, TypeScript, Tailwind CSS, Supabase, and Groq AI integration.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **UI Components**: shadcn/ui + Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **AI/LLM**: Groq (ultra-fast LLM inference)
- **API**: REST API (Next.js API Routes)

## Project Structure

```
├── app/                  # Next.js app router pages
│   ├── api/             # API routes
│   │   ├── groq/        # Groq AI endpoints
│   │   └── example/     # Example CRUD endpoints
│   └── components/      # React components
├── lib/
│   ├── supabase/        # Supabase client configurations
│   │   ├── client.ts    # Client-side Supabase instance
│   │   └── server.ts    # Server-side Supabase instance
│   ├── groq/            # Groq AI utilities
│   │   ├── client.ts    # Groq client & models
│   │   └── utils.ts     # AI helper functions
│   └── utils/           # Utility functions
│       └── api.ts       # API helpers
├── hooks/               # React hooks
│   ├── useSupabase.ts  # Supabase data hooks
│   └── useGroq.ts      # Groq AI hooks
├── types/               # TypeScript type definitions
│   └── database.ts      # Database types
├── docs/                # Documentation
│   ├── HACKATHON_DAY_GUIDE.md
│   ├── GROQ_GUIDE.md
│   ├── SETUP_COMPLETE.md
│   └── ...
├── public/              # Static assets
└── .env.local          # Environment variables (DO NOT COMMIT)
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Get your Supabase credentials from [Supabase Dashboard](https://app.supabase.com)
3. Get your Groq API key from [Groq Console](https://console.groq.com)
4. Update `.env.local` with your actual values:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (server-side only)
   - `GROQ_API_KEY`: Your Groq API key

### 3. Set up Supabase MCP (Optional)

See [docs/MCP_SETUP.md](./docs/MCP_SETUP.md) for detailed instructions on configuring Supabase MCP in Claude Code.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Quick Development Tips

### Using Supabase Client

**Client-side (in React components):**
```typescript
import { supabase } from '@/lib/supabase/client';

const { data, error } = await supabase
  .from('your_table')
  .select('*');
```

**Server-side (in API routes or server components):**
```typescript
import { supabaseAdmin } from '@/lib/supabase/server';

const { data, error } = await supabaseAdmin
  .from('your_table')
  .select('*');
```

### Creating API Routes

Create files in `app/api/[route]/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('your_table')
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Documentation

### 📅 For Hackathon Day
- **[docs/HACKATHON_DAY_GUIDE.md](./docs/HACKATHON_DAY_GUIDE.md)** - ⭐ START HERE on hackathon day!
- **[docs/GROQ_GUIDE.md](./docs/GROQ_GUIDE.md)** - Complete guide to using Groq AI
- **[docs/SHADCN_QUICK_REFERENCE.md](./docs/SHADCN_QUICK_REFERENCE.md)** - shadcn/ui components reference
- **[docs/HACKATHON_GUIDE.md](./docs/HACKATHON_GUIDE.md)** - Quick reference patterns

### ✅ Setup Complete
- **[docs/SETUP_COMPLETE.md](./docs/SETUP_COMPLETE.md)** - Final setup status (everything is ready!)
- **[docs/SETUP_CHECKLIST.md](./docs/SETUP_CHECKLIST.md)** - What's been completed

### 🔧 Optional/Reference
- **[docs/MCP_SETUP.md](./docs/MCP_SETUP.md)** - Supabase MCP configuration (optional)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Groq Documentation](https://console.groq.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
