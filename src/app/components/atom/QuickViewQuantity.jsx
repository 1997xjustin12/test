"use client";
function QuickViewQuantity({ quantity, onQuantityChange }) {
  const handleChange = (increment) => {
    let newCount = 0;
    if (increment) {
      newCount = quantity + 1;
    } else {
      newCount = quantity === 1 ? quantity : quantity - 1;
    }
    onQuantityChange(newCount);
  };
  return (
    <div className="flex items-center">
      <button
        onClick={() => handleChange(false)}
        type="button"
        id="decrement-button"
        data-input-counter-decrement="counter-input"
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
      >
        <svg
          className="h-2.5 w-2.5 text-gray-900 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 2"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h16"
          />
        </svg>
      </button>
      <input
        readOnly
        min={1}
        type="text"
        id="counter-input"
        data-input-counter
        className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
        placeholder=""
        value={quantity}
        required
      />
      <button
        onClick={() => handleChange(true)}
        type="button"
        id="increment-button"
        data-input-counter-increment="counter-input"
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
      >
        <svg
          className="h-2.5 w-2.5 text-gray-900 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 1v16M1 9h16"
          />
        </svg>
      </button>
    </div>
  );
}

export default QuickViewQuantity;
