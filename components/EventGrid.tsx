"use client";

import { useState } from "react";
import type { Event } from "@/lib/types";
import EventCard from "./EventCard";

type VenueFilter = "all" | "liv-las-vegas" | "liv-beach";

export default function EventGrid({ events }: { events: Event[] }) {
  const [filter, setFilter] = useState<VenueFilter>("all");

  const filtered =
    filter === "all" ? events : events.filter((e) => e.venue === filter);

  const filters: { label: string; value: VenueFilter }[] = [
    { label: "All Events", value: "all" },
    { label: "LIV Las Vegas", value: "liv-las-vegas" },
    { label: "LIV Beach", value: "liv-beach" },
  ];

  return (
    <>
      {/* Venue Filter Pills */}
      <div className="flex justify-center gap-3 mb-12">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              filter === f.value
                ? "bg-gold text-black"
                : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/40 text-lg">No upcoming events found.</p>
          <p className="text-white/20 text-sm mt-2">
            Check back soon for the latest events.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </>
  );
}
