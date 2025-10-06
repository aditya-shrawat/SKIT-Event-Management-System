import { Skeleton } from "@/Components/ui/skeleton";
import axios from "axios";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import socket from "@/Socket/socket";

const EventRequests = () => {
  const [requestedEvents, setRequestedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequestedEvents = async () => {
    try {
      const BackendURL = import.meta.env.VITE_backendURL;
      const response = await axios.get(
        `${BackendURL}/api/event/event-requests`,
        { withCredentials: true }
      );

      setRequestedEvents(response.data.events);
    } catch (error) {
      console.log("Error in fetching requested events :- ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestedEvents();
  }, []);

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
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                Event Requests
              </h1>
              <p className="mt-2 text-gray-500 max-w-2xl">
                Keep track of your registrations at a glance — clear, simple,
                organized.
              </p>
            </div>

            {(() => {
              const pendingApprovalCount = requestedEvents.filter(
                (e) => e.moderationStatus === "PENDING"
              ).length;
              const approvedCount = requestedEvents.filter(
                (e) => e.moderationStatus === "APPROVED"
              ).length;
              const rejectedCount = requestedEvents.filter(
                (e) => e.moderationStatus === "REJECTED"
              ).length;
              return (
                <div className="w-full md:w-auto">
                  <div className="bg-white/80 backdrop-blur-sm border border-[#00A1A1]/30 shadow-sm rounded-2xl">
                    <div className="grid grid-cols-3 divide-x divide-[#00A1A1]/20">
                      {/* Assigned as sub-admin */}
                      {/* <div className="p-4 md:p-5 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-[#00A1A1]/10 text-[#00A1A1] grid place-items-center">🏁</div>
                        <div>
                          <div className="text-xs text-gray-500">Assigned</div>
                          <div className="mt-0.5 text-xl md:text-2xl font-semibold text-gray-900">{assignedEvents}</div>
                        </div>
                      </div> */}
                      {/* Approved */}
                      <div className="p-4 md:p-5 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-green-500/10 text-green-600 grid place-items-center">
                          ✅
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Approved</div>
                          <div className="mt-0.5 text-xl md:text-2xl font-semibold text-green-600">
                            {approvedCount}
                          </div>
                        </div>
                      </div>
                      {/* Pending Approval */}
                      <div className="p-4 md:p-5 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 grid place-items-center">
                          ⏳
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Pending</div>
                          <div className="mt-0.5 text-xl md:text-2xl font-semibold text-amber-600">
                            {pendingApprovalCount}
                          </div>
                        </div>
                      </div>
                      {/* Rejected */}
                      <div className="p-4 md:p-5 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-red-500/10 text-red-600 grid place-items-center text-sm">
                          ❌
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Rejected</div>
                          <div className="mt-0.5 text-xl md:text-2xl font-semibold text-red-600">
                            {rejectedCount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-80 w-full max-w-96">
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
        ) : requestedEvents && requestedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requestedEvents?.map((event) => (
              <RequestedEvent key={event._id} {...event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Event Requests Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You have no event requests at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRequests;

function RequestedEvent({
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
  adminId,
  moderationStatus,
  submittedBy,
}) {
  const formattedDate = dayjs(eventDate).format("DD MMM, YYYY");
  // Attached a dummy date so dayjs can parse correctly
  const formattedStartTime = dayjs(`1970-01-01T${eventStartTime}`).format(
    "h:mm A"
  );
  const formattedEndTime = dayjs(`1970-01-01T${eventEndTime}`).format("h:mm A");

  // admin invitation (Permission) - approve
  const approve_student_event = async () => {
    try {
      socket.emit("approve_student_event", {
        eventId: _id,
        adminId: adminId,
        senderId: submittedBy._id,
      });

      moderationStatus= "APPROVED";
    } catch (error) {
      console.log("Error in approving student event - ", error);
    }
  };

  // admin invitation (Permission) - reject
  const reject_student_event = async () => {
    try {
      socket.emit("reject_student_event", {
        eventId: _id,
        adminId: adminId,
        senderId: submittedBy._id,
      });

      moderationStatus= "REJECTED";
    } catch (error) {
      console.log("Error in accepting sub admin invitation - ", error);
    }
  };

  return (
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
        <div className={`p-5 pb-14 `}>
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

      {moderationStatus === "PENDING" && (
        <div className="w-full flex gap-6 px-5 absolute left-0 bottom-5">
          <button
            onClick={reject_student_event}
            className="outline-button flex-1 px-2 py-1"
          >
            Reject
          </button>
          <button
            onClick={approve_student_event}
            className="primary-button flex-1 px-2 py-1"
          >
            Approve
          </button>
        </div>
      )}

      {(moderationStatus === "APPROVED" || moderationStatus === "REJECTED") && (
        <div className="absolute left-5 bottom-5">
          <button className="border-2 border-[#00A1A1] px-4 py-2 text-sm rounded-md text-[#00A1A1] font-semibold">
            {moderationStatus}
          </button>
        </div>
      )}
    </div>
  );
}
