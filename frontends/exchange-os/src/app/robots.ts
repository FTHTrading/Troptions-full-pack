import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = 'https://troptions.unykorn.org';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/portal/',
          '/login/',
          '/register/',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
