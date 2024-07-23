export default function StructureMetadata({ title, description, image }) {
    return {
      title: title,
      description: description,
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
      openGraph: {
        title: title,
        description: description,
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
        title: title,
        description: description,
        images: [image],
      },
    };
  }
  