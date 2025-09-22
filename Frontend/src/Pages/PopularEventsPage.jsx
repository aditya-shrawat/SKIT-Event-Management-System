import React, { useState } from "react";
import EventCard from "../Components/EventCard";

const PopularEventsPage = () => {
  // Mock data for registered events
  const [registeredEvents] = useState([
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      description:
        "Join us for a day of inspiring talks and networking with industry leaders in technology.",
      date: "2024-03-15",
      time: "10:00 AM",
      location: "SKIT Auditorium",
      image: "/dummyImage.webp",
      category: "Technology",
      attendees: 150,
      maxAttendees: 300,
      organizer: "Tech Club",
      isSubAdmin: true,
      createdByUser: false,
      subAdminApprovalStatus: "Approved",
      registrationDate: "2024-02-20",
    },
    {
      id: 2,
      title: "Design Thinking Workshop",
      description:
        "Join us for a hands-on workshop to enhance your design thinking skills.",
      date: "2024-03-20",
      time: "2:00 PM",
      location: "Design Lab",
      image: "/dummyImage.webp",
      category: "Workshop",
      attendees: 45,
      maxAttendees: 300,
      organizer: "Tech Club",
      isSubAdmin: false,
      createdByUser: true,
      subAdminApprovalStatus: "Pending",
      registrationDate: "2024-02-18",
    },
    {
      id: 3,
      title: "Startup Pitch Competition",
      description:
        "Join us for a hands-on workshop to enhance your design thinking skills.",
      date: "2024-03-25",
      time: "11:00 AM",
      location: "Main Hall",
      image: "/dummyImage.webp",
      category: "Competition",
      attendees: 200,
      maxAttendees: 300,
      organizer: "Tech Club",
      isSubAdmin: true,
      createdByUser: false,
      subAdminApprovalStatus: "Approved",
      registrationDate: "2024-02-25",
    },
  ]);

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
          <div>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
              Popular Events
            </h1>
            <p className="mt-2 text-gray-500 max-w-2xl">
              Discover the most trending and highly attended events at SKIT —
              see what everyone's talking about.
            </p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {registeredEvents.filter((e) => e.isSubAdmin).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registeredEvents
              .filter((e) => e.isSubAdmin)
              .map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularEventsPage;
