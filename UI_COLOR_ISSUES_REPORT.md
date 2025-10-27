# UI Color & Readability Issues Report

**Date:** October 26, 2025
**Issue:** Poor visibility and contrast on certain pages - skeleton loading states appear washed out

---

## Executive Summary

The hackathon project has **critical readability issues** on sponsor dashboard pages where skeleton loading components use colors that are too light, resulting in poor contrast against the white background.

---

## Issues Found

### CRITICAL ISSUES

#### 1. Skeleton Component - Poor Contrast (components/ui/skeleton.tsx:9)
**Problem:** Uses `bg-zinc-100` which is too light (#f4f4f5 vs #ffffff white background)

**Current Code:**
```tsx
className={cn("animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800", className)}
```

**Impact:** Skeleton loading states are barely visible on white backgrounds

**Affected Pages:**
- `/sponsor` - Sponsor Dashboard
- `/sponsor/challenges` - Sponsor Challenges page

**Contrast Ratio:** ~1.05:1 (WCAG requires minimum 3:1 for UI components)

---

#### 2. Shimmer Animation - Washed Out Colors (app/globals.css:80-83)
**Problem:** Shimmer gradient uses very light grays that blend into white background

**Current Code:**
```css
.shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

**Impact:** Loading animations are nearly invisible in light mode

**Colors:**
- `#f0f0f0` (zinc-100 equivalent) - Too light
- `#e0e0e0` (zinc-200 equivalent) - Still too light

---

## Pages Working Correctly

✅ **Home page** (`/`) - Good contrast, proper white background
✅ **About page** (`/about`) - Excellent readability
✅ **Sign In page** (`/auth/signin`) - Clean, good contrast
✅ **Sign Up page** (`/auth/signup`) - Clean, good contrast
✅ **Challenges page** (`/challenges`) - White background, clear content
✅ **Leaderboard page** (`/leaderboard`) - Good contrast with blue accents
✅ **Profile page** (`/profile`) - Redirects properly when not authenticated

---

## Root Cause Analysis

1. **Skeleton Component Color Choice**
   - `zinc-100` (#f4f4f5) is only 1.03:1 contrast ratio vs white
   - WCAG AA requires 3:1 minimum for UI components
   - Dark mode is fine with `zinc-800`

2. **Design System Inconsistency**
   - CSS variables define `--muted: #f5f5f5` (line 37 in globals.css)
   - This is also too light for use as skeleton backgrounds
   - Should use `zinc-200` or darker for better visibility

3. **Loading State Visibility**
   - Users cannot tell if page is loading or broken
   - Accessibility issue for users with low vision
   - Creates poor UX impression

---

## Recommended Fixes

### Fix 1: Update Skeleton Component
**File:** `components/ui/skeleton.tsx`

Change from:
```tsx
className={cn("animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800", className)}
```

To:
```tsx
className={cn("animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800", className)}
```

**Improvement:** Increases contrast ratio from 1.03:1 to ~1.18:1 (or use zinc-300 for 1.36:1)

---

### Fix 2: Update Shimmer Animation
**File:** `app/globals.css`

Change from:
```css
.shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

To:
```css
.shimmer {
  background: linear-gradient(90deg, #e5e5e5 25%, #d4d4d4 50%, #e5e5e5 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

**Improvement:** Uses zinc-200 (#e5e5e5) and zinc-300 (#d4d4d4) for better visibility

---

### Fix 3: Consider Alternative - Use Border-Based Skeletons
For even better visibility, add a border:

```tsx
className={cn(
  "animate-pulse rounded-md bg-zinc-100 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700",
  className
)}
```

This maintains the light aesthetic while improving visibility through the border.

---

## Testing Checklist

After implementing fixes, verify:

- [ ] Skeleton components are clearly visible on `/sponsor` page
- [ ] Skeleton components are clearly visible on `/sponsor/challenges` page
- [ ] Shimmer animation is visible during loading states
- [ ] Dark mode still looks good (no changes needed there)
- [ ] Contrast meets WCAG AA standards (3:1 minimum)
- [ ] No other pages affected by the changes
- [ ] Loading states provide clear visual feedback to users

---

## Screenshots Reference

All screenshots saved in: `F:/Claude_Files/25_Hackathon/screenshots/`

**Problem Screenshots:**
- `sponsor.png` - Shows washed out skeleton boxes
- `sponsor-challenges.png` - Shows barely visible loading states

**Reference (Good) Screenshots:**
- `home.png` - Example of proper contrast
- `challenges.png` - Example of proper white backgrounds

---

## Priority: HIGH

These issues affect:
- User experience (UX)
- Accessibility (WCAG compliance)
- Professional appearance
- Sponsor dashboard usability

**Recommended Action:** Implement Fix 1 and Fix 2 immediately to improve skeleton visibility.
