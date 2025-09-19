import React from "react";
import { IoSearchSharp } from "react-icons/io5";
import EventCard from "../Components/EventCard";
import HeroSection from "../Components/HeroSection";

// Mock SKIT college event data
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

const categories = [
  "All",
  "Technical",
  "Cultural",
  "Sports",
  "Workshop",
  "Social",
];

const Home = () => {
  return (
    <div className="bg-slate-50 h-full">
      <HeroSection />

      <section className="py-16 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-8 mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                SKIT Campus Events
              </h2>
              <p className="sm:text-lg text-gray-400 leading-relaxed">
                Discover exciting events happening at Swami Keshvanand Institute
                of Technology.
              </p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <button className="px-3 py-2 border-2 border-[#00A1A1] bg-transparent text-[#00A1A1] rounded-lg cursor-pointer text-sm font-medium hover:bg-[#00A1A1] hover:text-white transition-all duration-300 flex justify-center items-center">
                <div className="mr-2 text-lg"><IoSearchSharp /></div> Filter Events
              </button>
              <div className="flex border border-gray-300 rounded-lg">
                <button className="px-3 py-2 border-none bg-gray-100 cursor-pointer rounded-l-lg hover:bg-gray-200 transition-colors">
                  ⊞
                </button>
                <button className="px-3 py-2 border-none bg-transparent cursor-pointer rounded-r-lg hover:bg-gray-100 transition-colors">
                  ☰
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <span
                key={category}
                className={`px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-all duration-300 ${
                  category === "All"
                    ? "bg-[#A94442] text-white"
                    : "bg-transparent text-gray-800 hover:bg-[#00A1A1]/10 border-[1px] border-[#00A1A1]"
                }`}
              >
                {category}
              </span>
            ))}
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-6 py-3 border-2 border-[#A94442] bg-transparent text-[#A94442] rounded-lg cursor-pointer text-base font-semibold hover:bg-gradient-to-r from-[#C9514F] to-[#A94442] hover:text-white transition-all">
              Load More Events
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
