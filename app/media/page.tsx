import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media",
  description: "Photos and videos from the best Las Vegas nightlife events.",
};

export default function MediaPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="font-heading text-5xl md:text-7xl text-white mb-4">
        Media
      </h1>
      <p className="text-white/40 text-lg">Coming Soon</p>
      <a
        href="/"
        className="mt-8 text-gold hover:text-gold-dark text-sm transition-colors"
      >
        &larr; Back to Events
      </a>
    </main>
  );
}
