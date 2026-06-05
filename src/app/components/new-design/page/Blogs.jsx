import React from 'react'
import he from "he";

import Paginator from '@/app/components/new-design/sections/blog/Paginator';

function Blogs({postsWithImages=[], totalPages=1, page=1}) {
 return (
     <section className="bg-gray-50 dark:bg-gray-950 py-10 md:py-14 antialiased">
       <div className="mx-auto max-w-screen-lg px-4 2xl:px-0">
         <div className="mb-8 md:mb-10">
           <span className="inline-block text-xs font-semibold uppercase tracking-widest text-theme-600 mb-2">
             Our Blog
           </span>
           <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
             Latest Articles
           </h2>
         </div>
 
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {postsWithImages.length > 0 ? (
             postsWithImages.map((post) => (
               <article
                 key={post.id}
                 className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden transition-shadow duration-200 flex flex-col"
               >
                 <a href={`/blogs/${post.slug}`} className="block overflow-hidden">
                   <img
                     src={post.featuredImage}
                     alt={he.decode(post.title.rendered)}
                     title={he.decode(post.title.rendered)}
                     className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                   />
                 </a>
                 <div className="p-5 flex flex-col flex-1">
                   <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                     <a
                       href={`/blogs/${post.slug}`}
                       className="hover:text-theme-600 transition-colors line-clamp-2"
                       title={he.decode(post.title.rendered)}
                     >
                       {he.decode(post.title.rendered)}
                     </a>
                   </h3>
                   <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-3 flex-1">
                     {he.decode(post.excerpt.rendered.replace(/<[^>]*>?/gm, ""))}
                   </p>
                   <a
                     href={`/blogs/${post.slug}`}
                     className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-theme-600 hover:text-theme-700 transition-colors"
                     title={he.decode(post.title.rendered)}
                   >
                     Read more
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                     </svg>
                   </a>
                 </div>
               </article>
             ))
           ) : (
             <p className="text-gray-500 col-span-full">No blog posts available.</p>
           )}
         </div>
 
         <Paginator total_pages={totalPages} current_page={page} />
       </div>
     </section>
   );
}

export default Blogs