# UI/UX Improvements - Quick Reference Card

**🚀 Keep this handy while implementing the improvements**

---

## 📦 New Files Created

```
/src/app/lib/designTokens.js          - Design tokens
/src/app/components/atom/Button.jsx   - Button component
/src/app/components/atom/Skeleton.jsx - Skeleton loaders
/src/app/components/atom/Toast.jsx    - Toast UI
/src/app/context/toast.js             - Toast provider

/DESIGN_SYSTEM.md                     - Full documentation
/COMPONENT_AUDIT.md                   - Duplicate analysis
/IMPLEMENTATION_GUIDE.md              - Integration steps
/EXAMPLES.md                          - Code examples
/UI_UX_IMPROVEMENTS_SUMMARY.md        - Overview
/QUICK_REFERENCE.md                   - This file
```

---

## 🎨 Import Statements

```javascript
// Button Component
import Button from '@/app/components/atom/Button';
import { IconButton } from '@/app/components/atom/Button';

// Skeleton Loaders
import {
  Skeleton,
  SkeletonProductCard,
  SkeletonProductGrid,
  SkeletonList,
  SkeletonTable
} from '@/app/components/atom/Skeleton';

// Toast Notifications
import { useToast } from '@/app/context/toast';
import { ToastProvider } from '@/app/context/toast';

// Design Tokens
import { designTokens, getToken } from '@/app/lib/designTokens';

// Icons
import { ShoppingCartIcon, HeartIcon, TrashIcon } from '@heroicons/react/24/outline';
```

---

## 🔘 Button Component

### Variants
```jsx
<Button variant="primary">Primary</Button>      // Brand color
<Button variant="secondary">Secondary</Button>  // Neutral
<Button variant="outline">Outline</Button>      // Bordered
<Button variant="ghost">Ghost</Button>          // Transparent
<Button variant="danger">Danger</Button>        // Red/destructive
<Button variant="success">Success</Button>      // Green/confirm
<Button variant="link">Link</Button>            // Text style
```

### Sizes
```jsx
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>     // Default
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

### Props
```jsx
<Button
  variant="primary"        // Button style
  size="md"                // Size
  loading={isLoading}      // Shows spinner
  disabled={isDisabled}    // Disabled state
  fullWidth={true}         // 100% width
  leftIcon={<Icon />}      // Icon on left
  rightIcon={<Icon />}     // Icon on right
  onClick={handleClick}    // Click handler
  type="submit"            // Button type
  aria-label="Description" // Accessibility
>
  Button Text
</Button>
```

### Icon Button
```jsx
<IconButton
  icon={<HeartIcon />}
  label="Add to favorites"  // Required for accessibility
  variant="ghost"
  size="md"
  onClick={handleClick}
/>
```

---

## 💀 Skeleton Loaders

### Product Skeletons
```jsx
// Single product card
<SkeletonProductCard />

// Product grid
<SkeletonProductGrid count={8} columns={4} />
```

### Other Skeletons
```jsx
// Basic shapes
<Skeleton variant="text" className="w-full h-4" />
<Skeleton variant="circular" className="w-12 h-12" />
<Skeleton variant="rectangular" className="w-full h-48" />

// Pre-built components
<SkeletonList items={5} />
<SkeletonTable rows={5} columns={4} />
<SkeletonHeader />
<SkeletonCheckoutForm />
```

### Usage Pattern
```jsx
{loading ? (
  <SkeletonProductGrid count={8} columns={4} />
) : (
  <ProductGrid products={products} />
)}
```

---

## 🔔 Toast Notifications

### Setup (in layout.jsx)
```jsx
import { ToastProvider } from '@/app/context/toast';

<ToastProvider>
  {children}
</ToastProvider>
```

### Basic Usage
```jsx
const { success, error, warning, info } = useToast();

