"use client";

import { useState } from "react";

export default function GuestListForm({
  eventId,
  eventTitle,
}: {
  eventId: string;
  eventTitle: string;
}) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const dob = new Date(form.dob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < 21) {
      setError("You must be 21 or older to join the guest list.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/guestlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, event_id: eventId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (success) {
    return (
      <div className="bg-charcoal border border-gold/20 rounded-2xl p-8 text-center">
        <div className="text-gold text-5xl mb-4">&#10003;</div>
        <h3 className="font-heading text-2xl mb-2">You&apos;re on the list!</h3>
        <p className="text-white/70">
          You&apos;re on the list for{" "}
          <span className="text-gold font-semibold">{eventTitle}</span>! Check
          your email for details.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-charcoal border border-white/10 rounded-2xl p-8">
      <h3 className="font-heading text-2xl text-gold mb-6">
        Join the Guest List
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            required
            className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            required
            className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50"
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50"
        />
        <div>
          <label className="text-white/40 text-xs mb-1 block">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            required
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-gold/50"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold hover:bg-gold-dark text-black font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Join Guest List"}
        </button>
      </form>

      <p className="text-white/30 text-xs mt-4 text-center">
        Guest list does not guarantee entry. A ticket guarantees your spot.
      </p>
    </div>
  );
}
