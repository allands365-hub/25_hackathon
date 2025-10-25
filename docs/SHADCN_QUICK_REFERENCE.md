# shadcn/ui Quick Reference - Ready to Use!

## ✅ Already Installed Components

shadcn/ui is fully set up in your project! Here's what you have:

### Components Available:
- **Button** - Interactive buttons
- **Card** - Content containers
- **Input** - Text inputs
- **Textarea** - Multi-line text inputs
- **Dialog** - Modal dialogs
- **Select** - Dropdown selects
- **Sonner** - Toast notifications (already in layout!)

## 🚀 Quick Usage Examples

### Button
```tsx
import { Button } from "@/components/ui/button";

<Button>Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Card
```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Input
```tsx
import { Input } from "@/components/ui/input";

<Input placeholder="Email" type="email" />
<Input placeholder="Password" type="password" />
<Input disabled placeholder="Disabled" />
```

### Textarea
```tsx
import { Textarea } from "@/components/ui/textarea";

<Textarea placeholder="Type your message here" />
<Textarea placeholder="Description" rows={5} />
```

### Dialog (Modal)
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <div className="flex justify-end gap-2">
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </div>
  </DialogContent>
</Dialog>
```

### Select (Dropdown)
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

### Toast Notifications (Sonner)
```tsx
import { toast } from "sonner";

// Success toast
toast.success("Operation successful!");

// Error toast
toast.error("Something went wrong!");

// Info toast
toast.info("Here's some information");

// Loading toast
toast.loading("Processing...");

// With custom description
toast.success("User created", {
  description: "The user has been added to the database",
});

// With action button
toast("Event created", {
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
});
```

## 🎨 Combining with Tailwind

You can combine shadcn/ui components with Tailwind classes:

```tsx
<Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
  Gradient Button
</Button>

<Card className="hover:shadow-lg transition-shadow">
  <CardContent className="p-6">
    Content with custom padding
  </CardContent>
</Card>
```

## 📦 Need More Components?

Add them anytime:
```bash
npx shadcn@latest add badge
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add avatar
npx shadcn@latest add dropdown-menu
```

## 🔥 Complete Example

See [app/components/ShadcnExample.tsx](../app/components/ShadcnExample.tsx) for a full working example with:
- Card layout
- Form inputs
- Button actions
- Toast notifications

## 💡 Pro Tips

1. **Use `asChild` prop** - Merge component functionality:
   ```tsx
   <Button asChild>
     <Link href="/dashboard">Go to Dashboard</Link>
   </Button>
   ```

2. **Variant system** - Most components have variants:
   ```tsx
   <Button variant="outline">
   <Button variant="ghost">
   <Button variant="destructive">
   ```

3. **Size options** - Control component size:
   ```tsx
   <Button size="sm">
   <Button size="lg">
   <Input className="h-12"> {/* custom size */}
   ```

4. **Dark mode ready** - All components support dark mode automatically

## 📚 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Component Examples](https://ui.shadcn.com/examples)
- Installed components are in `components/ui/`

**Everything is ready to use - just import and go!** 🚀
