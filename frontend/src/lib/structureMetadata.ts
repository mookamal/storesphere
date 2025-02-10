import type { Metadata } from 'next';

// Define the props interface for the function
interface StructureMetadataProps {
  title: string;
  description: string;
  image: string;
}

export default function StructureMetadata({
  title,
  description,
  image,
}: StructureMetadataProps): Metadata {
  // Retrieve the site URL from environment variables and validate it
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not defined in the environment variables.");
  }

  // Return the metadata object using shorthand property assignments
  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
