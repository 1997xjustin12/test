const PageHero = ({ eyebrow, title, subtitle, children }) => (
  <div className="relative overflow-hidden rounded-sm mb-10 px-6 sm:px-10 py-12 border dark:border-white/10">
    <div className="absolute inset-0" style={{background:"linear-gradient(120deg,#1a0600,#3d1208)"}}/>
    <div 
  className="absolute inset-0" 
  style={{
    background: `radial-gradient(ellipse at 75% 50%, var(--theme-primary-950) 40%, transparent 65%)`
  }}
/>
    <div className="relative z-10">
      {eyebrow && <p className="text-xs font-bold uppercase tracking-widest mb-2 text-theme-700">{eyebrow}</p>}
      <h1 className="text-3xl sm:text-4xl font-bold font-oswald uppercase text-white mb-3">{title}</h1>
      {subtitle && <p className="text-theme-100 text-sm sm:text-base max-w-xl leading-relaxed">{subtitle}</p>}
      {children}
    </div>
  </div>
);

export default PageHero;