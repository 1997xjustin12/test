import { getStoreSettings } from "@/app/lib/store-settings";

/**
 * GET /.well-known/security.txt — RFC 9116.
 *
 * Tells a researcher who finds a vulnerability where to send it. Without one
 * they either give up or post publicly, and the first we hear of a problem is
 * when someone else does.
 *
 * A route rather than a file in public/, because the contact address differs
 * per brand and all three deploy from this one codebase — a static file would
 * publish Solana's address on the BBQ storefront.
 *
 * Cached for a day. It changes about never, and a researcher hitting it should
 * not be waiting on a Redis read.
 */
export const dynamic = "force-dynamic";

/**
 * RFC 9116 requires Expires, and treats the file as stale past it. A year out,
 * recomputed on every request, so it can never silently expire — a fixed date
 * would need remembering, and would be the thing nobody remembers.
 */
function expiresAt() {
  const d = new Date();
  d.setUTCFullYear(d.getUTCFullYear() + 1);
  d.setUTCMilliseconds(0);
  return d.toISOString().replace(/\.\d{3}Z$/, "Z");
}

export async function GET() {
  const settings = await getStoreSettings().catch(() => ({}));

  // Falls back to the env value, then to a last-resort address, so this can
  // never publish an empty Contact — a security.txt with no contact is worse
  // than none, because it looks like a channel that exists.
  const email =
    settings?.email ||
    process.env.NEXT_PUBLIC_STORE_EMAIL ||
    "info@solanafireplaces.com";

  const site = (process.env.NEXT_PUBLIC_SITE_BASE_URL || "").replace(/\/$/, "");

  const body = [
    `Contact: mailto:${email}`,
    `Expires: ${expiresAt()}`,
    "Preferred-Languages: en",
    ...(site ? [`Canonical: ${site}/.well-known/security.txt`] : []),
    "",
    "# Please include steps to reproduce, and give us a reasonable window to",
    "# respond before disclosing publicly. We do not operate a bug bounty.",
    "",
  ].join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      // RFC 9116 specifies text/plain; charset=utf-8. A different type here is
      // the one thing that makes a well-formed file unreadable to the tools
      // that go looking for it.
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
