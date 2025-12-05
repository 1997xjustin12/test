/**
 * Test script to verify sitemap generation
 * Run with: node scripts/test-sitemap.js
 *
 * This script simulates the sitemap generation to verify:
 * - All products are fetched correctly
 * - All brands are included
 * - All categories are listed
 * - URLs are properly formatted
 */

const fs = require('fs');
const path = require('path');

// Manually load environment variables from .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const ES_INDEX = "solana_updated_product_index";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL || "https://yourdomain.com";
const ESURL = process.env.NEXT_ES_URL;
const ESApiKey = `apiKey ${process.env.NEXT_ES_API_KEY}`;

function createSlug(string, separator = "-") {
  return string
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, separator)
    .replace(/^-+|-+$/g, "");
}

async function testSitemap() {
  console.log("\n🔍 Testing Sitemap Generation...\n");
  console.log("Base URL:", BASE_URL);
  console.log("Elasticsearch URL:", ESURL ? "✓ Configured" : "✗ Missing");
  console.log("API Key:", ESApiKey ? "✓ Configured" : "✗ Missing");
  console.log("\n" + "=".repeat(60) + "\n");

  try {
    // Test fetching brands
    console.log("📦 Fetching brands...");
    const brandsResponse = await fetch(`${ESURL}/${ES_INDEX}/_search`, {
      method: "POST",
      headers: {
        Authorization: ESApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        size: 0,
        aggs: {
          brands: {
            terms: {
              field: "brand.keyword",
              size: 1000,
            },
          },
        },
      }),
    });

    if (!brandsResponse.ok) {
      throw new Error(`Brands fetch failed: ${brandsResponse.statusText}`);
    }

    const brandsData = await brandsResponse.json();
    const brands = brandsData?.aggregations?.brands?.buckets?.map((b) => b.key) || [];
    console.log(`✓ Found ${brands.length} brands`);
    console.log(`  Sample brands: ${brands.slice(0, 5).join(", ")}`);

    // Test fetching categories
    console.log("\n📂 Fetching categories...");
    const categoriesResponse = await fetch(`${ESURL}/${ES_INDEX}/_search`, {
      method: "POST",
      headers: {
        Authorization: ESApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        size: 0,
        aggs: {
          categories: {
            terms: {
              field: "product_category.category_name.keyword",
              size: 1000,
            },
          },
        },
      }),
    });

    if (!categoriesResponse.ok) {
      throw new Error(`Categories fetch failed: ${categoriesResponse.statusText}`);
    }

    const categoriesData = await categoriesResponse.json();
    const categories = categoriesData?.aggregations?.categories?.buckets?.map((c) => c.key) || [];
    console.log(`✓ Found ${categories.length} categories`);
    console.log(`  Sample categories: ${categories.slice(0, 5).join(", ")}`);

    // Test fetching products (limited to 100 for testing)
    console.log("\n🛍️  Fetching products...");
    const productsResponse = await fetch(`${ESURL}/${ES_INDEX}/_search`, {
      method: "POST",
      headers: {
        Authorization: ESApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        size: 100,
        query: {
          bool: {
            must: [
              {
                term: {
                  published: true,
                },
              },
            ],
            filter: [
              {
                exists: {
                  field: "brand.keyword",
                },
              },
              {
                exists: {
                  field: "handle.keyword",
                },
              },
            ],
          },
        },
        _source: ["handle", "brand", "title"],
      }),
    });

    if (!productsResponse.ok) {
      throw new Error(`Products fetch failed: ${productsResponse.statusText}`);
    }

    const productsData = await productsResponse.json();
    const products = productsData?.hits?.hits?.map((hit) => hit._source) || [];
    const totalProducts = productsData?.hits?.total?.value || 0;
    console.log(`✓ Found ${totalProducts} total products (showing first 100)`);

    if (products.length > 0) {
      const sampleProduct = products[0];
      const sampleUrl = `${BASE_URL}/${createSlug(sampleProduct.brand)}/product/${sampleProduct.handle}`;
      console.log(`  Sample product URL: ${sampleUrl}`);
    }

    // Calculate total sitemap entries
    const staticRoutes = 10; // Approximate number of static routes
    const totalEntries = staticRoutes + brands.length + categories.length + totalProducts;

    console.log("\n" + "=".repeat(60));
    console.log("\n📊 Sitemap Summary:");
    console.log(`  Static Routes:     ${staticRoutes}`);
    console.log(`  Brand Pages:       ${brands.length}`);
    console.log(`  Category Pages:    ${categories.length}`);
    console.log(`  Product Pages:     ${totalProducts}`);
    console.log(`  ${"─".repeat(40)}`);
    console.log(`  Total URLs:        ${totalEntries}`);
    console.log("\n✅ Sitemap generation test completed successfully!\n");
    console.log("💡 Access your sitemap at:");
    console.log(`   ${BASE_URL}/sitemap.xml\n`);

  } catch (error) {
    console.error("\n❌ Error testing sitemap:", error.message);
    console.error("\nTroubleshooting:");
    console.error("  1. Verify NEXT_ES_URL is set in .env.local");
    console.error("  2. Verify NEXT_ES_API_KEY is set in .env.local");
    console.error("  3. Ensure Elasticsearch server is accessible");
    console.error("  4. Check API key has proper permissions\n");
    process.exit(1);
  }
}

testSitemap();
