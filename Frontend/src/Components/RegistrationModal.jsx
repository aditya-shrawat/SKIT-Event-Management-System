import React, { useEffect, useState, useRef } from "react";
import { Input } from "./ui/input";
import axios from "axios";
import { useUser } from "@/Context/UserContext.jsx";
import { RxCross2 } from "react-icons/rx";

const RegistrationModal = ({ event, getRegistrationStatus, onClose }) => {
  const {user} = useUser();
  const [errorMessage,setErrorMessage] = useState("");
  const [isRegistring,setIsRegistring] = useState(false);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  // close modal
  const onBackdropClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Registration button clicked ");

    if (isRegistring) return;
    setIsRegistring(true);

    try {
        const BackendURL = import.meta.env.VITE_backendURL;
        const response = await axios.post(`${BackendURL}/api/event/${event._id}/registration`,
            {eventId:event._id}
        ,{withCredentials:true});

        console.log(response.data.message);
        onClose();
    } catch (error) {
        console.log("Error in Registration - ",error);
        const message = error.response?.data?.error || 'Registration failed. Please try again.';
        setErrorMessage(message);
    }
    finally{
        getRegistrationStatus();
        setIsRegistring(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={onBackdropClick}
      className="w-screen h-full min-h-screen overflow-x-hidden fixed top-0 left-0 inset-0 z-[60] bg-black/50 backdrop-blur-sm overflow-y-auto p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="registration-title"
    >
      <div
        ref={panelRef}
        className="mx-auto my-10 md:my-20 w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div>
            <h2
              id="registration-title"
              className="text-2xl font-semibold text-gray-900"
            >
              Register for Event
            </h2>
            <p className="text-sm text-gray-600">
              Secure your spot for {event?.name || "this event"}.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 text-2xl cursor-pointer"
            aria-label="Close"
          >
            <RxCross2 />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 bg-gray-50">
          {/* Form */}
          <form onSubmit={handleSubmit} className="md:col-span-3 px-4 py-6 md:px-6 md:py-10 space-y-6 order-2">
            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 grid place-items-center text-sm">
                  👤
                </span>
                Your Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={user?.name}
                    readOnly
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={user?.email}
                    readOnly
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College ID
                  </label>
                  <Input
                    type="tel"
                    value={user?.collegeId}
                    readOnly
                    className="w-full"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <Input
                      type="text"
                      value={user?.branch}
                      readOnly
                      className="w-full"
                    />
                  </div>
                  <div> 
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semester
                    </label>
                    <Input
                      type="text"
                      value={user?.semester || "N/A"}
                      readOnly
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-1">
              {errorMessage && (
                  <div className="text-red-600 text-sm">
                      {errorMessage}
                  </div>
              )}
              <div className="flex md:justify-end pt-1">
              <button
                type="submit"
                className="primary-button px-8 py-2 w-full"
              >
                {isRegistring ? "Registering..." : "Register"}
              </button>
              </div>
            </div>
          </form>

          {/* Event Summary */}
          <aside className="md:col-span-2 px-4 py-6 md:px-6 md:py-10 border-t md:border-t-0 md:border-l border-gray-200 md:bg-gray-50 order-1">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div
                className="h-40 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    event?.image || "/dummyImage.webp"
                  })`,
                }}
                aria-hidden="true"
              />
              <div className="p-4 space-y-2">
                <div>
                <h4 className="font-semibold text-gray-900">
                  {event?.name || "Event Title"}
                </h4>
                <div className="text-sm text-gray-600 break-words">
                  {event?.shortDescription
                    && event.shortDescription}
                </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm pt-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 py-5">
                    <div className="text-xs text-gray-600">Date</div>
                    <div className="font-medium text-emerald-800">
                      {event?.date || "TBD"}
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 py-5">
                    <div className="text-xs text-gray-600">Time</div>
                    <div className="font-medium text-blue-800">
                      {`${event.eventStartTime} - ${event.eventEndTime}`}
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 py-5">
                    <div className="text-xs text-gray-600">Venue</div>
                    <div className="font-medium text-orange-800 break-words">
                      {event?.venue || "On Campus"}
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 py-5">
                    <div className="text-xs text-gray-600">Club</div>
                    <div className="font-medium text-purple-800">
                      {event?.club && `${event.club}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
