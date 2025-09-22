import { useUser } from '@/Context/UserContext';
import React from 'react'
import { Link } from 'react-router-dom'

function EventCard({
  id,
  title,
  description,
  date,
  time,
  location,
  attendees,
  maxAttendees,
  category,
  image,
  organizer,
  registrationStatus,
}) {
  const {user} = useUser();

  return (
    <Link to={`/event/${id}`} className="rounded-xl shadow-md overflow-hidden transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-xl">
      {/* Event Image */}
      <div className="h-48 relative">
        <img src={image} className="w-full h-full object-cover" />
        <div
          className={`absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-[#00bebe] to-[#00A1A1] text-white rounded-md text-xs font-medium`}
        >
          {category}
        </div>
        <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 rounded-xl text-xs font-medium text-gray-700">
          {attendees}/{maxAttendees}
        </div>
      </div>

      {/* Event Content */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">{title}</h3>

        <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>

        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">📅</span>
            <span className="text-sm text-gray-700">{date}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">🕐</span>
            <span className="text-sm text-gray-700">{time}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">📍</span>
            <span className="text-sm text-gray-700">{location}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">👥</span>
            <span className="text-sm text-gray-700">By {organizer}</span>
          </div>
        </div>

        <div className={`flex ${(user) ? `justify-between`:`flex-row-reverse`} items-center`}>
          {
            (user && user.role==='student') && (
              <div>
                {registrationStatus ? (
                  <button className="border-2 border-[#00A1A1] px-4 py-2 text-sm rounded-md text-[#00A1A1] font-semibold">
                    {registrationStatus}
                  </button>
                ) : (
                  <button className="primary-button px-4 py-2 text-sm">
                    Register Now
                  </button>
                )}
              </div>
            )
          }

          {
            (user && user.role==='admin') && (
              <div>
                <button className="primary-button px-4 py-2 text-sm">
                  Analytics
                </button>
              </div>
            )
          }

          <button className="p-2 bg-transparent border border-gray-300 rounded-md cursor-pointer text-base hover:bg-gray-50 transition-colors">
            ❤️
          </button>
        </div>
      </div>
    </Link>
  )
}

export default EventCard;