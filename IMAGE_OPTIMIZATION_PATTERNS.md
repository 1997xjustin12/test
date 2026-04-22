# Image Optimization Patterns for Core Web Vitals

This file contains recommended patterns for optimizing images throughout the application.

## Pattern 1: Hero/LCP Images (High Priority)

Use for images that appear in the viewport before user interaction:

```jsx
import Image from "next/image";

export default function HeroComponent() {
  return (
    <Image
      src="/images/feature/hero-banner.avif"
      alt="Hero Banner"
      width={1920}
      height={1080}
      priority={true}  // ⚡ Critical for LCP
      className="w-full h-auto"
      quality={85}     // Good quality at smaller size
    />
  );
}
```

## Pattern 2: Below-Fold Product Images (Lazy Loading)

Use for images that load below the fold:

```jsx
import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <Image
      src={product.image}
      alt={product.name}
      width={400}
      height={400}
      loading="lazy"        // ⚡ Lazy load off-screen images
      quality={80}          // Balanced quality
      className="w-full h-auto"
    />
  );
}
```

## Pattern 3: Responsive Images with Sizes

Use when image width changes based on viewport:

```jsx
import Image from "next/image";

export default function ResponsiveImage() {
  return (
    <Image
      src="/images/carousel/slide.avif"
      alt="Carousel"
      width={1200}
      height={600}
      sizes="(max-width: 768px) 100vw,
             (max-width: 1024px) 90vw,
             80vw"             // ⚡ Device-specific sizes
      className="w-full h-auto"
      priority={false}
    />
  );
}
```

## Pattern 4: Background Images (CSS Optimization)

For background images, use CSS with media queries instead of inline styles:

```css
/* In your component's CSS file or Tailwind */
.hero-bg {
  background-image: url('/images/hero-mobile.avif');
  background-size: cover;
  background-position: center;
}

@media (min-width: 768px) {
  .hero-bg {
    background-image: url('/images/hero-desktop.avif');
  }
}
```

## Pattern 5: Image Placeholders (Prevent CLS)

Always provide width/height to prevent layout shift:

```jsx
import Image from "next/image";

export default function CardWithPlaceholder() {
  return (
    <div className="relative w-full aspect-square">
      {/* ⚡ aspect-square maintains 1:1 ratio, preventing CLS */}
      <Image
        src="/images/product.avif"
        alt="Product"
        fill={true}                    // Fill container
        className="object-cover"       // Cover without distortion
        sizes="(max-width: 376px) 100vw,
               (max-width: 768px) 50vw,
               33vw"
      />
    </div>
  );
}
```

## Pattern 6: Conditional Image Loading

Load images based on connection speed:

```jsx
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SmartImage({ src, alt, width, height }) {
  const [effectiveQuality, setEffectiveQuality] = useState(85);

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      switch (connection.effectiveType) {
        case '4g':
          setEffectiveQuality(90);  // High quality
          break;
        case '3g':
          setEffectiveQuality(75);  // Medium quality
          break;
        default:
          setEffectiveQuality(60);  // Low quality
      }
    }
  }, []);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={effectiveQuality}
      className="w-full h-auto"
    />
  );
}
```

## Places to Apply These Patterns

### 1. **Home Page** (`src/app/(market)/page.jsx`)
   - Apply Pattern 1 to hero/feature images
   - Apply Pattern 2 to carousel items (lazy load non-visible slides)
   - Apply Pattern 3 to responsive sections

### 2. **Product Cards**
   - Apply Pattern 2 (lazy loading)
   - Apply Pattern 5 (prevent CLS with aspect ratio)

### 3. **Navigation/Headers**
   - Already improved in `fixed_header.jsx`
   - Keep favicon caching enabled

### 4. **Product Detail Pages**
   - Apply Pattern 1 to main product image (priority)
   - Apply Pattern 2 to gallery images (lazy load)

## Image Format Priority

The system now serves images in this order (best to smallest):
1. **AVIF** - Modern format, 30-50% smaller than WebP
2. **WebP** - Universal modern format, 25-30% smaller than JPEG
3. **JPEG/PNG** - Fallback for older browsers

Configure in `next.config.ts`:
```typescript
images: {
  formats: ["image/avif", "image/webp"],
}
```

## Monitoring Image Performance

After implementing these patterns:

1. **Check LCP image** in PageSpeed Insights
   - Should be under 2.5 seconds
   - Should be identified correctly

2. **Check CLS from images** in Core Web Vitals
   - Should have minimal layout shifts
   - All images should have dimensions

3. **Check page size**
   - Monitor if images are being properly optimized
   - Run `npm run build` and check image sizes

## Common Mistakes to Avoid

❌ **Wrong: No dimensions**
```jsx
<Image src="/img.jpg" alt="img" />  // NO!
```

✅ **Right: Always set width/height**
```jsx
<Image src="/img.jpg" alt="img" width={400} height={400} />
```

❌ **Wrong: Loading all carousel images immediately**
```jsx
{slides.map(slide => <Image src={slide} priority />)}  // NO!
```

✅ **Right: Priority only for visible images**
```jsx
{slides.map((slide, i) => (
  <Image src={slide} priority={i === 0} />
))}
```

## Implementation Timeline

1. **Week 1**: Apply Pattern 1 & 5 to home page hero images
2. **Week 2**: Apply Pattern 2 to product listings  
3. **Week 3**: Apply Pattern 3 to responsive sections
4. **Week 4**: Audit remaining pages and apply patterns
5. **Ongoing**: Monitor metrics and maintain quality
