import CategoryPageClient from "@/app/components/template/CategoryPageClient";
import { STORE_NAME } from "@/app/lib/store_constants";
import { BASE_URL } from "@/app/lib/helpers";

function toTitleCase(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }) {
  const { category_slug } = await params;
  const categoryName = toTitleCase(category_slug);
  const title = `${categoryName} | ${STORE_NAME}`;
  const description = `Shop ${categoryName} at ${STORE_NAME}. Browse our full selection with expert advice, competitive pricing, and free shipping available.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/category/${category_slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/category/${category_slug}`,
      siteName: STORE_NAME,
    },
  };
}

async function page({ params }) {
  const { category_slug } = await params;
  return <CategoryPageClient category_slug={category_slug} />;
}

export default page;
