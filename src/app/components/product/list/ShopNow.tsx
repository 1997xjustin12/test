'use client'
import ProductShopNowCard from "../card/ShopNow";
import {useState, useEffect, useRef} from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
const ProductShopNowList = () => {
    const cardWidth = 340;
    const gapWidth = 20;
    const shopNowItems = [0, 1, 2, 3, 4];
    const cardElement = useRef(null);
    const shopNowWrapper = useRef<any>(null);
    const [scrollWidth, setScrollWidth] = useState(0);
    const [scrollIndex, setScrollIndex] = useState(0);
    const [scrollPos, setScrollPos] = useState([]);
    const [scrollPosArray, setScrollPosArray] = useState<any>([]);
    const [prevButtonDisabled, setPrevButtonDisabled] = useState(true);
    const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
    
    useEffect(() => {
        updateShopNowWrapperWidth(); // Initial width
        window.addEventListener("resize", updateShopNowWrapperWidth); // Update on resize

        return () => {
            window.removeEventListener("resize", updateShopNowWrapperWidth); // Cleanup
        };
    }, []);

    useEffect(() => {
        if(scrollIndex > -1){
            if(scrollPosArray.length > 0){
                setScrollPos(prev => scrollPosArray[scrollIndex]);
            }
        }
    }, [scrollIndex]);


    
    useEffect(() => {
        if(shopNowWrapper?.current){
            shopNowWrapper.current?.scrollTo({left: scrollPos, behavior:"smooth"});
        }
    }, [scrollPos]);

    const updateShopNowWrapperWidth = () => {
        if (shopNowWrapper.current) {
            const elementWidth = shopNowWrapper.current.getBoundingClientRect().width;
            setScrollWidth(elementWidth);
        }
    }


    function generatePosArray(start: number, increment: number, length: number) {
        return Array.from({ length }, (_, index) => start + index * increment);
    }

    const handleButtonScroll = (direction: any) => {
        if (shopNowItems && cardElement?.current) {
            const childCount = shopNowItems.length;
            // console.log("childCount",childCount);
            const calcScrollWidth = (childCount * (cardWidth + gapWidth)) - 20;
            // console.log("calcScrollWidth",calcScrollWidth);
            const numberOfProductsVisible = Math.floor(scrollWidth / (cardWidth + gapWidth));
            // console.log("numberOfProductsVisible",numberOfProductsVisible);
            const scrollGap = (numberOfProductsVisible * (cardWidth + gapWidth));
            // console.log("scrollGap",scrollGap);
            const length = Math.floor(calcScrollWidth / scrollGap);
            const secondPos = scrollGap - 50;
            const posArray = generatePosArray(secondPos, scrollGap, length);
            posArray.unshift(0); // insert 0 as the initial scroll position
            setScrollPosArray(posArray.filter(i=> i <= calcScrollWidth));
            console.log("calcScrollWidth" ,calcScrollWidth)
            console.log("posArray" ,posArray)
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

                console.log(newIndex);
                return newIndex;
            });


        }
    }




    return (
        <div className="w-full">
            <div className="container mx-auto py-[20px]">
                {/* <div className="font-bold text-[1.5em]">Shop Now List</div> */}
                <div className="relative w-full">
                    <div ref={shopNowWrapper} className={`shop-now-scroll-wrap w-full flex items-center overflow-y-auto py-[20px] gap-[${gapWidth}px]`}>
                        {/* related product cards display */}
                        {
                            shopNowItems.map(i =>
                                <div ref={cardElement} key={`related-products-${i}`} className={`w-[${cardWidth}px] shop-now-card-wrap`}>
                                    <ProductShopNowCard />
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
            </div>
        </div>
    )
}


export default ProductShopNowList;