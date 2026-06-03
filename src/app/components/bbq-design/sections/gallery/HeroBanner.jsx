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
    <div className="relative min-h-[256px] bg-char overflow-hidden flex items-center">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-ember-deep/40 to-transparent"/>
        <div className="absolute bottom-0 right-1/4 w-64 h-32 bg-ember rounded-full blur-3xl opacity-20"/>
      </div>
      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 w-full">
        <nav className="flex items-center gap-1.5 text-xs text-ash/40 mb-3">
          <Link href="/" className="hover:text-ash transition-colors">Home</Link>
          {!!breadcrumbs && breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.url}>
                <span>❯</span>
                {index === breadcrumbs.length - 1 ? (
                    <span className="text-ash">{crumb.name}</span>
                ) : (
                    <Link
                    href={`/${crumb.url}`}
                    className="hover:text-ash transition-colors"
                    >
                    {crumb.name}
                    </Link>
                )}
                </React.Fragment>
            ))}
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 uppercase font-oswald">{breadcrumbs?.[breadcrumbs.length - 1]?.name}</h1>
      </div>
    </div>
  );}

export default HeroBanner