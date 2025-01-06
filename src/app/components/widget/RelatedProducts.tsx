'use client'
import RelatedProductCard from "../product/card/RelatedProduct";
import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
type Product = {
    id: string | number;
    name: string;
    description: string;
    description_html: string;
    price: string;
    url: string;
    like: Boolean,
    likes: number;
    ratings: number;
    sku: string;
    sales_tag: string;
    category: [];
};

const RelatedProducts = ({ product }: { product: any }) => {
    const [products, setProducts] = useState<any | null>(null);
    const productsWrapper = useRef<any>();
    const relatedProductCard = useRef(null);
    const [prevButtonDisabled, setPrevButtonDisabled] = useState(true);
    const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
    const [scrollWidth, setScrollWidth] = useState(0);
    const [scrollIndex, setScrollIndex] = useState(0);
    const [scrollPos, setScrollPos] = useState([]);
    const [scrollPosArray, setScrollPosArray] = useState<any>(null);
    // scroll mechanism varialbles
    const cardWidth = 340;
    const gapWidth = 20;

    useEffect(() => {
        updateProductsWrapperWidth(); // Initial width
        window.addEventListener("resize", updateProductsWrapperWidth); // Update on resize

        return () => {
            window.removeEventListener("resize", updateProductsWrapperWidth); // Cleanup
        };
    }, []);

    useEffect(() => {
        console.log("ScrollWidth", scrollWidth);
    }, [scrollWidth]);

    
    useEffect(() => {
        if(scrollIndex > -1){
            if(scrollPosArray.length > 0){
                setScrollPos(prev => scrollPosArray[scrollIndex]);
            }
        }
    }, [scrollIndex]);


    
    useEffect(() => {
        if(productsWrapper?.current){
            productsWrapper.current.scrollTo({left: scrollPos, behavior:"smooth"});
        }
    }, [scrollPos]);

    const updateProductsWrapperWidth = () => {
        if (productsWrapper.current) {
            const elementWidth = productsWrapper.current.getBoundingClientRect().width;
            setScrollWidth(elementWidth);
        }
    }


    function generatePosArray(start: number, increment: number, length: number) {
        return Array.from({ length }, (_, index) => start + index * increment);
    }


    const handleButtonScroll = (direction: string) => {
        if (products) {
            const childCount = products?.length;
            const calcScrollWidth = (childCount * (cardWidth + gapWidth)) - 20;
            const numberOfProductsVisible = Math.floor(scrollWidth / (cardWidth + gapWidth));
            const scrollGap = (numberOfProductsVisible * (cardWidth + gapWidth));
            const length = Math.floor(calcScrollWidth / scrollGap);
            const secondPos = scrollGap - 50;
            const posArray = generatePosArray(secondPos, scrollGap, length);
            posArray.unshift(0); // insert 0 as the initial scroll position
            setScrollPosArray(posArray);
            setScrollIndex(prev => {
                let newIndex;
                if(direction === 'prev'){
                    newIndex = prev > 0 ? prev-1: 0;
                }else{
                    newIndex = prev >=0 && prev < posArray.length-1 ? prev+1:posArray.length-1;
                }

                let prevDisabled = false;
                let nextDisabled = false;

                if(newIndex === 0){
                    prevDisabled = true;
                }else if(newIndex === posArray.length -1){
                    nextDisabled = true;
                }

                setPrevButtonDisabled(prevDisabled)
                setNextButtonDisabled(nextDisabled)
                return newIndex;
            });


        }
    }


    useEffect(() => {
        if (product) {
            fetch('/data/products.json') // URL relative to the public folder
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => setProducts(data.filter((i: { id: string; }) => parseInt(i.id) !== parseInt(product?.id))))
                .catch((error) => console.error('Error loading products:', error));
        }
    }, [product]);


    return <div className="relative flex flex-col gap-[50px]">

        <div className="font-bold text-[1.5em]">Related Products</div>
        <div ref={productsWrapper} className={`related-products-scroll-wrap w-full flex items-center overflow-y-auto pb-[20px] gap-[${gapWidth}px]`}>
            {/* related product cards display */}
            {
                products && products.map((i: { id: number; name: string; description: string; description_html: string; price: string; url: string; like: Boolean; likes: number; ratings: number; sku: string; sales_tag: string; category: []; }, index: any) =>
                    <div ref={relatedProductCard} key={`related-products-${index}`} className={`w-[${cardWidth}px] min-w-[${cardWidth}px] related-product-card-wrap`}>
                        <RelatedProductCard product={i}></RelatedProductCard>
                    </div>
                )
            }
        </div>

        {/* Navigation Arrows */}
        <button
            disabled={prevButtonDisabled}
            onClick={() => handleButtonScroll('prev')}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full sm:p-3 hover:bg-opacity-75"
        >   
            <Icon icon="mingcute:left-fill" width="24" height="24" />
        </button>
        <button
            disabled={nextButtonDisabled}
            onClick={() => handleButtonScroll('next')}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full sm:p-3 hover:bg-opacity-75"
        >
            <Icon icon="mingcute:right-fill" width="24" height="24" />
        </button>
    </div>
}

export default RelatedProducts;