# Hackathon Day - Quick Start Guide

## 🎯 You're 100% Ready to Go!

Everything is configured and tested. Here's your game plan for tomorrow.

## ⚡ Quick Start (2 minutes)

```bash
# Start your dev server
npm run dev

# Open in browser
# http://localhost:3000
```

**That's it!** Your environment is ready.

## 📋 Pre-Hackathon Checklist

Before you start coding:

- [ ] Decide on your project idea
- [ ] Sketch your database schema (tables, columns, relationships)
- [ ] List your main features (MVP first!)
- [ ] Identify where you'll use AI (Groq)

## 🛠️ What You Have Available

### ✅ Supabase Database
- **Project**: hackathon
- **URL**: https://qbbdfgszjgfteusxlykl.supabase.co
- **Status**: Connected and tested
- **Dashboard**: https://supabase.com/dashboard/project/qbbdfgszjgfteusxlykl

### ✅ Groq AI
- **Models**: Llama 3, Mixtral, Gemma, Vision models
- **Speed**: Ultra-fast (milliseconds!)
- **Guide**: [GROQ_GUIDE.md](./GROQ_GUIDE.md)

### ✅ Pre-Built Tools
- Custom React hooks for Supabase and Groq
- Example API routes
- Example components
- TypeScript types

## 🚀 Common First Tasks

### 1. Create Your Database Tables

**Option A - Supabase Dashboard (Easiest):**
1. Go to https://supabase.com/dashboard/project/qbbdfgszjgfteusxlykl
2. Click "Table Editor"
3. Click "Create a new table"
4. Add columns, set types, configure relationships

**Option B - SQL Editor:**
1. Go to SQL Editor in dashboard
2. Write your CREATE TABLE statements
3. Run them

**Option C - Ask Claude Code:**
"Help me create a table for [your use case]"

### 2. Query Your Database

**In a Server Component:**
```typescript
import { supabaseAdmin } from '@/lib/supabase/server';

export default async function Page() {
  const { data } = await supabaseAdmin
    .from('your_table')
    .select('*');

  return <div>{/* render data */}</div>;
}
```

**In a Client Component:**
```typescript
'use client';
import { useSupabaseQuery } from '@/hooks/useSupabase';

export function MyComponent() {
  const { data, isLoading } = useSupabaseQuery({
    table: 'your_table',
    select: '*'
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{/* render data */}</div>;
}
```

### 3. Add AI Features with Groq

**Simple Text Generation:**
```typescript
'use client';
import { useGroqGenerate } from '@/hooks/useGroq';

export function AIComponent() {
  const { response, generate } = useGroqGenerate();

  const handleGenerate = async () => {
    await generate("Your prompt here");
  };

  return (
    <div>
      <button onClick={handleGenerate}>Generate</button>
      <p>{response}</p>
    </div>
  );
}
```

**Chat Interface:**
```typescript
'use client';
import { useGroqChat } from '@/hooks/useGroq';

export function ChatComponent() {
  const { sendMessage, messages, isLoading } = useGroqChat(
    "You are a helpful assistant"
  );

  // See GroqChatExample.tsx for full implementation
}
```

## 📁 File Organization

### Create New Pages
```
app/
  your-page/
    page.tsx
```

### Create API Routes
```
app/api/
  your-endpoint/
    route.ts
```

### Create Components
```
app/components/
  YourComponent.tsx
```

## 🎨 Styling with Tailwind

All Tailwind classes are available:
```tsx
<div className="p-4 bg-blue-500 text-white rounded-lg">
  Content
</div>
```

## 🔥 Hot Tips for Speed

### 1. Copy & Modify Examples
- [app/components/GroqChatExample.tsx](./app/components/GroqChatExample.tsx) - Full chat UI
- [app/api/example/route.ts](./app/api/example/route.ts) - CRUD operations
- [app/api/groq/](./app/api/groq/) - AI endpoints

### 2. Use the Hooks
Don't write fetch code - use the pre-built hooks:
- `useGroqChat()` - Conversational AI
- `useGroqGenerate()` - Text generation
- `useSupabaseQuery()` - Fetch data
- `useSupabaseInsert()` - Insert data

### 3. Leverage AI for Content
Use Groq to:
- Generate mock data
- Create descriptions
- Summarize content
- Analyze images (vision models)
- Generate JSON (structured data)

### 4. Keep It Simple
- Start with 1-2 tables max
- Build MVP features first
- Add polish later if time permits

## 📚 Documentation Quick Reference

Keep these open in tabs:

1. **[GROQ_GUIDE.md](./GROQ_GUIDE.md)** - All Groq examples
2. **[HACKATHON_GUIDE.md](./HACKATHON_GUIDE.md)** - Patterns and tips
3. **[Supabase Docs](https://supabase.com/docs)** - Database queries
4. **[Next.js Docs](https://nextjs.org/docs)** - Framework reference

## 🐛 Quick Troubleshooting

**Build errors?**
```bash
npm run build
```
Check TypeScript errors in output.

**Database not connecting?**
- Check `.env.local` has correct values
- Verify project is active in Supabase dashboard

**Groq errors?**
- Check `GROQ_API_KEY` in `.env.local`
- Verify you have API quota remaining

**Type errors?**
- Restart VS Code TypeScript server
- Check imports are correct

## ⏱️ Time Management

**Hour 1-2: Setup & Planning**
- Finalize your idea
- Create database tables
- Test basic queries

**Hour 3-5: Core Features**
- Build main functionality
- Get CRUD working
- Integrate AI features

**Hour 6-7: Polish & Demo**
- UI improvements
- Test everything
- Prepare demo
- Deploy (optional)

## 🎯 Remember

- **MVP First** - Get core features working
- **Don't Overthink** - Use the examples provided
- **AI is Fast** - Groq responses are instant, use it!
- **Ask Claude Code** - I can help you debug and build

## 🚀 Let's Go!

You have:
- ✅ Modern full-stack framework
- ✅ Database ready to use
- ✅ Ultra-fast AI
- ✅ Pre-built examples
- ✅ Complete documentation

**Everything you need to build something amazing!**

Start with `npm run dev` and begin building your idea.

**Good luck! 🎉**
