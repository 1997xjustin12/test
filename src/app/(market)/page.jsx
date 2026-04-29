import HeroBackground from "@/app/components/new-design/sections/HeroBackground";
import NewHomePage from "@/app/components/new-design/page/HomePage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return <NewHomePage heroBg={<HeroBackground />} />;
}