// Simple toast
success('Item added to cart!');
error('Something went wrong!');
warning('Your session will expire soon.');
info('New features available.');
```

### With Options
```jsx
success('Profile updated!', {
  duration: 5000,              // Auto-dismiss time (ms)
  dismissible: true,           // Show close button
  title: 'Success!',           // Optional title
  action: {                    // Optional action button
    label: 'View Profile',
    onClick: () => router.push('/profile')
  }
});
```

### In Functions
```jsx
const handleAddToCart = async () => {
  try {
    await addToCart(product);
    success('Added to cart!', {
      action: {
        label: 'View Cart',
        onClick: () => router.push('/cart')
      }
    });
  } catch (err) {
    error('Failed to add item. Please try again.');
  }
};
```

---

## 🎨 Tailwind Utilities

### Spacing (Use these instead of hardcoded values)
```jsx
gap-2  // 8px   instead of gap-[10px]
gap-4  // 16px  instead of gap-[15px]
gap-6  // 24px  instead of gap-[20px]

p-2    // 8px   instead of p-[10px]
p-4    // 16px  instead of p-[15px]
p-6    // 24px  instead of p-[20px]
```

### Shadows
```jsx
shadow-sm        // Subtle
shadow-md        // Default
shadow-lg        // Prominent
shadow-xl        // Very prominent
shadow-theme     // Brand-colored shadow
shadow-theme-lg  // Large brand shadow
```

### Typography
```jsx
text-xs   // 12px
text-sm   // 14px
text-base // 16px (default)
text-lg   // 18px
text-xl   // 20px
text-2xl  // 24px
text-3xl  // 30px
text-4xl  // 36px
text-5xl  // 48px
```

### Colors (Theme)
```jsx
text-theme-500      // Theme text color
text-theme-600      // Darker theme text
bg-theme-500        // Theme background
bg-theme-600        // Darker theme bg
border-theme-500    // Theme border
```

### Animations (from globals.css)
```jsx
fade-in          // Fade in
fade-out         // Fade out
fade-in-up       // Fade + slide up
fade-in-down     // Fade + slide down
scale-in         // Scale in
scale-out        // Scale out
slide-in-right   // Slide from right
slide-in-left    // Slide from left
hover-lift       // Lift on hover
hover-scale      // Scale on hover
```

---

## 📱 Responsive Patterns

### Typography
```jsx
text-2xl sm:text-3xl md:text-4xl lg:text-5xl
```

### Spacing
```jsx
px-4 sm:px-6 lg:px-8
py-6 sm:py-8 lg:py-12
```

### Grid
```jsx
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4
```

### Visibility
```jsx
hidden md:block    // Hide on mobile, show on desktop
md:hidden          // Show on mobile, hide on desktop
```

---

## ♿ Accessibility Checklist

```jsx
// ✅ Button with aria-label
<IconButton icon={<Icon />} label="Description" />

// ✅ Form with labels
<label htmlFor="email">Email</label>
<input id="email" type="email" aria-required="true" />

// ✅ Loading states
<div role="status" aria-label="Loading...">
  <Skeleton />
</div>

// ✅ Minimum touch targets (44x44px)
<button className="min-h-[44px] min-w-[44px]">

// ✅ Focus indicators (automatic with globals.css)
// All focusable elements get visible focus rings
```

---

## 🔄 Common Replacements

### Replace Alert
```jsx
// ❌ Before
alert('Success!');

// ✅ After
const { success } = useToast();
success('Success!');
```

### Replace Loading Text
```jsx
// ❌ Before
{loading && <p>Loading...</p>}

// ✅ After
{loading && <SkeletonProductCard />}
```

### Replace Basic Button
```jsx
// ❌ Before
<button className="bg-theme-500 text-white px-4 py-2">
  Click me
</button>

// ✅ After
<Button variant="primary" size="md">
  Click me
</Button>
```

### Replace Hardcoded Spacing
```jsx
// ❌ Before
<div className="gap-[10px] p-[15px]">

