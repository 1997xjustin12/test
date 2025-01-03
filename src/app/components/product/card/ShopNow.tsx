import { Icon } from "@iconify/react/dist/iconify.js";
const ProductShopNowCard = () => {
    return (
        <div className="w-full rounded-lg border flex overflow-hidden items-center;">
            <div className="w-[155px] overflow-hidden flex justify-center items-center">
                <img src="https://m.media-amazon.com/images/I/713yemIsaPL._AC_SX679_.jpg" alt="" className="object-contain h-full" />
            </div>
            <div className="p-[20px] w-full flex flex-col gap-[20px]">
                <div className="text-[18px]">
                    <div className="font-bold">PROMO</div>
                    <div>DESCRIPTION HERE</div>
                </div>
                <div>
                    <a href="#" className="flex items-center gap-[10px]">
                        <div className="font-bold">Shop now</div>
                        <div>
                            <Icon icon="icons8:right-round" className="text-pallete-orange text-[1.5em]"/>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default ProductShopNowCard;