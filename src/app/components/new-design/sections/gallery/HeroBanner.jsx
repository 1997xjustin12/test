import React from 'react'

function HeroBanner() {
  return (
    <div className="relative h-52 sm:h-64 bg-neutral-950 overflow-hidden flex items-center">
      {/* BG illustration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-orange-900/60 to-transparent"/>
        <div className="absolute bottom-0 right-1/4 w-64 h-32 bg-orange-600 rounded-full blur-3xl opacity-20"/>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3">
          <a href="#" className="hover:text-neutral-300 transition-colors">Home</a>
          <span>/</span>
          <span className="text-neutral-300">Fireplaces</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{fontFamily:"Georgia, serif"}}>Fireplaces</h1>
        <p className="text-sm text-neutral-400 max-w-md">Shop premium gas, electric & wood-burning fireplaces from the industry's top brands.</p>
      </div>
    </div>
  );}

export default HeroBanner