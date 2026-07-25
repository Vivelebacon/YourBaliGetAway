import type { MetadataRoute } from 'next'
import { getVillaSlugs } from '@/lib/content'
import { getArticleSlugs } from '@/lib/takeaways'
import { SITE_URL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [villas, articles] = await Promise.all([getVillaSlugs(), getArticleSlugs()])
  const now = new Date()

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/villas`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...villas.map((slug) => ({
      url: `${SITE_URL}/villas/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    { url: `${SITE_URL}/takeaways`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...articles.map((slug) => ({
      url: `${SITE_URL}/takeaways/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${SITE_URL}/takeaways/community`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
  ]
}
