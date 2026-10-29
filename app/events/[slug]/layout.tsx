import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const formattedTitle = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gdgcaec.in";

  return {
    title: formattedTitle,
    description: `Join us for ${formattedTitle} organized by Google Developer Groups on Campus at Asansol Engineering College. Learn, build, and connect with fellow developers.`,
    openGraph: {
      title: `${formattedTitle} | GDGC AEC Events`,
      description: `Join us for ${formattedTitle} hosted by Google Developer Groups on Campus AEC.`,
      url: `${siteUrl}/events/${slug}`,
      siteName: "GDGC On Campus AEC",
      images: [
        {
          url: "/assets/event-1.jpg",
          width: 1200,
          height: 630,
          alt: formattedTitle,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${formattedTitle} | GDGC AEC Events`,
      description: `Join us for ${formattedTitle} hosted by Google Developer Groups on Campus AEC.`,
      images: ["/assets/event-1.jpg"],
    },
  };
}

export default function EventDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
