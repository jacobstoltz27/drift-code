import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";

const base = "https://drift-code.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1, changeFrequency: "weekly" },
    { url: `${base}/waitlist`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${base}/features`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${base}/peregrine`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${base}/explore`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${base}/pricing`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/community`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${base}/creators`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${base}/about`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${base}/blog`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${base}/faqs`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${base}/contact`, priority: 0.4, changeFrequency: "yearly" },
    { url: `${base}/search`, priority: 0.3, changeFrequency: "yearly" },
    { url: `${base}/privacy`, priority: 0.2, changeFrequency: "yearly" },
    { url: `${base}/terms`, priority: 0.2, changeFrequency: "yearly" },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.date,
    priority: 0.6,
    changeFrequency: "monthly",
  }));

  return [...staticRoutes, ...blogRoutes];
}
