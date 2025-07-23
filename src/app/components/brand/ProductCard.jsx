import React, { useState } from 'react'
import Image from 'next/image'
import {CartIcon, HeartIcon} from "@/app/components/icons/lib"

const ProductSalePrice = ({price, sale_price}) => {
    return <div className="flex h-[53px]">
        {
            price && sale_price && <>
                {
                    price > sale_price && 
                    <div>
                        <div className="text-lg font-bold text-orange-700">${sale_price.toFixed(2)} <span className="text-base line-through font-normal text-black">${price.toFixed(2)}</span></div>
                        <div className="font-medium text-orange-700">Sale ${(price - sale_price).toFixed(2)}</div>
                    </div>
                }
                {
                    price === sale_price && 
                    <div>
                        <div className="text-lg font-bold text-orange-700">${sale_price.toFixed(2)}</div>
                    </div>
                }
                
            </>
        }
    </div>
}


function ProductCard({product}) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="w-full min-w-[298px] max-w-[298px] overflow-hidden shadow-sm rounded-lg border">
      <div className="relative w-full aspect-1 overflow-hidden">
        <button onClick={()=>{setLiked(prev=> !prev)}} className={`absolute top-[15px] right-[15px] text-black z-10 ${liked ? "text-orange-600": "text-neutral-700"}`}>
          <HeartIcon width={35} height={35}/>
        </button>
        <Image
          src="https://cdn11.bigcommerce.com/s-3qyvevattr/products/10444/images/20251/Snip2023-10-2308.30.45__12325.1743040008.386.513.jpg?c=1"
          alt="Product image"
          fill
          className="object-cover"
        />
      </div>
      <div className="p-5 flex flex-col gap-[10px]">
        <div className="px-2 pb-1">
          <button className="w-full p-2 rounded-full border-2 border-orange-600 text-orange-600 hover:border-orange-500 hover:text-orange-500">Quick View</button>
        </div>
        <div title={product?.name} className="line-clamp-3 font-medium">{product?.name}</div>
        <ProductSalePrice price={product?.price} sale_price={product?.sale_price}/>
        <button className="text-white bg-orange-600 font-bold w-full p-2 uppercase flex gap-[10px] justify-center hover:bg-orange-500">
            <span>Add to Cart</span>
            <CartIcon />
        </button>
      </div>
    </div>
  )
}

export default ProductCard