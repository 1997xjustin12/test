import dynamic from "next/dynamic";
import HeroBackground from "@/app/components/new-design/sections/HeroBackground";

export const revalidate = 86400;

const NewHomePage = dynamic(() => import("@/app/components/new-design/page/HomePage"));

export default async function HomePage() {
  return <NewHomePage heroBg={<HeroBackground />} />;
}
