import React from 'react';
import Link from 'next/link';

function generateBreadcrumbs(node, targetUrl) {
  const currentCrumb = { name: node.name, url: node.url };

  if (node.url === targetUrl) {
    return [currentCrumb];
  }

  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      if (typeof child === 'string') continue;

      const path = generateBreadcrumbs(child, targetUrl);
      
      if (path) {
        return [currentCrumb, ...path];
      }
    }
  }

  return null;
}


function HeroBanner({config}) {
  const breadcrumbs = generateBreadcrumbs(config?.root, config?.url);
  
  return (
    <div className="bg-oko-cream-dim dark:bg-oko-night-2 border-b border-oko-stone-line dark:border-oko-line-dark">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8 py-10 sm:py-12 w-full">
        {/* Breadcrumb (spec §9) — 12px stone, "/" separators, current in char-soft */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-5 font-inter text-[12px]">
          <Link
            href="/"
            className="text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
          >
            Home
          </Link>
          {!!breadcrumbs && breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.url}>
                <span className="text-oko-stone-line dark:text-oko-line-dark" aria-hidden="true">/</span>
                {index === breadcrumbs.length - 1 ? (
                    <span className="text-oko-char-soft dark:text-oko-ondark font-medium">{crumb.name}</span>
                ) : (
                    <Link
                    href={`/${crumb.url}`}
                    className="text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
                    >
                    {crumb.name}
                    </Link>
                )}
                </React.Fragment>
            ))}
        </nav>
        <h1 className="font-oko-display font-semibold text-[clamp(26px,5vw,42px)] leading-[1.12] text-oko-char dark:text-oko-cream">{breadcrumbs?.[breadcrumbs.length - 1]?.name}</h1>
      </div>
    </div>
  );}

export default HeroBanner