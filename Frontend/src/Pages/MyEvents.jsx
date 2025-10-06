import React, { useEffect, useState } from 'react'
import EventCard from '../Components/EventCard';
import { useUser } from '@/Context/UserContext';
import axios from 'axios';
import { Skeleton } from '@/Components/ui/skeleton';

const MyEvents = () => {
  const [myEvents,setMyEvents] = useState([]);
  const {user} = useUser()
  const [loading,setLoading] = useState(true) ;


  const fetchMyEvents_admin = async ()=>{
    try {
      const BackendURL = import.meta.env.VITE_backendURL;
      const response = await axios.get(`${BackendURL}/api/event/admin/my-events`,{ withCredentials: true });

      setMyEvents(response.data.events) ;
    } catch (error) {
      console.log("Error in fetching my events :- ",error) ;
    }
    finally{
      setLoading(false) ;
    }
  }

  const fetchMyEvents_subAdmin = async ()=>{
    try {
      const BackendURL = import.meta.env.VITE_backendURL;
      const response = await axios.get(`${BackendURL}/api/event/sub-admin/my-events`,{ withCredentials: true });

      setMyEvents(response.data.events) ;
    } catch (error) {
      console.log("Error in fetching my events (Sub-Admin) :- ",error) ;
    }
    finally{
      setLoading(false) ;
    }
  }

  useEffect(()=>{
    if(!user) return ;

    if(user.role === "admin"){
      fetchMyEvents_admin() ;
    }
    else if(user.role === "student"){
      fetchMyEvents_subAdmin() ;
    }
  },[user]);


  return (
    <div className="min-h-screen ">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Grid pattern overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.06)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        {/* Soft decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-28 -right-28 w-72 h-72 bg-gradient-to-br from-teal-400/15 to-teal-600/15 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-28 -left-28 w-72 h-72 bg-gradient-to-br from-teal-400/15 to-teal-600/15 rounded-full blur-3xl"></div>
        </div>

        {
          (user && user.role === "admin") 
        ?
          <div className='relative z-10 max-w-6xl mx-auto px-4 py-16'>
            <div>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">My Events</h1>
              <p className="mt-2 text-gray-500 max-w-2xl">Events where you collaborate as a admin — quick overview and status.</p>
            </div>
          </div>
        :
        (<div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
          {(() => {
            const assignedEvents = myEvents.filter((e)=> e.submittedBy?.toString() !== user._id?.toString()).length
            const pendingApprovalCount = myEvents.filter((e) => e.moderationStatus === "PENDING").length
            const approvedCount = myEvents.filter((e) => e.submittedBy?.toString()==user._id?.toString() && e.moderationStatus === "APPROVED").length
            const rejectedCount = myEvents.filter((e) => e.submittedBy?.toString()==user._id?.toString() && e.moderationStatus === "REJECTED").length
            return (
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                <div>
                  <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">My Sub-admin Events</h1>
                  <p className="mt-2 text-gray-500 max-w-2xl">Events where you collaborate as a sub-admin — quick overview and status.</p>
                </div>

                {/* Stats */}
                <div className="w-full md:w-auto">
                  <div className="bg-white/80 backdrop-blur-sm border border-[#00A1A1]/30 shadow-sm rounded-2xl">
                    <div className="grid grid-cols-4 divide-x divide-[#00A1A1]/20">
                      {/* Assigned as sub-admin */}
                      <div className="p-4 md:p-5 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-[#00A1A1]/10 text-[#00A1A1] grid place-items-center">🏁</div>
                        <div>
                          <div className="text-xs text-gray-500">Assigned</div>
                          <div className="mt-0.5 text-xl md:text-2xl font-semibold text-gray-900">{assignedEvents}</div>
                        </div>
                      </div>
                      {/* Approved */}
                      <div className="p-4 md:p-5 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-green-500/10 text-green-600 grid place-items-center">✅</div>
                        <div>
                          <div className="text-xs text-gray-500">Approved</div>
                          <div className="mt-0.5 text-xl md:text-2xl font-semibold text-green-600">{approvedCount}</div>
                        </div>
                      </div>
                      {/* Pending Approval */}
                      <div className="p-4 md:p-5 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 grid place-items-center">⏳</div>
                        <div>
                          <div className="text-xs text-gray-500">Pending</div>
                          <div className="mt-0.5 text-xl md:text-2xl font-semibold text-amber-600">{pendingApprovalCount}</div>
                        </div>
                      </div>
                      {/* Rejected */}
                      <div className="p-4 md:p-5 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-red-500/10 text-red-600 grid place-items-center text-sm">❌</div>
                        <div>
                          <div className="text-xs text-gray-500">Rejected</div>
                          <div className="mt-0.5 text-xl md:text-2xl font-semibold text-red-600">{rejectedCount}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>)
        }
      </section>

      {/* Events Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {
        loading ?
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_,index)=>(
              <div key={index} className="h-80 w-full max-w-96">
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
        :
          myEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEvents?.map((event) => (
                  <EventCard key={event._id} { ...event } />
              ))}
            </div>
          ) 
        : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛠️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Events Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You are not a Admin or Sub-admin for any events currently.
              </p>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default MyEvents