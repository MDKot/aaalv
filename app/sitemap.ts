import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://aaalasvegas.com";
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/artists`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/media`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  ];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url === "your_supabase_url") return staticPages;

  const supabase = createClient(url, key);

  const [{ data: events }, { data: blogs }] = await Promise.all([
    supabase.from("events").select("slug, event_date").eq("is_published", true),
    supabase.from("blogs").select("slug, published_at").eq("is_published", true),
  ]);

  const eventPages: MetadataRoute.Sitemap = (events || []).map((e) => ({
    url: `${baseUrl}/events/${e.slug}`,
    lastModified: new Date(e.event_date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = (blogs || []).map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: b.published_at ? new Date(b.published_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...eventPages, ...blogPages];
}
