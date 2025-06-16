import {useMemo} from "react";
import { useCompareProducts } from "@/app/context/compare_product";

function ProductCardCompareButton({product}) {
    const { products, addProduct, removeProduct, setOpenWidget, productsLimit } = useCompareProducts();

    const handleButtonClick = (e) => {  
        e.preventDefault();
        e.stopPropagation();
        setOpenWidget(true);

        if(!exists){
            if(products.length < productsLimit){
                addProduct(product);
            }else{
                alert("Compare product limit is maxed out.")
            }
        }else{
            removeProduct(product);
        }
    }

    const exists = useMemo(() => {
        return Boolean(products.find(({ variants }) => variants?.[0]?.sku === product?.variants?.[0]?.sku));
    }, [products, product]);

    return (
    <button onClick={handleButtonClick} className={`${exists ? "bg-neutral-300":"bg-white"} border rounded flex justify-center items-center p-1 hover:shadow   hover:bg-neutral-50`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20"><path fill="currentColor" d="M12.146 3.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L14.293 7H4.5a.5.5 0 0 1 0-1h9.793l-2.147-2.146a.5.5 0 0 1 0-.708m-4.292 7a.5.5 0 0 1 0 .708L5.707 13H15.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0"/></svg></button>
  )
}

export default ProductCardCompareButton

// fluent:arrow-swap-20-regular