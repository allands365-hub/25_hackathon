# Hackathon Setup Verification Checklist

## Pre-Hackathon Setup (Complete these before the event)

### 1. Environment Configuration ✅ COMPLETE
- [x] Copy `.env.example` to `.env.local`
- [x] Create a Supabase project at https://supabase.com
- [x] Get your Supabase URL and keys from Dashboard > Settings > API
- [x] Create a Groq account at https://console.groq.com
- [x] Get your Groq API key from the console
- [x] Update `.env.local` with:
  - `NEXT_PUBLIC_SUPABASE_URL` ✅
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
  - `SUPABASE_SERVICE_ROLE_KEY` ✅
  - `GROQ_API_KEY` ✅

### 2. Verify Installation
- [x] Next.js project created
- [x] TypeScript configured
- [x] Tailwind CSS installed
- [x] Supabase client installed
- [x] Groq SDK installed
- [x] Build passes: `npm run build` ✓

### 3. Test Connections ✅ COMPLETE
- [x] Test Supabase connection - PASSED ✅
- [x] Test Groq connection - PASSED ✅
- [x] Run connection test script: `node test-connections.js`

### 4. Optional: MCP Setup
- [x] MCP configuration file created (`.mcp.json`)
- [ ] MCP server activation (optional - not required for hackathon)
- **Note**: Full Supabase access available through client library - MCP not essential

### 5. Ready for Tomorrow! 🎉
- [x] All APIs configured and tested
- [x] Example code and documentation ready
- [ ] Plan your database schema (do this tomorrow based on your idea)
- [ ] Identify main tables and relationships (tomorrow)
- [ ] Plan features you want to build (tomorrow)

## What's Already Set Up

### Project Structure
```
├── app/
│   ├── api/
│   │   ├── groq/           # Groq AI API routes
│   │   │   ├── chat/       # Chat endpoint
│   │   │   ├── generate/   # Text generation endpoint
│   │   │   └── stream/     # Streaming endpoint
│   │   └── example/        # Example CRUD operations
│   ├── components/         # React components
│   │   ├── ExampleComponent.tsx
│   │   └── GroqChatExample.tsx
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── hooks/
│   ├── useSupabase.ts     # Custom hooks for Supabase queries
│   └── useGroq.ts         # Custom hooks for Groq AI
├── lib/
│   ├── supabase/
│   │   ├── client.ts      # Client-side Supabase instance
│   │   └── server.ts      # Server-side Supabase instance
│   ├── groq/
│   │   ├── client.ts      # Groq client & models
│   │   └── utils.ts       # AI helper functions
│   └── utils/
│       └── api.ts         # API utility functions
├── types/
│   └── database.ts        # Database type definitions (placeholder)
└── .env.local             # Environment variables (update with your credentials)
```

### Available Resources
- [README.md](./README.md) - General project documentation
- [GROQ_GUIDE.md](./GROQ_GUIDE.md) - Complete Groq AI integration guide
- [HACKATHON_GUIDE.md](./HACKATHON_GUIDE.md) - Quick reference during hackathon
- [MCP_SETUP.md](./MCP_SETUP.md) - Supabase MCP configuration

### Pre-built Utilities

1. **Supabase Hooks** ([hooks/useSupabase.ts](./hooks/useSupabase.ts)):
   - `useSupabaseQuery` - Fetch data
   - `useSupabaseInsert` - Insert data
   - `useSupabaseUpdate` - Update data
   - `useSupabaseDelete` - Delete data

2. **Groq AI Hooks** ([hooks/useGroq.ts](./hooks/useGroq.ts)):
   - `useGroqChat` - Conversational AI
   - `useGroqGenerate` - One-off text generation
   - `useGroqStream` - Streaming responses

3. **Groq Utilities** ([lib/groq/utils.ts](./lib/groq/utils.ts)):
   - `generate()` - Simple text generation
   - `generateJSON()` - Structured JSON output
   - `chat()` - Chat completion
   - `chatStream()` - Streaming chat
   - `analyzeImage()` - Vision model support

4. **API Helpers** ([lib/utils/api.ts](./lib/utils/api.ts)):
   - `handleApiResponse` - Consistent error handling
   - `fetchApi` - Fetch wrapper with error handling

5. **Example Components**:
   - [app/api/example/route.ts](./app/api/example/route.ts) - CRUD examples
   - [app/components/GroqChatExample.tsx](./app/components/GroqChatExample.tsx) - AI chat UI

## Quick Start Commands

```bash
# Install dependencies (already done)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Run linter
npm run lint
```

## Common First Steps During Hackathon

1. **Create your database tables** in Supabase Dashboard
2. **Update types/database.ts** with your schema
3. **Create your first API route** by copying `app/api/example/route.ts`
4. **Build your first page** in `app/page.tsx`
5. **Create components** in `app/components/`

## Troubleshooting

### Build fails
- Check TypeScript errors
- Verify all imports are correct
- Run `npm run lint`

### Supabase connection fails
- Verify `.env.local` credentials
- Check Supabase project is active
- Ensure you're using the correct client (client vs server)

### API route returns errors
- Check Supabase dashboard logs
- Verify table names match your schema
- Check RLS policies if queries return empty

## You're Ready!

Everything is set up and verified. During the hackathon:
1. Keep [HACKATHON_GUIDE.md](./HACKATHON_GUIDE.md) open for quick reference
2. Use Claude Code to help with coding and debugging
3. Focus on building your core features first
4. Don't worry about perfection - iterate quickly!

Good luck!
