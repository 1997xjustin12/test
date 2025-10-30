/**
 * ProductCardSkeleton - Skeleton loader that matches ProductCard structure
 */

import { Skeleton } from "./Skeleton";

export function ProductCardSkeleton({ className = '' }) {
  return (
    <div
      className={`flex w-full h-full bg-white overflow-hidden rounded-md border pb-[8px] ${className}`}
      role="status"
      aria-label="Loading product..."
    >
      <div className="w-full">
        {/* Product Image Area */}
        <div className="w-full flex items-center justify-center h-[230px] overflow-hidden relative bg-white">
          <Skeleton variant="rectangular" className="w-full h-full" />
        </div>

        {/* Product Details */}
        <div className="flex flex-col px-[15px] pt-[5px] border-t">
          {/* Product Title - 2 lines */}
          <div className="min-h-[40px] space-y-2 mb-2">
            <Skeleton variant="text" className="w-full h-4" />
            <Skeleton variant="text" className="w-4/5 h-4" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-[5px] mb-2">
            <Skeleton variant="rectangular" className="w-[100px] h-5" />
          </div>

          {/* Brand */}
          <div className="mt-3">
            <Skeleton variant="text" className="w-1/3 h-3" />
          </div>

          {/* Price Section */}
          <div className="mt-3 min-h-[45px] flex items-center">
            <div className="space-y-1">
              <Skeleton variant="text" className="w-32 h-5" />
            </div>
          </div>

          {/* Contact/Found it Cheaper */}
          <div className="my-[5px]">
            <Skeleton variant="text" className="w-48 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
