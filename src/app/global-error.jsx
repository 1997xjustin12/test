"use client";

// The last-resort error page for the App Router: used when the root layout
// itself fails. It replaces the root layout, so it brings its own document.
// The content is shared with pages/500.jsx.
import ServerErrorPage, { SERVER_ERROR_TITLE } from "@/app/components/atom/ServerErrorPage";

export default function GlobalError({ retry }) {
  return (
    <html lang="en">
      <body>
        <title>{SERVER_ERROR_TITLE}</title>
        <ServerErrorPage onRetry={() => retry()} />
      </body>
    </html>
  );
}
