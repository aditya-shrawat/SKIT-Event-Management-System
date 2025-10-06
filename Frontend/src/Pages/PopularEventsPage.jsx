import React, { useEffect, useState } from "react";
import EventCard from "../Components/EventCard";
import axios from "axios";
import { Skeleton } from "@/Components/ui/skeleton";

const PopularEventsPage = () => {
  const [popularEvents, setPopularEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPopularEvents = async () => {
    try {
      const BackendURL = import.meta.env.VITE_backendURL;
      const response = await axios.get(`${BackendURL}/api/event/popular-events`, {
        withCredentials: true,
      });

      setPopularEvents(response.data.popularEvents);
    } catch (error) {
      console.log("Error in fetching popular events :- ", error);
    }
    finally {
      setLoading(false);
    }
  }


  useEffect(()=>{
    fetchPopularEvents() ;
  },[]);

  return (
    <div className="min-h-screen">
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
        {loading ?
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_,index)=>(
              <div key={index} className="h-80 w-full max-w-96">
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
        :(
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularEvents?.map((event) => (
                <EventCard key={event._id} {...event} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularEventsPage;
