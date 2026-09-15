/**
 * ZIP and postal code lookup for checkout.
 *
 * Checkout needs a valid code before it can price shipping, and fills city,
 * state and country from it. The lookup used to call the US endpoint for every
 * value, so a Canadian postal code never validated and a Canadian customer
 * could not pay — even though the backend prices Canadian orders.
 *
 * zippopotam.us only knows Canadian codes by their first three characters, the
 * forward sortation area: /ca/M5V answers, /ca/M5V 2T6 is a 404.
 */

const US_ZIP = /^(\d{5})(?:-\d{4})?$/;
const CA_POSTAL = /^([A-Z]\d[A-Z]) ?\d[A-Z]\d$/;

const INVALID = "Invalid ZIP or postal code";

/**
 * { country: "us" | "ca", lookup } for a complete US ZIP (12345, 12345-6789)
 * or Canadian postal code (M5V 2T6, m5v2t6), or null. Partial input is null,
 * so typing does not fire lookups that can only fail.
 */
export function parsePostalCode(value) {
  const code = String(value ?? "").trim().toUpperCase();

  const us = code.match(US_ZIP);
  if (us) return { country: "us", lookup: us[1] };

  const ca = code.match(CA_POSTAL);
  if (ca) return { country: "ca", lookup: ca[1] };

  return null;
}

/** Same result shape the checkout form has always consumed: { error, data }. */
export async function lookupPostalCode(value, fetchImpl = fetch) {
  const postal = parsePostalCode(value);
  if (!postal) return { error: INVALID };

  try {
    const response = await fetchImpl(`https://api.zippopotam.us/${postal.country}/${postal.lookup}`);
    if (!response?.ok) return { error: INVALID };

    const data = await response.json();
    const place = data?.places?.[0];
    if (!place) return { error: INVALID };

    return {
      error: false,
      data: {
        // Canadian entries name a district: "Downtown Toronto (CN Tower / …)".
        city: String(place["place name"] || "").split(" (")[0].trim(),
        state: place.state,
        province: place["state abbreviation"],
        country: data.country,
        country_abbr: data["country abbreviation"],
      },
    };
  } catch (err) {
    return { error: err };
  }
}