// ✅ After
<div className="gap-2 p-4">
```

---

## 📋 Integration Checklist

### Phase 1: Toast Notifications
- [ ] Add ToastProvider to layout.jsx
- [ ] Replace alert() in cart actions
- [ ] Replace alert() in auth flows
- [ ] Replace alert() in form submissions

### Phase 2: Skeleton Loaders
- [ ] Replace product listing loading
- [ ] Replace cart loading states
- [ ] Replace checkout loading states
- [ ] Replace form loading states

### Phase 3: Buttons
- [ ] Replace Add to Cart buttons
- [ ] Replace form submit buttons
- [ ] Replace delete/remove buttons
- [ ] Replace icon-only buttons

### Phase 4: Spacing
- [ ] Find all gap-[*] and replace with gap-{number}
- [ ] Find all p-[*] and replace with p-{number}
- [ ] Find all m-[*] and replace with m-{number}

### Phase 5: Animations
- [ ] Add hover-lift to cards
- [ ] Add hover-scale to images
- [ ] Add fade-in to content
- [ ] Add transitions to modals

---

## 🎯 Quick Wins (Start Here!)

### 1. Add Toast to One Action (5 min)
```jsx
import { useToast } from '@/app/context/toast';

const { success } = useToast();
onClick={() => success('Action completed!')}
```

### 2. Replace One Loading State (10 min)
```jsx
import { SkeletonProductCard } from '@/app/components/atom/Skeleton';

{loading ? <SkeletonProductCard /> : <ProductCard />}
```

### 3. Upgrade One Button (5 min)
```jsx
import Button from '@/app/components/atom/Button';

<Button variant="primary" size="md">Click me</Button>
```

### 4. Add One Hover Effect (2 min)
```jsx
<div className="hover-lift">
  Your content
</div>
```

### 5. Fix One Spacing Issue (2 min)
```jsx
// Change gap-[10px] to gap-2
// Change p-[15px] to p-4
```

---

## 🐛 Common Issues & Fixes

### Issue: Toast not showing
**Fix:** Add ToastProvider to layout.jsx above other providers

### Issue: Skeleton doesn't match content
**Fix:** Use custom className or create new skeleton variant

### Issue: Button looks wrong
**Fix:** Check for conflicting CSS with !important

### Issue: Animation not working
**Fix:** Verify globals.css is imported in root layout

### Issue: Focus ring not visible
**Fix:** Check for CSS overriding :focus-visible

---

## 📚 Documentation Links

- **DESIGN_SYSTEM.md** - Complete design system reference
- **IMPLEMENTATION_GUIDE.md** - Step-by-step integration
- **EXAMPLES.md** - Before/after code examples
- **COMPONENT_AUDIT.md** - Duplicate component analysis
- **UI_UX_IMPROVEMENTS_SUMMARY.md** - Project overview

---

## 🎨 Design Tokens Quick Access

```javascript
import { designTokens } from '@/app/lib/designTokens';

designTokens.spacing.md      // 16px
designTokens.shadows.lg       // Large shadow
designTokens.radius.lg        // 8px border radius
designTokens.animations.duration.base  // 200ms
```

---

## 🔍 Search Commands

### Find old patterns
```bash
# Find hardcoded spacing
grep -r "gap-\[" src/

# Find alert() usage
grep -r "alert(" src/

# Find basic buttons
grep -r "className=\".*bg-theme-500" src/
```

---

## 💡 Pro Tips

1. **Start Small** - Implement one component at a time
2. **Test Immediately** - Verify each change works
3. **Mobile First** - Always test on mobile sizes
4. **Use Docs** - Reference DESIGN_SYSTEM.md when stuck
5. **Follow Patterns** - Copy examples from EXAMPLES.md

---

## 🎉 Expected Results

**After implementing these improvements:**
- ✅ Professional, polished UI
- ✅ Clear user feedback
- ✅ Smooth animations
- ✅ Better accessibility
- ✅ Consistent design
- ✅ Faster development

---

**Print this and keep it next to your desk! 📌**

**Questions?** Check DESIGN_SYSTEM.md or IMPLEMENTATION_GUIDE.md
