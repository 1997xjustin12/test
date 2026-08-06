import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import BBQCart from "@/app/components/bbq-design/page/Cart";
import OKOCart from "@/app/components/oko-design/page/Cart";
import Cart from "@/app/components/new-design/page/Cart";
import { pageMetadata } from "@/app/lib/page-seo";

export const generateMetadata = () => pageMetadata("/cart");

const CartPage = () => {
  if (ISOKO) return <OKOCart />;
  return ISBBQ ? <BBQCart /> : <Cart />;
};

export default CartPage;
