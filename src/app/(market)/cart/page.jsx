import { ISBBQ } from "@/app/lib/helpers";
import BBQCart from "@/app/components/bbq-design/page/Cart";
import Cart from "@/app/components/new-design/page/Cart";

const CartPage = () => {
  return ISBBQ ? <BBQCart /> : <Cart />;
};

export default CartPage;
