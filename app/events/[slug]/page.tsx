export const dynamic = 'force-dynamic';

import { createClient } from "@supabase/supabase-js";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Event } from "@/lib/types";
import GuestListForm from "@/components/GuestListForm";
import Link from "next/link";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url === "your_supabase_url") return null;
  return createClient(url, key);
}

async function getEvent(slug: string): Promise<Event | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) return null;
  return data as Event;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = await getEvent(params.slug);

  if (!event) {
    return { title: "Event Not Found" };
  }

  const dateStr = format(new Date(event.event_date), "MMMM d, yyyy");
  const venueName =
    event.venue === "liv-las-vegas" ? "LIV Las Vegas" : "LIV Beach";

  return {
    title: `${event.artist} at ${venueName}`,
    description: `${event.artist} performing at ${venueName} on ${dateStr}. Get on the guest list or buy discounted tickets.`,
    openGraph: {
      title: `${event.artist} at ${venueName}`,
      description: `${event.artist} performing at ${venueName} on ${dateStr}.`,
      images: event.image_url ? [event.image_url] : [],
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = await getEvent(params.slug);

  if (!event) {
    notFound();
  }

  const dateFormatted = format(
    new Date(event.event_date),
    "EEEE, MMMM d, yyyy"
  );
  const displayOffer = event.custom_offer || event.offer;
  const venueName =
    event.venue === "liv-las-vegas" ? "LIV Las Vegas" : "LIV Beach";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.event_date,
    location: {
      "@type": "Place",
      name: venueName,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Las Vegas",
        addressRegion: "NV",
        addressCountry: "US",
      },
    },
    image: event.image_url || undefined,
    performer: {
      "@type": "Person",
      name: event.artist,
    },
    offers: {
      "@type": "Offer",
      description: displayOffer,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen">
        {/* Hero Image */}
        <div className="relative h-[50vh] md:h-[60vh]">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-charcoal-light to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
              <Link
                href="/"
                className="text-white/50 hover:text-white text-sm mb-4 inline-block"
              >
                &larr; Back to Events
              </Link>
              <span className="block bg-white/10 backdrop-blur-sm text-white/80 text-xs px-3 py-1 rounded-full border border-white/10 w-fit mb-3">
                {venueName}
              </span>
              <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-white mb-2">
                {event.artist}
              </h1>
              <p className="text-white/60 text-lg">{dateFormatted}</p>
              {event.doors_open && (
                <p className="text-white/40 text-sm mt-1">
                  Doors open at {event.doors_open}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 md:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left: Details */}
            <div className="lg:col-span-3 space-y-8">
              {/* Offer */}
              <div className="bg-gold/10 border border-gold/20 rounded-xl p-6">
                <p className="text-gold font-semibold">{displayOffer}</p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {event.ticket_url && (
                  <a
                    href={event.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl transition-colors border border-white/10 font-medium"
                  >
                    Buy Tickets
                    <span className="block text-gold text-xs mt-1">
                      Use Code AAA for 15% Off
                    </span>
                  </a>
                )}
                {event.table_url && (
                  <a
                    href={event.table_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl transition-colors border border-white/10 font-medium"
                  >
                    Reserve a Table
                  </a>
                )}
              </div>
            </div>

            {/* Right: Guest List Form */}
            <div className="lg:col-span-2">
              <GuestListForm eventId={event.id} eventTitle={event.title} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
