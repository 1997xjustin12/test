# Component Audit & Consolidation Plan

## Overview

This document identifies duplicate and versioned components that should be consolidated for better maintainability and consistency.

---

## 🔴 High Priority - Duplicate Components

### 1. Menu Updater Components (Admin)

**Files:**
- `/src/app/components/admin/MenuUpdater.jsx`
- `/src/app/components/admin/MenuUpdaterV2.jsx`
- `/src/app/components/admin/MenuUpdaterV3.jsx` ✅ **KEEP THIS**
- `/src/app/components/admin/MenuUpdaterCreate.jsx`
- `/src/app/components/admin/MenuUpdaterCreateV2.jsx`
- `/src/app/components/admin/MenuUpdaterBuilderItem.jsx`
- `/src/app/components/admin/MenuUpdaterBuilderItemV2.jsx`
- `/src/app/components/admin/MenuUpdaterBuilderItemV3.jsx` ✅ **KEEP THIS**

**Recommendation:**
1. **Keep V3 versions** (latest, most feature-complete)
2. **Deprecate V1 and V2** - Update all imports to V3
3. **Create migration script** to update references
4. **Remove old versions** after migration

**Action Items:**
- [ ] Verify V3 components have all features from V1 and V2
- [ ] Search codebase for all imports of V1/V2
- [ ] Update imports to V3
- [ ] Test admin menu functionality
- [ ] Delete V1 and V2 files

---

### 2. Navigation Bar Components

**Files:**
- `/src/app/components/template/tui_navbar.jsx`
- `/src/app/components/template/tui_navbarV2.jsx`
- `/src/app/components/template/tui_navbarV3.jsx` ✅ **KEEP THIS**

**Recommendation:**
1. **Keep V3** (should be in production use)
2. **Verify layout.jsx uses V3**
3. **Remove V1 and V2**

**Action Items:**
- [ ] Check which version is imported in layout.jsx
- [ ] If using V3, delete V1 and V2
- [ ] If using older version, test V3 and migrate

---

### 3. Product Card Components ⚠️ CRITICAL

**Files:**
- `/src/app/components/atom/ProductCard.jsx` ✅ **KEEP - Main version**
- `/src/app/components/atom/ProductCard3.jsx` ❓ **Investigate purpose**
- `/src/app/components/atom/ProductCardV2.jsx` ❌ **Deprecate**
- `/src/app/components/brand/ProductCard.jsx` ❓ **Brand-specific variant?**

**Supporting Components:**
- `/src/app/components/atom/ProductCardLoader.jsx`
- `/src/app/components/atom/ProductCardBrandDisplay.jsx`
- `/src/app/components/atom/ProductCardToCart.jsx`
- `/src/app/components/atom/ProductCardPriceDisplay.jsx`
- `/src/app/components/atom/productCardOnsaleTag.jsx`

**Recommendation:**
1. **Audit usage** - Which versions are actively used?
2. **Consolidate to ONE main ProductCard** with variants prop
3. **Keep brand-specific version** if it has unique features
4. **Replace ProductCard3 and ProductCardV2** with main version

**Proposed New Structure:**
```jsx
// Main component with variants
<ProductCard
  variant="default" // or "compact", "featured", "brand"
  product={product}
/>
```

**Action Items:**
- [ ] Grep codebase for all ProductCard imports
- [ ] Document differences between versions
- [ ] Create single unified ProductCard with variant support
- [ ] Migrate all usages
- [ ] Update SkeletonProductCard to match

---

### 4. Media Gallery Components

**Files:**
- `/src/app/components/widget/MediaGallery.jsx`
- `/src/app/components/widget/MediaGalleryV2.jsx` ✅ **KEEP THIS**

**Recommendation:**
1. **Keep V2** (likely has improvements)
2. **Verify product detail page uses V2**
3. **Remove V1**

**Action Items:**
- [ ] Check product detail page imports
- [ ] Test V2 functionality (zoom, thumbnails, mobile)
- [ ] Remove V1 after verification

---

### 5. Home Search Components

**Files:**
- `/src/app/components/search/HomeSearch.jsx`
- `/src/app/components/search/HomeSearchV1.jsx`
- `/src/app/components/search/HomeSearchV2.jsx`
- `/src/app/components/search/HomeSearchMobile.jsx`

**Recommendation:**
1. **Consolidate into ONE responsive component**
2. Use Tailwind responsive utilities instead of separate mobile component

**Proposed Structure:**
```jsx
// Single responsive search component
<HomeSearch
  className="hidden md:block" // Desktop
/>
<HomeSearch
  variant="mobile"
  className="md:hidden" // Mobile
/>
```

