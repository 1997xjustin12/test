import Image from "next/image";
function Nav() {
  return (
    <nav className="container mx-auto">
      <div className="flex gap-[20px] items-center">
        <div className="w-[390px] h-[150px] p-3 flex items-center justify-center relative">
          <Image
            src="/images/grandeur/grandeur-logo-1.webp"
            alt="Grandeur Logo"
            fill
            className="object-contain"
          />
        </div>
        <div className="w-full pb-[10px] relative before:absolute before:bottom-0 before:left-0 before:w-full before:h-[8px] before:bg-gradient-to-l before:from-gray-300 before:to-gray-900">
          <ul className="flex justify-between uppercase font-medium text-stone-700">
            <li>bbq grills and smokers</li>
            <li>outdoot kitchen</li>
            <li>sale</li>
            <li>customer support</li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
