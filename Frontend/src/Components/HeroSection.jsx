import { useUser } from "@/Context/UserContext";
import React from "react";
import { IoSearchSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const floatingImages = [
  {
    src: "/dummyImage.webp",
    alt: "Tech Conference",
    position: "top-16 left-16",
    size: "w-48 h-48",
    delay: "0s",
  },
  {
    src: "/hero1.webp",
    alt: "Design Workshop",
    position: "top-6 right-32",
    size: "w-36 h-36",
    delay: "1s",
  },
  {
    src: "/hero2.avif",
    alt: "Food Festival",
    position: "bottom-24 left-32",
    size: "w-44 h-44",
    delay: "2s",
  },
  {
    src: "/hero3.webp",
    alt: "Startup Pitch",
    position: "bottom-20 right-32",
    size: "w-48 h-48",
    delay: "0.5s",
  },
  {
    src: "/hero4.webp",
    alt: "Photography",
    position: "top-1/2 left-14",
    size: "w-36 h-36",
    delay: "1.5s",
  },
  {
    src: "/hero5.webp",
    alt: "Yoga Session",
    position: "top-32 right-10",
    size: "w-44 h-44",
    delay: "2.5s",
  },
];

const HeroSection = ({scrollToSection}) => {
  const {user} = useUser();


  return (
    <section className="overflow-hidden h-[100vh] text-center text-white bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative py-36 px-4">
      {/* Floating images */}
      {floatingImages.map((image, index) => (
        <div
          key={index}
          className={`absolute ${image.position} ${image.size} hidden lg:block`}
          style={{ animationDelay: image.delay }}
        >
          <div
            className={`relative h-full w-full ${
              index % 2 === 0 ? "float-animation" : "float-reverse"
            } transform rotate-3 hover:rotate-0 transition-transform duration-500`}
          >
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white/80"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" /> */}
          </div>
        </div>
      ))}

      {/* Grid pattern overlay */}
      {/* <div
        className="z-0 pointer-events-none absolute inset-0 
          bg-[linear-gradient(rgba(20,184,166,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.06)_1px,transparent_1px)] bg-[size:64px_64px]"
      ></div> */}

      {/* Background decoration elements */}
      <div className="z-0 pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-teal-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-teal-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="inline-flex items-center px-4 py-2 mb-3 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-sm">
          <span className="text-xs sm:text-sm font-medium text-gray-600">
            🎓 Swami Keshvanand Institute of Technology
          </span>
        </div>

        <h1 className="font-bold mb-3 leading-tight text-gray-800 text-4xl sm:text-5xl">
          {user?.role === 'admin' ? 'Organize Amazing Events' : 'Discover Amazing Events'}
        </h1>

        <p className="mb-8 text-gray-400 max-w-xl mx-auto text-base md:text-lg">
          {user?.role === 'admin'
            ? 'Organize competitions, workshops, cultural events, and create unforgettable experiences for your students.'
            : 'Participate in competitions, workshops, cultural events, and create unforgettable memories with your fellow students.'}
        </p>

        {/* Search container */}
        <div className="flex max-w-xl mx-auto bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl p-1.5 shadow-2xl gap-2">
          <input
            type="text"
            placeholder="Search events, workshops, competitions..."
            className="flex-1 p-3 border-none rounded-xl text-sm sm:text-base outline-none text-gray-700 bg-transparent font-normal placeholder:text-gray-500"
          />
          <div className="primary-button px-4 sm:px-5 py-3 rounded-xl cursor-pointer sm:text-base font-semibold transition-all duration-300 shadow-sm shadow-[#00A1A1]/30 hover:shadow-[#00A1A1]/40 flex items-center justify-center">
            <IoSearchSharp className="inline-block sm:mr-2 text-xl" />
            <span className="hidden sm:block">Search Events</span>
          </div>
        </div>

        {/* Action buttons */}
        {user ? (
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <div onClick={() => scrollToSection('Events')} className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
              <span className="text-sm font-medium text-gray-600">
                🎯 Browse All Events
              </span>
            </div>

            <Link to={'/create-event'} className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
              <span className="text-sm font-medium text-gray-600">
                ➕ Create Event
              </span>
            </Link>
          </div>)
        : (
          <Link to="/signup" className="inline-block mt-8">
            <button className="px-4 py-2 bg-white/60 backdrop-blur-sm text-sm font-medium text-gray-600 rounded-full border border-white/20 shadow-sm transition-all duration-300 cursor-pointer group flex items-center justify-center">
              Get started
              <div className="ml-3 w-fit h-fit group-hover:translate-x-1 transition-transform">
                <FaArrowRight />
              </div>
            </button>
          </Link>
          )
        }
      </div>
    </section>
  );
};

export default HeroSection;
