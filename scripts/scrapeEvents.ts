import puppeteer from 'puppeteer';
import slugify from 'slugify';
import { format } from 'date-fns';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ScrapedEvent {
  venue: string;
  title: string;
  slug: string;
  artist: string;
  event_date: string;
  doors_open: string | null;
  image_url: string | null;
  ticket_url: string | null;
  table_url: string | null;
  offer: string;
  scraped_at: string;
}

async function scrapeEvents() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Navigating to LIV Las Vegas...');
  await page.goto('https://www.livnightclub.com/lasvegas', {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });

  // Wait for event content to load
  await page.waitForSelector('a[href*="/event/"], .event-card, [class*="event"]', {
    timeout: 10000,
  }).catch(() => {
    console.log('No specific event selector found, trying generic approach...');
  });

  const events = await page.evaluate(() => {
    const results: Array<{
      title: string;
      artist: string;
      date: string;
      imageUrl: string | null;
      ticketUrl: string | null;
      tableUrl: string | null;
    }> = [];

    // Try multiple selector strategies
    const eventElements = document.querySelectorAll(
      'a[href*="/event/"], [class*="event-card"], [class*="EventCard"], .event-item, [data-event]'
    );

    eventElements.forEach((el) => {
      const link = el instanceof HTMLAnchorElement ? el : el.querySelector('a');
      const titleEl = el.querySelector('h2, h3, h4, [class*="title"], [class*="name"]');
      const dateEl = el.querySelector('[class*="date"], time, [datetime]');
      const imgEl = el.querySelector('img');

      const title = titleEl?.textContent?.trim() || link?.textContent?.trim() || '';
      const date = dateEl?.textContent?.trim() || dateEl?.getAttribute('datetime') || '';
      const imageUrl = imgEl?.getAttribute('src') || imgEl?.getAttribute('data-src') || null;
      const ticketUrl = link?.getAttribute('href') || null;

      if (title && title.length > 1) {
        results.push({
          title,
          artist: title,
          date,
          imageUrl,
          ticketUrl: ticketUrl ? (ticketUrl.startsWith('http') ? ticketUrl : `https://www.livnightclub.com${ticketUrl}`) : null,
          tableUrl: null,
        });
      }
    });

    return results;
  });

  console.log(`Found ${events.length} events`);

  const scrapedEvents: ScrapedEvent[] = events.map((event) => {
    let eventDate: string;
    try {
      const parsed = new Date(event.date);
      eventDate = isNaN(parsed.getTime())
        ? new Date().toISOString()
        : parsed.toISOString();
    } catch {
      eventDate = new Date().toISOString();
    }

    const dateStr = format(new Date(eventDate), 'yyyy-MM-dd');
    const slug = slugify(`${event.artist}-${dateStr}`, { lower: true, strict: true });

    return {
      venue: 'liv-las-vegas',
      title: event.title,
      slug,
      artist: event.artist,
      event_date: eventDate,
      doors_open: null,
      image_url: event.imageUrl,
      ticket_url: event.ticketUrl,
      table_url: event.tableUrl,
      offer: 'Complimentary Entry until 1AM | Buy Tickets Below',
      scraped_at: new Date().toISOString(),
    };
  });

  // Upsert events into Supabase
  for (const event of scrapedEvents) {
    const { error } = await supabase
      .from('events')
      .upsert(event, { onConflict: 'slug' });

    if (error) {
      console.error(`Error upserting ${event.slug}:`, error.message);
    } else {
      console.log(`Upserted: ${event.title} (${event.slug})`);
    }
  }

  await browser.close();
  console.log(`Scraping complete. Processed ${scrapedEvents.length} events.`);
}

scrapeEvents().catch(console.error);
