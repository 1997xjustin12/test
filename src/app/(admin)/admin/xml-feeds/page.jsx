import React from "react";
import { BASE_URL } from "@/app/lib/helpers";
import FeedManager from "@/app/components/admin/feeds/FeedManager";

export const metadata = { title: "XML Feeds" };

export default function XmlFeedsPage() {
  return <FeedManager baseUrl={BASE_URL} />;
}
