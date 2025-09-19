import React, { useState } from "react";
import EventCard from "../Components/EventCard";

const RegisteredEvents = () => {
  // Mock data for registered events
  const [registeredEvents] = useState([
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      description: "Join us for a day of inspiring talks and networking with industry leaders in technology.",
      date: "2024-03-15",
      time: "10:00 AM",
      location: "SKIT Auditorium",
      image: "/dummyImage.webp",
      category: "Technology",
      attendees: 150,
      maxAttendees: 300,
      organizer: "Tech Club",
      registrationStatus: "Confirmed",
      registrationDate: "2024-02-20",
    },
    {
      id: 2,
      title: "Design Thinking Workshop",
      description: "Join us for a hands-on workshop to enhance your design thinking skills.",
      date: "2024-03-20",
      time: "2:00 PM",
      location: "Design Lab",
      image: "/dummyImage.webp",
      category: "Workshop",
      attendees: 45,
      maxAttendees: 300,
      organizer: "Tech Club",
      registrationStatus: "Confirmed",
      registrationDate: "2024-02-18",
    },
    {
      id: 3,
      title: "Startup Pitch Competition",
      description: "Join us for a hands-on workshop to enhance your design thinking skills.",
      date: "2024-03-25",
      time: "11:00 AM",
      location: "Main Hall",
      image: "/dummyImage.webp",
      category: "Competition",
      attendees: 200,
      maxAttendees: 300,
      organizer: "Tech Club",
      registrationStatus: "Pending",
      registrationDate: "2024-02-25",
    },
  ])

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Grid pattern overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.06)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        {/* Soft decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-28 -right-28 w-72 h-72 bg-gradient-to-br from-teal-400/15 to-teal-600/15 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-28 -left-28 w-72 h-72 bg-gradient-to-br from-teal-400/15 to-teal-600/15 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">My Registered Events</h1>
              <p className="mt-2 text-gray-500 max-w-2xl">Keep track of your registrations at a glance — clear, simple, organized.</p>
            </div>

            {/* Stats */}
            <div className="w-full md:w-auto">
              <div className="bg-white/80 backdrop-blur-sm border border-[#00A1A1]/30 shadow-sm rounded-2xl">
                <div className="grid grid-cols-2 divide-x divide-[#00A1A1]/20">
                  {/* Total */}
                  {/* <div className="p-4 md:p-5 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-[#00A1A1]/10 text-[#00A1A1] grid place-items-center">📦</div>
                    <div>
                      <div className="text-xs text-gray-500">Total</div>
                      <div className="mt-0.5 text-xl md:text-2xl font-semibold text-gray-900">{registeredEvents.length}</div>
                    </div>
                  </div> */}
                  {/* Confirmed */}
                  <div className="p-4 md:p-5 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-green-500/10 text-green-600 grid place-items-center">✅</div>
                    <div>
                      <div className="text-xs text-gray-500">Confirmed</div>
                      <div className="mt-0.5 text-xl md:text-2xl font-semibold text-green-600">
                        {registeredEvents.filter((e) => e.registrationStatus === "Confirmed").length}
                      </div>
                    </div>
                  </div>
                  {/* Waitlisted */}
                  <div className="p-4 md:p-5 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 grid place-items-center">⏳</div>
                    <div>
                      <div className="text-xs text-gray-500">Pending</div>
                      <div className="mt-0.5 text-xl md:text-2xl font-semibold text-amber-600">
                        {registeredEvents.filter((e) => e.registrationStatus === "Waitlisted").length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {registeredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registeredEvents.map((event) => (
                <EventCard key={event.id} { ...event } />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Registered Events
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't registered for any events yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisteredEvents;
