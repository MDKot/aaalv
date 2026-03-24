export const dynamic = 'force-dynamic';

import { createClient } from "@supabase/supabase-js";
import type { Event } from "@/lib/types";
import EventGrid from "@/components/EventGrid";

async function getEvents(): Promise<Event[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl === "your_supabase_url") {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true });

  if (error) {
    return [];
  }

  return (data as Event[]) || [];
}

export default async function HomePage() {
  const events = await getEvents();

  return (
    <main>
      {/* Hero */}
      <section className="relative hero-gradient animate-pulse-bg min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.05)_0%,_transparent_70%)]" />
        <div className="relative z-10">
          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl text-white tracking-tight mb-4">
            AAA Las Vegas
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-xl mx-auto font-light">
            Your insider access to Las Vegas nightlife
          </p>
        </div>
      </section>

      {/* Event Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <EventGrid events={events} />
      </section>
    </main>
  );
}
