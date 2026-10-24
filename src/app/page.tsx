import type { Metadata } from "next";
import { Banner } from "@/components/banner";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Testimonials } from "@/components/testimonials";
import { CTA } from "@/components/cta";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} | Discover Your Next Adventure` },
  description:
    "Explore breathtaking destinations and create unforgettable memories with Wanderlast's curated travel experiences. Book your next journey today.",
  keywords: [
    "travel packages",
    "holiday bookings",
    "adventure tours",
    "luxury travel",
    "travel agency",
    "book trips online",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    title: `${SITE_NAME} | Discover Your Next Adventure`,
    description:
      "Explore breathtaking destinations and create unforgettable memories with our curated travel experiences.",
    siteName: SITE_NAME,
    images: [
      { url: "/banner.png", alt: "Discover your next adventure with Wanderlast" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Discover Your Next Adventure`,
    description: "Explore breathtaking destinations and book your next journey today.",
    images: ["/banner.png"],
  },
};

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col">
      <Banner />
      <WhyChooseUs />
      <Testimonials />
      <CTA />
    </main>
  );
}
