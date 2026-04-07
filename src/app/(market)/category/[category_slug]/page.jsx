import CategoryPageClient from "@/app/components/template/CategoryPageClient";
async function page({ params }) {
  const { category_slug } = await params;
  return <CategoryPageClient category_slug={category_slug} />;
}

export default page;
