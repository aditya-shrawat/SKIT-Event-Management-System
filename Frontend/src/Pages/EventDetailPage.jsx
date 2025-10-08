import RegistrationModal from "@/Components/RegistrationModal";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { useUser } from "@/Context/UserContext";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { Skeleton } from "@/Components/ui/skeleton";
import AnalyticsModel from "@/Components/AnalyticsModel";


const EventDetailPage = () => {
  const {user} = useUser();
  const params = useParams();
  const eventId = params.id;
  const [event,setEvent] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(false);
  const [loading,setLoading] = useState(true);
  const [isRegistrationOpen,setIsRegistrationOpen] = useState(false);
  const [isAnalyticsOpen,setIsAnalyticsOpen] = useState(false);

  const [formattedDate,setFormattedDate] = useState("DD MMM, YYYY");
  const [formattedStartTime,setFormattedStartTime]  = useState("00:00");
  const [formattedEndTime,setFormattedEndTime]  = useState("00:00");

  // fetching event details
  const fetchEventDetail = async ()=>{
    try {
      const BackendURL = import.meta.env.VITE_backendURL;
      const response = await axios.get(`${BackendURL}/api/event/${eventId}/details`,{withCredentials:true});

      setEvent(response.data.event);
    } catch (error) {
      console.log("Error while fetching event details - ",error)
    }
    finally{
      setLoading(false)
    }
  }

  const getRegistrationStatus = async ()=>{
    if(user && user.role !== "student") return ;
    try {
      const BackendURL = import.meta.env.VITE_backendURL;
      const response = await axios.get(`${BackendURL}/api/event/${eventId}/registration/status`,
        {withCredentials:true});

      if(response.data && response.data.status){
        setRegistrationStatus(response.data.status) ;
      }
    } catch (error) {
      console.log("Error in fetching registration status :- ",error) ;
    }
  }

  useEffect(()=>{
    if(!eventId) return;
    fetchEventDetail();
  },[eventId])

  useEffect(()=>{
    if(!eventId || !user) return;
    getRegistrationStatus() ;
  },[eventId,user])


  useEffect(()=>{
    if(event){
      setFormattedDate( dayjs(event.eventDate).format("DD MMM, YYYY") );
      // Attached a dummy date so dayjs can parse correctly
      setFormattedStartTime( dayjs(`1970-01-01T${event.eventStartTime}`).format("h:mm A") );
      setFormattedEndTime( dayjs(`1970-01-01T${event.eventEndTime}`).format("h:mm A") );
    }
  },[event,user])

  return (
    <div className="relative">
    
    {
    (loading) ?
      <div className="min-h-screen w-full">
         <div className="h-96 w-full">
           <Skeleton className="h-full w-full" />
         </div>
         <div className="w-full px-5 py-12">
            <div className="w-full max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:justify-between gap-6 w-full">
                <div className="h-64 sm:h-80 lg:h-auto flex-1">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="flex flex-col gap-6 w-full lg:w-[40%]">
                  <Skeleton className="h-48 sm:h-56 w-full" />
                  <Skeleton className="h-40 sm:h-56 w-full" />
                </div>
              </div>
            </div>
          </div>
      </div>
    :
    <div className="min-h-screen">
      {/* Hero Section with Event Image */}
      <div className="relative h-96">
        <div className="absolute inset-0 bg-black/70"></div>
          {(event) && 
            <img src={event.image!=="" ? event.image : "/dummyImage.webp"} 
                className="w-full h-full object-cover mix-blend-overlay"/>
          }
        <div className="absolute inset-0 flex items-center justify-center">
          {event && 
            <div className="text-center text-white px-4">
              <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#00bebe] to-[#00A1A1] text-white rounded-md text-sm font-medium mb-4">
                {event.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {event.name}
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                {event.shortDescription}
              </p>
            </div>
          }
        </div>
      </div>

      {/* Event Details */}
      <div className="w-full px-5 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Event Details
              </h2>

              {/* <div className="space-y-6">
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
              </div> */}

              {event && 
                <div
                  className="space-y-6"
                  dangerouslySetInnerHTML={{ __html: event.details }}
                />
              }
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
                    <p className="text-gray-600 text-sm">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="mr-3 mt-1">🕒</span>
                  <div>
                    <p className="font-medium text-gray-800">Time</p>
                    <p className="text-gray-600 text-sm">{`${formattedStartTime} - ${formattedEndTime}`}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="mr-3 mt-1">📍</span>
                  <div>
                    <p className="font-medium text-gray-800">Venue</p>
                    {event && <p className="text-gray-600 text-sm">{event.venue}</p>}
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="mr-3 mt-1">👥</span>
                  <div>
                    <p className="font-medium text-gray-800">Organizer</p>
                    {event && <p className="text-gray-600 text-sm">{`${event.club} club`}</p>}
                  </div>
                </div>

                {/* faculty cordinatior */}
                <Popover>
                  <PopoverTrigger className="w-full">
                    <div className="flex items-start cursor-pointer">
                      <span className="mr-3 mt-1">🧑‍💼</span>
                      <div className="w-full flex justify-between items-center">
                        <div className="flex flex-col items-start">
                          <p className="font-medium text-gray-800">Faculty Cordinator (Admin)</p>
                          {event && <p className="text-gray-600 text-sm">{event.adminId.name}</p>}
                        </div>
                        <span><IoIosArrowForward /></span>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <div className="w-64 md:w-80 p-3">
                      <div>
                        <p className="font-medium text-gray-800">Faculty Cordinator (Admin)</p>
                        <div className="flex items-center mt-2">
                          {/* Avatar with first letter of name */}
                          <div className="mr-3">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#C9514F] to-[#A94442] font-semibold text-white flex justify-center items-center overflow-hidden">
                              {event.adminId.name ? event.adminId.name.charAt(0).toUpperCase() : "U"}
                            </div>
                          </div>
                          {/* Name + Branch */}
                          <div className="w-full h-auto">
                            <h2 className="font-semibold text-gray-700">{event.adminId.name}</h2>
                            <p className="text-xs text-gray-500">{event.adminId.branch}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Sub admin (student cordinatior) section  */}
                { (event && event.confirmedSubAdmins) &&
                <Popover>
                  <PopoverTrigger className="w-full">
                    <div className="flex items-center w-full py-1 cursor-pointer">
                      <span className="mr-3 mt-1">🧑‍🤝‍🧑</span>
                      <div className="w-full flex justify-between items-center">
                        <p className="font-medium text-gray-800">Student Cordinators</p>
                        <span><IoIosArrowForward/></span>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <p className="font-medium text-gray-800 px-3 pt-2">Student Cordinators</p>
                    <div className="w-64 md:w-80 p-2">
                      {event.confirmedSubAdmins?.map((user, index) => (
                        <div
                          key={user._id || index}
                          className="px-2 py-1 text-gray-600 text-sm flex items-center whitespace-nowrap"
                        >
                          <div className="flex items-center">
                            {/* Avatar with first letter of name */}
                            <div className="mr-3">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#C9514F] to-[#A94442] font-semibold text-white flex justify-center items-center overflow-hidden">
                                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                              </div>
                            </div>
                            {/* Name + Branch */}
                            <div className="w-full h-auto">
                              <h2 className="font-semibold text-gray-700">{user.name}</h2>
                              <p className="text-xs text-gray-500">{user.branch}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                }

              </div>
            </div>


            {user ? (
              <>
                {/* Case 1: Student (not subadmin, not submitter) → Registration / Registration status */}
                {user.role === "student" &&
                  event.submittedBy?.toString() !== user._id?.toString() &&
                  registrationStatus !== "Sub-admin" && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <p className="text-gray-600 leading-relaxed text-center mb-6">
                        Join the excitement. <br /> Register and connect with peers!
                      </p>

                      {(registrationStatus === "Registered" ||
                      registrationStatus === "Waitlist" ||
                      registrationStatus === "Cancelled") ? (
                        <button className="border-2 border-[#00A1A1] w-full py-3 px-6 rounded-md text-[#00A1A1] font-semibold">
                          {registrationStatus}
                        </button>
                      ) : registrationStatus === "not-registered" ? (
                        <button
                          onClick={() => setIsRegistrationOpen(true)}
                          className="primary-button w-full py-3 px-6"
                        >
                          Register for Event
                        </button>
                      ) : null}
                    </div>
                )}

                {/* Case 2: Admin only → Analytics only */}
                {user.role === "admin" &&
                  event.submittedBy?.toString() !== user._id?.toString() && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <p className="text-gray-600 leading-relaxed text-center mb-6">
                        Track event performance. <br /> View insightful analytics and make
                        informed decisions.
                      </p>
                      <button onClick={()=>{setIsAnalyticsOpen(true)}} className="primary-button w-full py-3 px-6">Analytics</button>
                    </div>
                )}

                {/* Case 3: Sub-admin only (not submitter) → Analytics only */}
                {registrationStatus === "Sub-admin" &&
                  event.submittedBy?.toString() !== user._id?.toString() && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <p className="text-gray-600 leading-relaxed text-center mb-6">
                        Track event performance. <br /> View insightful analytics and make
                        informed decisions.
                      </p>
                      <button onClick={()=>{setIsAnalyticsOpen(true)}} className="primary-button w-full py-3 px-6">Analytics</button>
                    </div>
                )}

                {/* Case 4: Sub-admin + Submitter → Analytics + Moderation */}
                {registrationStatus === "Sub-admin" &&
                  event.submittedBy?.toString() === user._id?.toString() && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <p className="text-gray-600 leading-relaxed text-center mb-6">
                        Manage your event. <br /> Track analytics and review moderation status.
                      </p>
                      <div className="flex gap-2">
                        <button onClick={()=>{setIsAnalyticsOpen(true)}} className="primary-button w-full py-3 px-6">Analytics</button>
                        {event.moderationStatus && (
                          <button className="border-2 border-[#00A1A1] w-full py-3 px-6 rounded-md text-[#00A1A1] font-semibold">
                            {event.moderationStatus}
                          </button>
                        )}
                      </div>
                    </div>
                )}

                {/* Case 5: Submitter only (not subadmin, not admin) → Moderation only */}
                {event.submittedBy?.toString() === user._id?.toString() &&
                  registrationStatus !== "Sub-admin" &&
                  user.role !== "admin" &&
                  event.moderationStatus && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <p className="text-gray-600 leading-relaxed text-center mb-6">
                        Your event is under review. <br /> Track its moderation status below.
                      </p>
                      <button className="border-2 border-[#00A1A1] w-full py-3 px-6 rounded-md text-[#00A1A1] font-semibold">
                        {event.moderationStatus}
                      </button>
                    </div>
                )}
              </>
            ) : (
              // Case 6: Not signed in → Sign Up
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <p className="text-gray-600 leading-relaxed text-center mb-6">
                  Join the excitement. <br /> Sign Up and register for the event.
                </p>
                <Link to={'/signup'}>
                  <button className="primary-button w-full py-3 px-6">Sign Up</button>
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
      </div>
    </div>
    }

    { (isRegistrationOpen) &&
      <RegistrationModal
        event={{ _id:event._id, name: event.name, club: event.club, date: formattedDate, eventStartTime: formattedStartTime, eventEndTime: formattedEndTime, image: event.image, venue: event.venue }}
        onClose={() => setIsRegistrationOpen(false)}
      />
    }
    {
      (isAnalyticsOpen) &&
      <AnalyticsModel
        onClose={() => setIsAnalyticsOpen(false)}  eventId={event._id}
      />
    }
    </div>
  );
};

export default EventDetailPage;
