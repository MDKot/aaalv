"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import type { Event } from "@/lib/types";
import GuestListModal from "./GuestListModal";

export default function EventCard({ event }: { event: Event }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(false);

  const displayOffer = event.custom_offer || event.offer;
  const dateFormatted = format(new Date(event.event_date), "EEE, MMM d").toUpperCase();
  const venueName = event.venue === "liv-las-vegas" ? "LIV Las Vegas" : "LIV Beach";

  return (
    <>
      <div className="group relative bg-charcoal rounded-2xl overflow-hidden border border-white/5 hover:border-gold/20 transition-all duration-300">
        {/* Image */}
        <Link href={`/events/${event.slug}`} className="block relative aspect-[4/3] overflow-hidden">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-charcoal-light to-black flex items-center justify-center">
              <span className="text-white/20 font-heading text-3xl">
                {event.artist.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Venue Badge */}
          <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white/80 text-xs px-3 py-1 rounded-full border border-white/10">
            {venueName}
          </span>
        </Link>

        {/* Content */}
        <div className="p-5">
          <p className="text-white/50 text-xs tracking-wider mb-1">{dateFormatted}</p>
          <Link href={`/events/${event.slug}`}>
            <h3 className="font-heading text-2xl text-white hover:text-gold transition-colors leading-tight">
              {event.artist}
            </h3>
          </Link>

          {/* Offer Badge */}
          <div className="mt-3 mb-4">
            <span className="inline-block bg-gold/10 text-gold text-xs px-3 py-1.5 rounded-full border border-gold/20">
              {displayOffer}
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="w-full bg-gold hover:bg-gold-dark text-black font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              Join Guest List
            </button>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <a
                  href={event.ticket_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setShowPromo(true)}
                  onMouseLeave={() => setShowPromo(false)}
                  className="block w-full text-center bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-lg transition-colors text-sm border border-white/10"
                >
                  Buy Tickets
                </a>
                {showPromo && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gold text-black text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap z-10">
                    Use Code AAA for 15% Off
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gold" />
                  </div>
                )}
              </div>
              <a
                href={event.table_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-lg transition-colors text-sm border border-white/10"
              >
                Reserve Table
              </a>
            </div>
          </div>
        </div>
      </div>

      <GuestListModal
        event={event}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
