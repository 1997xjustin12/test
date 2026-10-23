// Zoho's returnURL for the Professional Program form. Zoho sends the form's
// hidden frame here after a successful post; the form sees the frame land on
// our own origin and shows its success message. See lib/contractor-program-form.js.
const page = () =>
  new Response("<!doctype html><title>Received</title>", {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });

export const GET = page;
export const POST = page;