**Action Items:**
- [ ] Audit differences between versions
- [ ] Create single responsive HomeSearch
- [ ] Test on all breakpoints
- [ ] Remove versioned files

---

### 6. Other Versioned Components

**Files:**
- `/src/app/components/atom/FilterSelectItemv2.jsx` (note: lowercase 'v')
- `/src/app/components/widget/ProductToCartV2.jsx`

**Recommendation:**
1. **Investigate usage and purpose**
2. **Consolidate if possible**
3. **Fix naming inconsistency** (v2 vs V2)

---

## 🟡 Medium Priority - Component Organization

### Atom vs Molecule Misclassification

Some "atom" components are actually complex composites:

**Should be Molecules:**
- `ProductCard.jsx` (composite of multiple atoms)
- `CheckoutForm.jsx` (complex form with multiple inputs)
- `RichEditor.jsx` (complex widget)

**Should be Atoms:**
- Simple, single-purpose components only

**Action Items:**
- [ ] Review atomic design hierarchy
- [ ] Move misclassified components
- [ ] Update imports across codebase

---

## 🟢 Low Priority - Naming Conventions

### Inconsistent Naming

**Files with inconsistent casing:**
- `productCardOnsaleTag.jsx` → Should be `ProductCardOnsaleTag.jsx`
- `tui_navbar.jsx` → Should be `TuiNavbar.jsx`
- `fixed_header.jsx` → Should be `FixedHeader.jsx`

**Action Items:**
- [ ] Standardize all component filenames to PascalCase
- [ ] Update all imports
- [ ] Update git history with proper renames

---

## Migration Strategy

### Phase 1: Documentation (CURRENT)
- ✅ Document all duplicate components
- ✅ Identify latest versions
- ✅ Create this audit document

### Phase 2: Usage Analysis (NEXT)
```bash
# Find all imports of duplicate components
grep -r "MenuUpdaterV2" src/
grep -r "ProductCardV2" src/
grep -r "tui_navbarV2" src/
```

### Phase 3: Consolidation
1. **Week 1:** Admin components (MenuUpdater, etc.)
2. **Week 2:** ProductCard consolidation
3. **Week 3:** Navigation and search components
4. **Week 4:** Miscellaneous cleanup

### Phase 4: Cleanup
1. Delete deprecated files
2. Update documentation
3. Run full test suite
4. Deploy to staging

---

## Grep Commands for Analysis

Run these commands to find component usage:

```bash
# Menu components
grep -r "import.*MenuUpdater" src/ --include="*.jsx" --include="*.js"
grep -r "import.*MenuUpdaterV2" src/ --include="*.jsx" --include="*.js"

# Product cards
grep -r "import.*ProductCard" src/ --include="*.jsx" --include="*.js"

# Navigation
grep -r "import.*tui_navbar" src/ --include="*.jsx" --include="*.js"

# Search
grep -r "import.*HomeSearch" src/ --include="*.jsx" --include="*.js"
```

---

## Testing Checklist

Before removing any component:

- [ ] Run development server
- [ ] Test affected pages
- [ ] Check console for errors
- [ ] Test on mobile devices
- [ ] Test admin panel functionality
- [ ] Run build: `npm run build`
- [ ] Check for TypeScript/lint errors

---

## Benefits of Consolidation

### Before:
- 3+ versions of same component
- Unclear which version to use
- Duplicated code and maintenance
- Larger bundle size
- Inconsistent behavior

### After:
- Single source of truth
- Clear component API
- Easier maintenance
- Smaller bundle size
- Consistent UX

---

## Recommended Component Structure Going Forward

```
/components
  /atom           - Single-purpose, reusable (Button, Input, Badge)
  /molecule       - Composite components (ProductCard, SearchBar)
  /organism       - Complex sections (ProductGrid, Navbar)
  /template       - Page layouts (PageTemplate, AuthLayout)
  /pages          - Full page components
```

**Rules:**
1. **No versioned components** - Update in place or use feature flags
2. **PascalCase naming** for all component files
3. **One component per concern** - Use composition
4. **Variants over duplicates** - Use props for variations

```jsx
// ✅ Good - Single component with variants
<ProductCard variant="compact" />
<ProductCard variant="featured" />

// ❌ Bad - Multiple components
<ProductCardCompact />
<ProductCardFeatured />
```

---

## Next Steps

1. **Run grep commands** to analyze component usage
2. **Create migration branches** for each component group
3. **Test thoroughly** on staging environment
4. **Document breaking changes** if any
5. **Update this document** as consolidation progresses

---

**Status:** 📋 AUDIT COMPLETE - READY FOR CONSOLIDATION
**Created:** 2025-10-29
**Priority:** HIGH - Should be addressed before major feature work
