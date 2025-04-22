import Hero from "@/app/components/brand/Hero"
import TopSelling from "@/app/components/brand/TopSelling"
import About from "@/app/components/brand/About"
import Extra from "@/app/components/brand/Extra"
import Sale from "@/app/components/brand/Sale"
// import Review from "@/app/components/brand/Review"
import AtBrand from "@/app/components/brand/AtBrand"
async function GrandeurPage() {
  return (
    <main>
      <Hero />
      <TopSelling />
      <About />
      <Extra />
      <Sale />
      <AtBrand />
    </main>
  );
}

export default GrandeurPage;
