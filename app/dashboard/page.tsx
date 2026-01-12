"use client";
 
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import posthog from "posthog-js";
import BookingCalendar from "./BookingCalendar";
 
export default function DashboardPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
 
  useEffect(() => {
    posthog.capture("client_dashboard_viewed");
  }, []);
 
  async function logout() {
    posthog.capture("client_logout_clicked");
    setLoggingOut(true);
 
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      posthog.capture("client_logout_success");
      router.push("/");
    } catch (e) {
      posthog.capture("client_logout_failed");
      throw e;
    } finally {
      setLoggingOut(false);
    }
  }
 
  function go(path: string, eventName: string) {
    posthog.capture(eventName, { destination: path });
    router.push(path);
  }
 
  return (
<div className="min-h-screen bg-gray-50">
<div className="max-w-3xl mx-auto px-4 py-10">
        {/* HEADER */}
<div className="flex items-start justify-between gap-4">
<div>
<h1 className="text-3xl font-bold">Dashboard</h1>
<p className="text-gray-600 mt-2">What would you like to do?</p>
</div>
 
          <button
            onClick={logout}
            disabled={loggingOut}
            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50"
>
            {loggingOut ? "Logging out..." : "Log out"}
</button>
</div>
 
        {/* ACTION CARDS */}
<div className="mt-8 grid gap-4 md:grid-cols-3">
<button
            onClick={() => go("/onboarding", "client_click_find_match")}
            className="bg-white border rounded-2xl p-5 text-left hover:shadow-sm transition"
>
<div className="text-lg font-semibold">Find me a match</div>
<div className="text-sm text-gray-600 mt-1">
              Take the onboarding and get therapist matches.
</div>
</button>
 
          <button
            onClick={() => go("/therapists", "client_click_explore_therapists")}
            className="bg-white border rounded-2xl p-5 text-left hover:shadow-sm transition"
>
<div className="text-lg font-semibold">Explore therapists</div>
<div className="text-sm text-gray-600 mt-1">
              Browse all therapists and filter by city/online.
</div>
</button>
 
          <button
            onClick={() => go("/matches", "client_click_your_matches")}
            className="bg-white border rounded-2xl p-5 text-left hover:shadow-sm transition"
>
<div className="text-lg font-semibold">Your matches</div>
<div className="text-sm text-gray-600 mt-1">
              View therapists recommended for you.
</div>
</button>
 
          <button
            onClick={() => go("/therapy-types", "client_click_therapy_types")}
            className="bg-white border rounded-2xl p-5 text-left hover:shadow-sm transition"
>
<div className="text-lg font-semibold">Type of Therapy</div>
<div className="text-sm text-gray-600 mt-1">
              Learn about CBT, Gestalt, ACT, Psychodynamic and more.
</div>
</button>
 
          <button
            onClick={() => go("/problems", "client_click_problems")}
            className="bg-white border rounded-2xl p-5 text-left hover:shadow-sm transition"
>
<div className="text-lg font-semibold">Problems we help with</div>
<div className="text-sm text-gray-600 mt-1">
              Anxiety, depression, panic attacks, burnout, identity issues and
              more.
</div>
</button>
</div>
 
        {/* BOOKINGS CALENDAR */}
<div className="mt-10">
          {/* optional tracking: când apare calendarul în dashboard */}
<CalendarSeenTracker />
<BookingCalendar />
</div>
</div>
</div>
  );
}
 
function CalendarSeenTracker() {
  useEffect(() => {
    posthog.capture("client_calendar_widget_seen");
  }, []);
  return null;
}