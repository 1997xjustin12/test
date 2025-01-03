'use client'
import { Icon } from "@iconify/react/dist/iconify.js";
import { Rating } from "@smastrom/react-rating";
import Link from "next/link";
import {useState,useEffect} from "react";
type Product = {
    id: number;
    name: string;
    description: string;
    description_html: string;
    price: string;
    url:string;
    like:Boolean,
    likes: number;
    ratings:number;
    sku:string;
    sales_tag:string;
    category:[];
  };

  
const RelatedProductCard = ({ product }: { product: Product }) => {
    const [productImages, setProductImages] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await fetch(`/api/product_images?${product?.id}`);
            const data = await response.json();
            setProductImages(data.data || []);
          } catch (error) {
            console.error('Error fetching products:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchProducts();
      }, []);

    // const [liked, setLiked] = useState(false);
    const [product_data, setProductData] = useState(product);
    const handleHeartButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setProductData(prev=> ({...prev, like: !prev.like}))
    }

    const handleRatingChange = () => {
        // no functionality yet
    }

    return <Link href={`/product/${product_data.id}`} className="flex w-full"><div className="overflow-hidden rounded-md border w-full">
    <div className="w-full flex items-center justify-center h-[230px] overflow-hidden bg-white relative">
        <img src="https://m.media-amazon.com/images/I/713yemIsaPL._AC_SX679_.jpg" alt="" className="object-contain h-full" />
        <div className="absolute top-[10px] right-[10px]">
            <button className={`flex justify-center items-center w-[36px] h-[36px] rounded-full ${product_data.like? 'bg-pallete-orange':'bg-stone-400'}`} onClick={handleHeartButtonClick}>
                <Icon icon="teenyicons:heart-outline" className="text-white text-[20px]" />
            </button>
        </div>
        {
            product_data.sales_tag === "ON SALE" && <div className="absolute bottom-[60px] left-0 rounded-r-full bg-pallete-orange text-white text-[12px] font-bold py-[7px] px-[15px]">ONSALE</div>
        }
        <div className="absolute bottom-0 left-0 bg-pallete-green text-white text-[12px] font-semibold py-[7px] px-[15px] flex items-center w-full justify-center gap-[5px]">
            <div>
                <Icon icon="mi:shopping-cart-add" className="text-lg" />
            </div>
            <div>CUSTOMIZE TO PURCHASE</div>
        </div>
    </div>
    <div className="flex flex-col gap-[15px] p-[20px]">
        <div>Starting at <span className="text-pallete-green font-bold text-[20px]">${parseFloat(product_data.price).toFixed(2)}</span></div>
        <div className="flex h-[80px]  my-[15px]">
            <div className="font-bold text-[18px]">
                {product_data.name}
            </div>
        </div>
        <div className="flex flex-col gap-[5px]">
            <div className="flex items-center gap-[5px]">
                <div>
                    <Rating value={product_data.ratings} style={{ maxWidth: 80 }}></Rating>
                </div>
                <div className="text-[12px]">
                    ({product_data.ratings})
                    (id:{product_data.id})
                </div>
            </div>
            <div className="text-pallete-gray text-[12px]">SKU: {product_data.sku}</div>
        </div>
        <div className="flex items-center justify-between   ">
            <div className="flex items-center font-bold gap-[3px]">
                <div>
                    <Icon icon="lucide:circle-check-big" className="text-pallete-green" />
                </div>
                <div className="text-[14px]">
                    <span className="text-pallete-green">FREE</span> Shipping
                </div>
            </div>
            <div className="flex items-center font-bold gap-[3px]">
                <div>
                    <Icon icon="lucide:circle-check-big" className="text-pallete-green" />
                </div>
                <div className="text-[14px]">
                    Quick Ship Available
                </div>
            </div>
        </div>
    </div>
</div>
</Link>
}

export default RelatedProductCard;