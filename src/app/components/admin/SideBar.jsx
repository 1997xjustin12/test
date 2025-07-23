"use client"
import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebar_items = [
  {name: "Favicon and Logo", url: "/admin/favicon-and-logo", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5v-4.58l.99.99l4-4l4 4l4-3.99L19 12.43zm0-9.41l-1.01-1.01l-4 4.01l-4-4l-4 4l-.99-1V5h14z"/></svg>},
  {name: "Theme Color", url: "/admin/theme-color", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5c0 .12.05.23.13.33c.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22m0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 0 0-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 0 1 2.5-2.5H16c2.21 0 4-1.79 4-4c0-3.86-3.59-7-8-7"/><circle cx="6.5" cy="11.5" r="1.5" fill="currentColor"/><circle cx="9.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="14.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="17.5" cy="11.5" r="1.5" fill="currentColor"/></svg>},
  {name: "FAQs Updater", url: "/admin/faqs-updater", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 18H6l-4 4V4c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v7h-2V4H4v12h8zm11-3.66l-1.41-1.41l-4.24 4.24l-2.12-2.12l-1.41 1.41L17.34 20z"/></svg>},
  {name: "Menu Builder", url: "/admin/menu-builder", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 5v14H5V5zm1.1-2H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9M11 7h6v2h-6zm0 4h6v2h-6zm0 4h6v2h-6zM7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7z"/></svg>},
];
function SideBar() {
  const pathName = usePathname();
  return (<nav aria-label="Sidebar with multi-level dropdown example" className="w-64 fixed bg-white *:inset-y-0 left-0 z-20 flex h-full shrink-0 flex-col border-r border-gray-200 pt-16 duration-75 dark:border-gray-700 sm:flex lg:flex" id="sidebar">
      <ul>
        {
          sidebar_items.map((item, index)=> <li key={`admin-nav-item-${index}`}>
            <Link
            prefetch={false}
            href={item?.url}
            className={`flex items-center gap-[10px] px-[20px] py-[10px] hover:bg-indigo-50 ${pathName === item?.url ? "bg-indigo-100 text-indigo-800":""}`}
            >
            {
              item?.icon
            }
            <span className="font-medium">{ item?.name }</span>
            </Link>
          </li>)
        }
      </ul>
  </nav>
)
}

export default SideBar