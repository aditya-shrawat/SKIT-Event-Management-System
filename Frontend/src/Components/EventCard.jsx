import { useUser } from "@/Context/UserContext";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";

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
  const formattedDate = dayjs(eventDate).format("DD MMM, YYYY");
  // Attached a dummy date so dayjs can parse correctly
  const formattedStartTime = dayjs(`1970-01-01T${eventStartTime}`).format(
    "h:mm A"
  );
  const formattedEndTime = dayjs(`1970-01-01T${eventEndTime}`).format("h:mm A");



  return (
    <>
    <div className="relative rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div>
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
        <div className={`p-5 pb-0`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight truncate">
            {name}
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed mb-4 truncate">
            {shortDescription}
          </p>

          <div className="space-y-2">
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

        <div className="p-5 flex items-center">
          <Link to={`/event/${_id}`} className="outline-button py-2 px-6 hover:bg-gray-100 text-center w-full">
            View Details
          </Link>
        </div>
      </div>

    </div>
    </>
  );
}

export default EventCard;
