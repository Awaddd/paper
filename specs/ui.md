# UI Style Guide

Frontend styling conventions for Paper.

## Stack

- Tailwind CSS v4
- shadcn/ui (base-vega style)
- HugeIcons
- Noto Sans Variable

## Typography

Use Tailwind's type scale. Headings get `font-semibold` and tighter line height.

| Role | Class | Size |
|------|-------|------|
| Display | `text-4xl font-semibold leading-tight` | 36px |
| H1 | `text-3xl font-semibold leading-tight` | 30px |
| H2 | `text-2xl font-semibold leading-tight` | 24px |
| H3 | `text-xl font-semibold leading-tight` | 20px |
| Body | `text-base leading-relaxed` | 16px |
| Small | `text-sm` | 14px |
| Caption | `text-xs text-muted-foreground` | 12px |

## Spacing

4px base unit. Use Tailwind's spacing scale.

| Token | Value | Use case |
|-------|-------|----------|
| `gap-1` / `p-1` | 4px | Tight grouping |
| `gap-2` / `p-2` | 8px | Related elements |
| `gap-3` / `p-3` | 12px | Form fields |
| `gap-4` / `p-4` | 16px | Card padding |
| `gap-6` / `p-6` | 24px | Section padding |
| `gap-8` / `p-8` | 32px | Major sections |

Vertical rhythm: headings get `mb-2` or `mb-4`, paragraphs get `mb-4`.

## Colors

Use semantic tokens only. Never hardcode colors.

```tsx
// Good
<div className="bg-background text-foreground" />
<button className="bg-primary text-primary-foreground" />
<p className="text-muted-foreground" />

// Bad
<div className="bg-zinc-900 text-white" />
```

Key tokens:
- `background` / `foreground` - page background and text
- `card` / `card-foreground` - card surfaces
- `primary` / `primary-foreground` - primary actions (amber)
- `secondary` / `secondary-foreground` - secondary actions
- `muted` / `muted-foreground` - subdued elements
- `destructive` / `destructive-foreground` - danger states
- `border` - borders and dividers
- `ring` - focus rings

## Components

Use shadcn components. Import from `@/components/ui`.

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
```

Extend with CVA for custom variants:

```tsx
import { cva } from "class-variance-authority"

const customVariants = cva("base-classes", {
  variants: {
    size: {
      sm: "text-sm p-2",
      md: "text-base p-4",
    }
  }
})
```

Use `cn()` to merge classes:

```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-class", conditional && "conditional-class")} />
```

## Icons

Use HugeIcons via the wrapper component.

```tsx
import { HugeiconsIcon } from "@hugeicons/react"
import { SearchIcon } from "@hugeicons/core-free-icons"

<HugeiconsIcon icon={SearchIcon} strokeWidth={2} className="size-5" />
```

Size with `size-4` (16px), `size-5` (20px), or `size-6` (24px).

## Layout

Three-column layout for the app:

```
sidebar (collapsed) | source viewer | chat
```

Use flex and grid:

```tsx
// Main layout
<div className="flex h-screen">
  <aside className="w-16" />      {/* sidebar */}
  <main className="flex-1" />     {/* source viewer */}
  <aside className="w-96" />      {/* chat */}
</div>

// Grid for content
<div className="grid grid-cols-2 gap-4">
  ...
</div>
```

## Border Radius

Using medium radius (0.625rem). Applied via `rounded-md` or shadcn defaults.

Don't mix radius sizes within the same component group.
