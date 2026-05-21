import type { Metadata } from 'next';
import { getSeoPage } from '@/data/seoPages';

const BASE_URL = 'https://troptions.unykorn.org';
const DEFAULT_OG_IMAGE = '/assets/troptions/logos/troptions-tt-gold.jpg';

export function buildMetadata(slug: string, overrides?: Partial<Metadata>): Metadata {
  const page = getSeoPage(slug);

  if (!page) {
    return {
      title: 'TROPTIONS / UNYKORN',
      description: 'TROPTIONS institutional trade currency infrastructure.',
      metadataBase: new URL(BASE_URL),
      ...overrides,
    };
  }

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: page.path,
    },
    openGraph: {
      title: page.ogTitle,
      description: page.ogDescription,
      type: page.ogType,
      url: `${BASE_URL}${page.path}`,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: page.ogTitle,
        },
      ],
      siteName: 'TROPTIONS / UNYKORN',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.ogTitle,
      description: page.ogDescription,
      images: [DEFAULT_OG_IMAGE],
    },
    ...overrides,
  };
}
