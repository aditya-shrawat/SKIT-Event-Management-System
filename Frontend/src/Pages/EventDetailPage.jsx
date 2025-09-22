import { useUser } from "@/Context/UserContext";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";


// Mock SKIT college event data (same as in main page)
const events = [
  {
    id: "1",
    title: "SKIT Tech Fest 2024",
    description:
      "Annual technical festival featuring coding competitions, robotics, and innovation showcases by SKIT students.",
    date: "March 15, 2024",
    time: "9:00 AM - 6:00 PM",
    location: "SKIT Main Auditorium",
    attendees: 245,
    maxAttendees: 500,
    category: "Technical",
    image: "/dummyImage.webp",
    organizer: "Computer Science Department",
  },
  {
    id: "2",
    title: "Cultural Night - Rangmanch",
    description:
      "Celebrate diversity with dance, music, drama performances by talented SKIT students from all departments.",
    date: "March 18, 2024",
    time: "6:00 PM - 10:00 PM",
    location: "SKIT Open Ground",
    attendees: 380,
    maxAttendees: 600,
    category: "Cultural",
    image: "/dummyImage.webp",
    organizer: "Cultural Committee",
  },
  {
    id: "3",
    title: "SKIT Sports Championship",
    description:
      "Inter-department sports competition including cricket, football, basketball, and indoor games.",
    date: "March 22, 2024",
    time: "8:00 AM - 6:00 PM",
    location: "SKIT Sports Complex",
    attendees: 450,
    maxAttendees: 800,
    category: "Sports",
    image: "/dummyImage.webp",
    organizer: "Sports Committee",
  },
  {
    id: "4",
    title: "Entrepreneurship Summit",
    description:
      "Learn from successful alumni entrepreneurs and participate in startup pitch competitions.",
    date: "March 25, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "SKIT Conference Hall",
    attendees: 89,
    maxAttendees: 150,
    category: "Workshop",
    image: "/dummyImage.webp",
    organizer: "E-Cell SKIT",
  },
  {
    id: "5",
    title: "Photography Workshop",
    description:
      "Master photography techniques with professional equipment and learn from industry experts.",
    date: "March 28, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "SKIT Media Lab",
    attendees: 25,
    maxAttendees: 30,
    category: "Workshop",
    image: "/dummyImage.webp",
    organizer: "Photography Club",
  },
  {
    id: "6",
    title: "Blood Donation Camp",
    description:
      "Annual blood donation drive organized by NSS SKIT. Help save lives by donating blood.",
    date: "March 30, 2024",
    time: "9:00 AM - 3:00 PM",
    location: "SKIT Medical Room",
    attendees: 120,
    maxAttendees: 200,
    category: "Social",
    image: "/dummyImage.webp",
    organizer: "NSS SKIT",
  },
];



const EventDetailPage = () => {
  const {user} = useUser();
  const params = useParams();
  const navigate = useNavigate();
  const eventId = params.id;

  const event = events.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Event Not Found
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="primary-button px-6 py-3"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Event Image */}
      <div className="relative h-96">
        <div className="absolute inset-0 bg-black/25"></div>
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#00bebe] to-[#00A1A1] text-white rounded-md text-sm font-medium mb-4">
              {event.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {event.title}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {event.description}
            </p>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="w-full bg-slate-50 px-5 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Event Details
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    About This Event
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {event.description} This event is organized by{" "}
                    {event.organizer} and promises to be an engaging experience
                    for all SKIT students. Join us for an unforgettable time
                    filled with learning, networking, and fun activities.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Event Highlights
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[#00A1A1] rounded-full mr-3"></span>
                      Interactive sessions with industry experts
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[#00A1A1] rounded-full mr-3"></span>
                      Networking opportunities with fellow students
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[#00A1A1] rounded-full mr-3"></span>
                      Hands-on workshops and practical learning
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[#00A1A1] rounded-full mr-3"></span>
                      Certificate of participation
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    What to Bring
                  </h3>
                  <p className="text-gray-600">
                    Please bring your SKIT student ID, notebook, and pen. For
                    technical events, laptops may be required. Refreshments will
                    be provided.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Info Card */}
            <div className="bg-gradient-to-br from-green-50 to-red-50 rounded-xl p-6 border border-[#00bebe]">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Event Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="mr-3 mt-1">📅</span>
                  <div>
                    <p className="font-medium text-gray-800">Date</p>
                    <p className="text-gray-600 text-sm">{event.date}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="mr-3 mt-1">🕒</span>
                  <div>
                    <p className="font-medium text-gray-800">Time</p>
                    <p className="text-gray-600 text-sm">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="mr-3 mt-1">📍</span>
                  <div>
                    <p className="font-medium text-gray-800">Location</p>
                    <p className="text-gray-600 text-sm">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="mr-3 mt-1">👥</span>
                  <div>
                    <p className="font-medium text-gray-800">Organizer</p>
                    <p className="text-gray-600 text-sm">{event.organizer}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Button */}
            {
              (user && user.role==='student') ? (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-gray-600 leading-relaxed text-center mb-6">
                    Join the excitement. <br /> Register and connect with peers!
                  </p>

                  <button className="primary-button w-full py-3 px-6">
                    Register for Event
                  </button>
                </div>
              ) : 
              (user && user.role==='admin') ?(
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-gray-600 leading-relaxed text-center mb-6">
                    Track event performance. <br /> View insightful analytics and make informed decisions.
                  </p>
                  <button className="primary-button w-full py-3 px-6">
                    Analytics
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-gray-600 leading-relaxed text-center mb-6">
                    Join the excitement. <br /> Sign Up and register for the event.
                  </p>

                  <button className="primary-button w-full py-3 px-6">
                    Sign up
                  </button>
                </div>
              )
            }
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
