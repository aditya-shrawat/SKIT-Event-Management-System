import React, { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import EventCard from "../Components/EventCard";
import HeroSection from "../Components/HeroSection";
import axios from "axios";
import { Skeleton } from "@/Components/ui/skeleton";


const categories = [
  "All",
  "Technical",
  "Cultural",
  "Sports",
  "Workshop",
  "Social",
];

const Home = () => {
  const [events,setEvents] = useState(null);
  const [loadingFeed,setLoadingFeed] = useState(true);

  const getHomeFeed = async ()=>{
    try {
      const BackendURL = import.meta.env.VITE_backendURL;
      const response = await axios.get(`${BackendURL}/api/home/feed`,{withCredentials:true});

      setEvents(response.data.events);
    } catch (error) {
      console.log("Error in fetching hojme feed - ",error);
    }
    finally{
      setLoadingFeed(false);
    }
  }

  useEffect(()=>{
    getHomeFeed();
  },[]);

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
          {
            (loadingFeed)?
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_,index)=>(
                <div key={index} className="h-80 w-full max-w-96">
                  <Skeleton className="h-full w-full" />
                </div>
              ))}
            </div>
            :
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events?.map((event) => (
                <EventCard key={event._id} {...event} />
              ))}
            </div>
          }

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
