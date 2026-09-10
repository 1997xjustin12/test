import { formatPrice } from "@/app/lib/helpers";

/**
 * Open-box price, with the cents set small above the line.
 *
 * The dollars and cents are split apart for that typographic effect, which is
 * why the value goes through formatPrice first rather than toFixed: toFixed
 * gives "1300.00", so the dollars rendered as $1300 with no thousands
 * separator while every other price on the same page had one.
 */
const splitPrice = (value) => {
  const [dollars, cents = "00"] = formatPrice(value).split(".");
  return { dollars, cents };
};

export default function openBoxItemPrice({ sale_price, original_price }) {
  const sale = splitPrice(sale_price);
  const original = splitPrice(original_price);

  return (
    <div className="flex gap-[8px]">
      <div className="relative flex items-start font-bold">
        <div>${sale.dollars}</div>{" "}
        <div className="text-[8px] leading-[16px]">{sale.cents}</div>
      </div>
      {original_price > sale_price && (
        <>
          <div className="relative flex items-start font-bold line-through">
            <div>${original.dollars}</div>{" "}
            <div className="text-[8px] leading-[16px]">{original.cents}</div>
          </div>
          <div className="text-red-700">
            Save ${formatPrice(original_price - sale_price)}
          </div>
        </>
      )}
    </div>
  );
}
