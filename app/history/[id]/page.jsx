import React from "react";
import HistoryDetailClient from "./HistoryDetailClient";

export const metadata = {
  title: "StyleForge - AI for Hairstyles",
  description: "View details of this image in history.",
  openGraph: {
    title: "StyleForge - AI for Hairstyles",
    description: "Explore details of this image in history.",
    images: ["/bg/banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "StyleForge - AI for Hairstyles",
    description: "Explore details of this image in history.",
    images: ["/bg/banner.png"],
  },
};

export default async function HistoryImagePage({ params }) {
  const { id: imageId } = await params;

  return (
    <div>
      <HistoryDetailClient imageId={imageId} />
    </div>
  );
}
