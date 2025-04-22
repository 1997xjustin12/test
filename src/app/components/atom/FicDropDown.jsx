'use client';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { ICRoundPhone, MDIEmailOutline } from "@/app/components/icons/lib";
import Link from 'next/link';
import { useEffect, useState } from 'react';

function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}


function FicDropDown({children}) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  if (isMobile) {
    return (<Link href="tel:(888) 575-9720" prefetch={false}>{children}</Link>);
  }

  return (
        <Popover>
          <PopoverButton className="block text-sm/6 font-semibold text-dark/50 focus:outline-none data-[active]:text-dark data-[hover]:text-dark data-[focus]:outline-1 data-[focus]:outline-white">
            {children}
          </PopoverButton>
          <PopoverPanel
            transition
            anchor="bottom"
            className="shadow-lg divide-y divide-white/5 rounded bg-white text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
          >
            <div className="px-2 py-2 bg-neutral-200 font-semibold">
                Contact Us
            </div>
            <div className="px-3 py-1">
              <div className="block rounded-lg p-1 transition hover:bg-white/30">
                <Link href="tel:(888) 575-9720" className="flex items-center gap-5 text-dark"><ICRoundPhone />(888) 575-9720</Link>
              </div>
              <div className="block rounded-lg p-1 transition hover:bg-white/30">
                <Link href="mailto:info@OnSiteStorage.com" className="flex items-center gap-5 text-dark"><MDIEmailOutline />Email Us</Link>
              </div>
            </div>
            <div className="px-3 py-1 text-xs">
              <div className="block rounded-lg p-1">
                <p className="font-semibold text-dark underline">Sales</p>
                <div className="flex flex-col gap-1 mt-2">
                  <p className="text-dark/50">Mon-Fri: 5:00am - 5:00pm PST</p>
                  <p className="text-dark/50">Sat and Sun: Closed</p>
                </div>
              </div>
              <div className="block rounded-lg p-1">
                <p className="font-semibold text-dark underline">Support</p>
                <div className="flex flex-col gap-1 mt-2">
                  <p className="text-dark/50">Mon-Fri: 5:00am - 5:00pm PST</p>
                  <p className="text-dark/50">Sat and Sun: Closed</p>
                </div>
              </div>
            </div>
          </PopoverPanel>
        </Popover>
  )
}

export default FicDropDown