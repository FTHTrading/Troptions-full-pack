import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://troptions.unykorn.org';
  const routes = [
    '/troptions',
    '/exchange-os',
    '/exchange-os/partner-demo',
    '/exchange-os/status',
    '/exchange-os/compare',
    '/exchange-os/control-center',
    '/exchange-os/readiness',
    '/exchange-os/proof-room',
    '/exchange-os/solana-dex-map',
    '/x402',
    '/x402/catalog',
    '/agents',
    '/agents/finder',
    '/mints',
    '/system/truth',
    '/insights',
  ];

  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date('2026-05-15'),
    changeFrequency: 'weekly' as const,
    priority: r === '/troptions' ? 1 : 0.8,
  }));
}
