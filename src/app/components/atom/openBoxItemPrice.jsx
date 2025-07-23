export default function openBoxItemPrice({ sale_price, original_price }) {
  const price_float = sale_price.toFixed(2);
  const priceSplit = price_float.split(".");

  const oprice_float = original_price.toFixed(2);
  const opriceSplit = oprice_float.split(".");

  return (
    <div className="flex gap-[8px]">
      <div className="relative flex items-start font-bold">
        <div>${priceSplit[0]}</div>{" "}
        <div className="text-[8px] leading-[16px]">{priceSplit[1]}</div>
      </div>
      {original_price > sale_price && (
        <>
          <div className="relative flex items-start font-bold line-through">
            <div>${opriceSplit[0]}</div>{" "}
            <div className="text-[8px] leading-[16px]">{opriceSplit[1]}</div>
          </div>
          <div className="text-red-700">
            Save ${(original_price - sale_price).toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
}
