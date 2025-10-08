import { useUser } from "@/Context/UserContext";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RegistrationModal from "./RegistrationModal";
import axios from "axios";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import AnalyticsModel from "./AnalyticsModel";

function EventCard({
  _id,
  name,
  shortDescription,
  eventDate,
  eventStartTime,
  eventEndTime,
  venue,
  category,
  image,
  club,
  moderationStatus,
  submittedBy
}) {
  const { user } = useUser();
  const [registrationStatus, setRegistrationStatus] = useState(false);
  const [likeStatus,setLikeStatus] = useState(false);
  const [isRegistrationOpen,setIsRegistrationOpen] = useState(false)
  const [isAnalyticsOpen,setIsAnalyticsOpen] = useState(false);

  const formattedDate = dayjs(eventDate).format("DD MMM, YYYY");
  // Attached a dummy date so dayjs can parse correctly
  const formattedStartTime = dayjs(`1970-01-01T${eventStartTime}`).format(
    "h:mm A"
  );
  const formattedEndTime = dayjs(`1970-01-01T${eventEndTime}`).format("h:mm A");


  const getRegistrationStatus = async ()=>{
    if(user && user.role !== "student") return ;
    try {
      const BackendURL = import.meta.env.VITE_backendURL;
      const response = await axios.get(`${BackendURL}/api/event/${_id}/registration/status`,
        {withCredentials:true});

      if(response.data && response.data.status){
        setRegistrationStatus(response.data.status) ;
      }
    } catch (error) {
      console.log("Error in fetching registration status :- ",error) ;
    }
  }

  const fetchLikeStatus = async ()=>{
    try {
      const BackendURL = import.meta.env.VITE_backendURL;
      const response = await axios.get(`${BackendURL}/api/event/${_id}/feedback/status`,
        {withCredentials:true});

      if(response.data && response.data.isLiked){
        setLikeStatus(response.data.isLiked) ;
      }
    } catch (error) {
      console.log("Error in fetching like status :- ",error) ;
    }
  }

  useEffect(()=>{
    if(!user) return;
    getRegistrationStatus() ;
    fetchLikeStatus() ;
  },[user]) ;


  const toggleLikeEvent = async () => {
    try {
      const BackendURL = import.meta.env.VITE_backendURL;
      const response = await axios.post(`${BackendURL}/api/event/${_id}/feedback`, {}, { withCredentials: true });

      if (response.data && typeof response.data.isLiked === "boolean") {
        setLikeStatus(response.data.isLiked);  // set true or false always
      }
    } catch (error) {
      console.log("Error in toggling like status :- ", error);
    }
  };



  return (
    <>
    <div className="relative rounded-xl shadow-md overflow-hidden transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/event/${_id}`}>
        {/* Event Image */}
        <div className="h-48 relative">
          <img
            src={image ? image : "/dummyImage.webp"}
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-[#00bebe] to-[#00A1A1] text-white rounded-md text-xs font-medium`}
          >
            {category}
          </div>
          {/* <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 rounded-xl text-xs font-medium text-gray-700">
            {attendees}/{maxAttendees}
          </div> */}
        </div>

        {/* Event Content */}
        <div className={`p-5 ${user && `pb-14`} `}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
            {name}
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {shortDescription}
          </p>

          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">📅</span>
              <span className="text-sm text-gray-700">{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">🕐</span>
              <span className="text-sm text-gray-700">{`${formattedStartTime} - ${formattedEndTime}`}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">📍</span>
              <span className="text-sm text-gray-700">{venue}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">👥</span>
              <span className="text-sm text-gray-700">By {club}</span>
            </div>
          </div>
        </div>
      </Link>

        {user && (
          <div className="absolute left-5 bottom-5">
            {/* Case 1: Student (not subadmin, not submitter) → Registration / Registration status */}
            {user.role === "student" &&
              submittedBy?.toString() !== user._id?.toString() &&
              registrationStatus !== "Sub-admin" && (
                (registrationStatus === "Registered" ||
                registrationStatus === "Waitlist" ||
                registrationStatus === "Cancelled") ? (
                  <button className="border-2 border-[#00A1A1] px-4 py-2 text-sm rounded-md text-[#00A1A1] font-semibold">
                    {registrationStatus}
                  </button>
                ) : registrationStatus === "not-registered" ? (
                  <div onClick={() => setIsRegistrationOpen(true)}>
                    <button className="primary-button px-4 py-2 text-sm">Register Now</button>
                  </div>
                ) : null
            )}

            {/* Case 2: Admin only → Analytics only */}
            {user.role === "admin" &&
              submittedBy?.toString() !== user._id?.toString() && (
                <button onClick={()=>{setIsAnalyticsOpen(true)}} className="primary-button px-4 py-2 text-sm">Analytics</button>
              )}

            {/* Case 3: Sub-admin only (not submitter) → Analytics only */}
            {registrationStatus === "Sub-admin" &&
              submittedBy?.toString() !== user._id?.toString() && (
                <button onClick={()=>{setIsAnalyticsOpen(true)}} className="primary-button px-4 py-2 text-sm">Analytics</button>
            )}

            {/* Case 4: Sub-admin + Submitter → Analytics + Moderation */}
            {registrationStatus === "Sub-admin" &&
              submittedBy?.toString() === user._id?.toString() && (
                <>
                  <button onClick={()=>{setIsAnalyticsOpen(true)}} className="primary-button px-4 py-2 text-sm">Analytics</button>

                  {moderationStatus && (
                    <button className="ml-2 border-2 border-[#00A1A1] px-4 py-1.5 text-sm rounded-md text-[#00A1A1] font-semibold">
                      {moderationStatus}
                    </button>
                  )}
                </>
            )}

            {/* Case 5: Submitter only (not subadmin, not admin) → Moderation only */}
            {submittedBy?.toString() === user._id?.toString() &&
              registrationStatus !== "Sub-admin" &&
              user.role !== "admin" &&
              moderationStatus && (
                <button className="border-2 border-[#00A1A1] px-4 py-1.5 text-sm rounded-md text-[#00A1A1] font-semibold">
                  {moderationStatus}
                </button>
            )}
          </div>
        )}

        {user && (
          <div onClick={toggleLikeEvent} className="absolute right-5 bottom-5">
            {likeStatus ? (
              <button className="p-1.5 bg-transparent rounded-md cursor-pointer text-xl text-amber-400 hover:bg-gray-200">
                <AiFillLike />
              </button>
            ) : (
              <button className="bottom-5 p-1.5 bg-transparent rounded-md cursor-pointer text-xl hover:bg-gray-200">
                <AiOutlineLike />
              </button>
            )}
          </div>
        )}

    </div>
    {
      (isRegistrationOpen) &&
      <RegistrationModal
        event={{ _id:_id, name:name, club:club, date: formattedDate, eventStartTime: formattedStartTime, eventEndTime: formattedEndTime, image: image, venue: venue }}
        onClose={() => setIsRegistrationOpen(false)}
      />
    }
    {
      (isAnalyticsOpen) &&
      <AnalyticsModel
        onClose={() => setIsAnalyticsOpen(false)}  eventId={_id}
      />
    }
    </>
  );
}

export default EventCard;
