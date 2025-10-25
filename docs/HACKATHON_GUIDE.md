# Hackathon Quick Start Guide

## Pre-Hackathon Checklist

- [ ] Set up Supabase project at [supabase.com](https://supabase.com)
- [ ] Update `.env.local` with your Supabase credentials
- [ ] Test the dev server: `npm run dev`
- [ ] Configure Supabase MCP (see [MCP_SETUP.md](./MCP_SETUP.md))
- [ ] Plan your database schema

## During the Hackathon

### 1. Database Setup (First 30 min)

1. **Create your tables in Supabase**:
   - Go to Supabase Dashboard > Table Editor
   - Create tables with proper relationships
   - Set up Row Level Security (RLS) policies if needed

2. **Generate TypeScript types** (optional but recommended):
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
   ```

3. **Test database connection**:
   - Use the example API route at `/api/example`
   - Or use the Supabase hooks in a component

### 2. Quick Development Patterns

#### Pattern 1: Server Component with Direct DB Access
```typescript
// app/page.tsx
import { supabaseAdmin } from '@/lib/supabase/server';

export default async function Page() {
  const { data } = await supabaseAdmin
    .from('your_table')
    .select('*');

  return <div>{/* Render data */}</div>;
}
```

#### Pattern 2: Client Component with API Route
```typescript
// app/api/items/route.ts
export async function GET() {
  const { data } = await supabaseAdmin.from('items').select('*');
  return NextResponse.json({ data });
}

// app/components/Items.tsx
'use client';
export function Items() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/items')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);
}
```

#### Pattern 3: Client Component with Supabase Hook
```typescript
// app/components/Items.tsx
'use client';
import { useSupabaseQuery } from '@/hooks/useSupabase';

export function Items() {
  const { data, isLoading } = useSupabaseQuery({
    table: 'items',
    select: '*'
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{/* Render data */}</div>;
}
```

### 3. Common Tasks

#### Create a new page
```bash
# Create app/dashboard/page.tsx
```

#### Create a new API route
```bash
# Create app/api/[route-name]/route.ts
```

#### Add a component
```bash
# Create app/components/[ComponentName].tsx
```

#### Install a package
```bash
npm install package-name
```

### 4. Useful Supabase Queries

```typescript
// Select with filters
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('status', 'active')
  .order('created_at', { ascending: false })
  .limit(10);

// Insert
const { data } = await supabase
  .from('users')
  .insert([{ name: 'John', email: 'john@example.com' }])
  .select();

// Update
const { data } = await supabase
  .from('users')
  .update({ name: 'Jane' })
  .eq('id', userId)
  .select();

// Delete
const { error } = await supabase
  .from('users')
  .delete()
  .eq('id', userId);

// Join tables
const { data } = await supabase
  .from('posts')
  .select(`
    *,
    author:users(id, name),
    comments(*)
  `);
```

### 5. Debugging Tips

1. **Check Supabase logs**: Dashboard > Logs
2. **Network tab**: Check API requests/responses
3. **Console errors**: Look for CORS or auth issues
4. **TypeScript errors**: Run `npm run build` to catch type errors early

### 6. Time-Saving Tips

- Use the provided hooks in `hooks/useSupabase.ts` for quick data fetching
- Copy and modify the example API route for new endpoints
- Use Tailwind CSS utility classes for fast styling
- Leverage Next.js Server Components for data fetching when possible
- Keep it simple - focus on core functionality first

### 7. Before Submission

- [ ] Test all features
- [ ] Check console for errors
- [ ] Test on different screen sizes (responsive)
- [ ] Run `npm run build` to check for build errors
- [ ] Update README with project description
- [ ] Add screenshots if time permits

## Common Pitfalls to Avoid

1. **Environment variables**: Make sure `.env.local` is properly configured
2. **Client vs Server**: Don't use `supabaseAdmin` in client components
3. **CORS**: Use Next.js API routes as a proxy if needed
4. **RLS**: If queries return empty, check Row Level Security policies
5. **Async/Await**: Don't forget to await Supabase queries

## Getting Help

- Claude Code can help you debug and write code
- Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs
- Check the example files in this project for reference

Good luck with your hackathon!
