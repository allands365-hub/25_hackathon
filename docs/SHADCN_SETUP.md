# shadcn/ui Setup Guide

## Quick Install (5 minutes)

shadcn/ui is a collection of beautiful, accessible components that you can copy into your project. Perfect for hackathons!

### 1. Initialize shadcn/ui

```bash
npx shadcn@latest init
```

**When prompted, choose:**
- ✅ TypeScript: Yes
- ✅ Style: Default
- ✅ Base color: Slate (or your preference)
- ✅ CSS variables: Yes
- ✅ Import alias: @/components

### 2. Add Components (Pick What You Need)

**For a typical hackathon project:**

```bash
# Essential components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add dialog
npx shadcn@latest add toast

# Optional but useful
npx shadcn@latest add table
npx shadcn@latest add form
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tabs
npx shadcn@latest add avatar
npx shadcn@latest add badge
```

**Note:** With React 19, you may need to use:
```bash
npm install --legacy-peer-deps
```

### 3. Quick Usage Example

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function MyComponent() {
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>My Hackathon Project</CardTitle>
        <CardDescription>Built with shadcn/ui</CardDescription>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter something..." />
        <Button className="mt-4">Submit</Button>
      </CardContent>
    </Card>
  )
}
```

## React 19 Compatibility Note

shadcn/ui is fully compatible with React 19 and Next.js 16. If you encounter peer dependency warnings during installation, use:

```bash
npm install --legacy-peer-deps
```

Or switch to pnpm/yarn which handle peer dependencies better:

```bash
pnpm add <component>
# or
yarn add <component>
```

## Quick Component Reference

### Layout
- **Card** - Container for content
- **Tabs** - Tabbed interface
- **Dialog** - Modal dialogs
- **Sheet** - Slide-out panel

### Forms
- **Input** - Text input
- **Textarea** - Multi-line text
- **Select** - Dropdown select
- **Button** - Interactive buttons
- **Checkbox** - Checkboxes
- **Radio Group** - Radio buttons
- **Form** - Complete form handling with validation

### Display
- **Table** - Data tables
- **Badge** - Status badges
- **Avatar** - User avatars
- **Toast** - Notifications
- **Alert** - Alert messages

### Navigation
- **Dropdown Menu** - Context menus
- **Navigation Menu** - Main navigation
- **Breadcrumb** - Breadcrumb navigation

## Time-Saving Tips for Hackathon

1. **Install as needed**: Don't install all components at start, add them as you need them
2. **Browse examples**: Visit https://ui.shadcn.com to see components in action
3. **Copy patterns**: shadcn/ui examples are great starting points
4. **Use with Groq**: Generate component layouts with Groq AI, then implement with shadcn/ui

## Alternative: Keep It Simple

If you want to move fast and don't need fancy UI:
- Stick with **Tailwind CSS** (already configured)
- Use basic HTML elements
- Focus on functionality over polish
- Add shadcn/ui later if time permits

## Recommendation for Tomorrow

**Option A - Use shadcn/ui if:**
- You want professional-looking UI
- You have 5 mins to set it up in the morning
- UI/UX is important for your demo

**Option B - Skip it if:**
- You want to focus purely on functionality
- Time is very limited
- Backend/AI features are your priority

Both are valid strategies for a hackathon!

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [React 19 Guide](https://ui.shadcn.com/docs/react-19)
- [Component Examples](https://ui.shadcn.com/examples)
