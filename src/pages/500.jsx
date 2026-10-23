// The 500 page Next serves when a page can't be rendered and no error boundary
// caught it, notably a cached (ISR) product page rebuilt while Elasticsearch
// or the backend is down. Without it, visitors got Next's bare
// "500: Internal Server Error". It's a Pages Router page because this app has
// a pages/ directory (for its API routes), so Next uses the Pages Router 500.
import Head from "next/head";
import ServerErrorPage, { SERVER_ERROR_TITLE } from "@/app/components/atom/ServerErrorPage";

export default function Custom500() {
  return (
    <>
      <Head>
        <title>{SERVER_ERROR_TITLE}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <ServerErrorPage onRetry={() => window.location.reload()} />
    </>
  );
}
