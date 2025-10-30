/**
 * Skeleton Component - Loading State Placeholders
 *
 * Provides visual feedback during content loading with accessible,
 * animated skeleton screens that match your content structure.
 */

export function Skeleton({ className = '', variant = 'rectangular', animation = 'pulse' }) {
  const baseClasses = 'bg-gray-200 animate-pulse';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
    button: 'h-10 rounded-lg',
    avatar: 'w-12 h-12 rounded-full',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: '',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.rectangular} ${animationClasses[animation]} ${className}`}
      role="status"
      aria-label="Loading..."
      aria-live="polite"
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`} role="status" aria-label="Loading text...">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          className={index === lines - 1 ? 'w-4/5' : 'w-full'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`} role="status" aria-label="Loading card...">
      <Skeleton variant="rectangular" className="w-full h-48 mb-4" />
      <Skeleton variant="text" className="w-3/4 mb-2" />
      <Skeleton variant="text" className="w-1/2 mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="w-1/4" />
        <Skeleton variant="button" className="w-1/3" />
      </div>
    </div>
  );
}

export function SkeletonProductCard({ className = '' }) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}
      role="status"
      aria-label="Loading product..."
    >
      {/* Product Image */}
      <Skeleton variant="rectangular" className="w-full aspect-product" />

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        <Skeleton variant="text" className="w-1/3 h-3" />

        {/* Title */}
        <Skeleton variant="text" className="w-full h-4" />
        <Skeleton variant="text" className="w-4/5 h-4" />

        {/* Rating */}
        <div className="flex items-center gap-2">
          <Skeleton variant="rectangular" className="w-24 h-4" />
          <Skeleton variant="text" className="w-12 h-3" />
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <Skeleton variant="text" className="w-20 h-6" />
          <Skeleton variant="text" className="w-16 h-4" />
        </div>

        {/* Add to Cart Button */}
        <Skeleton variant="button" className="w-full h-10" />
      </div>
    </div>
  );
}

export function SkeletonProductGrid({ count = 8, columns = 4, className = '' }) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonProductCard key={index} />
      ))}
    </div>
  );
}

export function SkeletonList({ items = 5, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`} role="status" aria-label="Loading list...">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonHeader({ className = '' }) {
  return (
    <div className={`bg-white border-b border-gray-200 ${className}`} role="status" aria-label="Loading header...">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Skeleton variant="rectangular" className="w-32 h-8" />

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Skeleton variant="text" className="w-20 h-4" />
            <Skeleton variant="text" className="w-20 h-4" />
            <Skeleton variant="text" className="w-20 h-4" />
            <Skeleton variant="text" className="w-20 h-4" />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" className="w-6 h-6" />
            <Skeleton variant="circular" className="w-6 h-6" />
            <Skeleton variant="circular" className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4, className = '' }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`} role="status" aria-label="Loading table...">
      {/* Table Header */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={`header-${index}`} variant="text" className="w-3/4 h-4" />
          ))}
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={`cell-${rowIndex}-${colIndex}`} variant="text" className="w-full h-4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonImage({ aspectRatio = 'aspect-video', className = '' }) {
  return (
    <Skeleton
      variant="rectangular"
      className={`w-full ${aspectRatio} ${className}`}
    />
  );
}

export function SkeletonButton({ className = '' }) {
  return (
    <Skeleton
      variant="button"
      className={`px-6 ${className}`}
    />
  );
}

export function SkeletonBreadcrumb({ items = 3, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} role="status" aria-label="Loading breadcrumb...">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-2">
          <Skeleton variant="text" className="w-20 h-4" />
          {index < items - 1 && <span className="text-gray-400">/</span>}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCheckoutForm({ className = '' }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 space-y-6 ${className}`} role="status" aria-label="Loading checkout form...">
      {/* Section Title */}
      <Skeleton variant="text" className="w-1/3 h-6 mb-4" />

      {/* Form Fields */}
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton variant="text" className="w-24 h-4" />
          <Skeleton variant="rectangular" className="w-full h-11 rounded-lg" />
        </div>
      ))}

      {/* Submit Button */}
      <Skeleton variant="button" className="w-full h-12" />
    </div>
  );
}

// Export all as named exports for convenience
export default Skeleton;
