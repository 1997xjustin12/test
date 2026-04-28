import Image from "next/image";

// Server component — Next.js injects <link rel="preload"> for this image
// in the initial HTML, fixing LCP request discovery.
export default function HeroBackground() {
  return (
    <Image
      src="/images/banner/home-banner-202509.webp"
      alt=""
      aria-hidden="true"
      fill
      priority
      fetchPriority="high"
      sizes="100vw"
      className="object-cover"
      quality={55}
    />
  );
}
