import React, { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import EventCard from "../Components/EventCard";
import HeroSection from "../Components/HeroSection";
import axios from "axios";
import { Skeleton } from "@/Components/ui/skeleton";
import { FaFilter } from "react-icons/fa";


const categories = [
  "All",
  "Technology",
  "Cultural",
  "Sports",
  "Workshop",
  "Entrepreneurship",
  "Social",
  "Art & Photography"
];

const Home = () => {
  const [events,setEvents] = useState(null);
  const [loadingFeed,setLoadingFeed] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterQuery,setFilterQuery] = useState("");
  const [filteredEvents,setFilteredEvents] = useState([]);

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


  useEffect(() => {
    if (events) {
      setFilteredEvents(
        selectedCategory === "All" 
          ? events 
          : events.filter(event => event.category === selectedCategory)
      );
    }
  }, [selectedCategory, events]); 

  const handleFilterQuery = ()=>{
    const query = filterQuery.toLowerCase();

    if(query === ""){
      setFilteredEvents(events);
    }else{
      const filtered = events?.filter(event => 
        event.name.toLowerCase().includes(query) || 
        event.shortDescription.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query)
      );
      setFilteredEvents(filtered);
    }
  }

  useEffect(() => {
    if (events) {
      handleFilterQuery();
    }
  }, [filterQuery, events]);

  // scroll function 
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  
  return (
    <div className="h-full">
      <HeroSection scrollToSection={scrollToSection} />

      <section id="Events" className="py-16 px-5">
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
              <button className="px-3 py-2 border-2 border-[#00A1A1] bg-transparent text-gray-800 rounded-lg cursor-pointer text-sm flex justify-center items-center">
                <div className="mr-2 text-lg"><IoSearchSharp /></div>
                <input onChange={(e)=>{setFilterQuery(e.target.value)}} placeholder="Filter Events" className="border-none text-gray-800 outline-none"/>
              </button>
              <div className="flex border border-gray-300 rounded-lg">
                {/* <button className="px-3 py-2 border-none bg-gray-100 cursor-pointer rounded-l-lg hover:bg-gray-200 transition-colors">
                  ⊞
                </button> */}
                <button className="px-3 py-2 border-none bg-transparent cursor-pointer rounded-lg hover:bg-gray-100 transition-colors">
                  <FaFilter className="text-lg text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <span
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-all duration-300 ${
                  category === selectedCategory
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
            filteredEvents && filteredEvents.length > 0 ?
              (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents?.map((event) => (
                  <EventCard key={event._id} {...event} />
                ))}
              </div>)
            :
              (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    No Events Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    No events match the selected category.
                  </p>
                </div>
              )
          }

          {/* <div className="text-center mt-12">
            <button className="px-6 py-3 border-2 border-[#A94442] bg-transparent text-[#A94442] rounded-lg cursor-pointer text-base font-semibold hover:bg-gradient-to-r from-[#C9514F] to-[#A94442] hover:text-white transition-all">
              Load More Events
            </button>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default Home;
