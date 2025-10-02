import React, { useEffect, useState, useMemo, useRef } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

const RegistrationModal = ({ event, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    semester: "",
    department: "",
  });
  const [isRegistring,setIsRegistring] = useState(false);
  const [errors, setErrors] = useState({});
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  // close modal
  const onBackdropClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  // handling input
  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!formData.fullName.trim()) next.fullName = "Full name is required";
    if (!formData.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      next.email = "Enter a valid email";
    if (!formData.phone.trim()) next.phone = "Phone no. is required";
    if(formData.phone.trim()!=="" && formData.phone.length !== 10) next.phone ="Enter valid phone no."
    if (!formData.department) next.department = "Department is required";
    if (!formData.semester) next.semester = "Semester is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Registration button clicked ");

    if (!validate() || isRegistring) return;
    setIsRegistring(true);

    try {
        const BackendURL = import.meta.env.VITE_backendURL;
        const response = await axios.post(`${BackendURL}/api/event/${event._id}/registration`,
            {...formData,eventId:event._id}
        ,{withCredentials:true});

        console.log(response.data.message);
        onClose();
    } catch (error) {
        console.log("Error in Registration - ",error);
    }
    finally{
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
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 text-3xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          {/* Form */}
          <form onSubmit={handleSubmit} className="md:col-span-3 px-6 py-10 space-y-6">
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
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setField("fullName", e.target.value)}
                    className={`w-full ${errors.fullName && "border-red-300"}`}
                    placeholder="Your full name"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setField("email", e.target.value)}
                    className={`w-full ${errors.email && "border-red-300"}`}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    className={`w-full ${errors.phone && "border-red-300"}`}
                    placeholder="Phone no."
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <Select
                        name="Department"
                        value={formData.department}
                        onValueChange={(value) => setField("department", value)}
                    >
                        <SelectTrigger
                            className={`w-full py-2 ${
                            errors.department && "border-red-300"
                            }`}
                        >
                            <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent className={'z-[70]'}>
                            <SelectGroup>
                                <SelectLabel>Department</SelectLabel>
                                <SelectItem value="CSE">CSE</SelectItem>
                                <SelectItem value="AI">AI</SelectItem>
                                <SelectItem value="IOT">IOT</SelectItem>
                                <SelectItem value="IT">IT</SelectItem>
                                <SelectItem value="ECE">ECE</SelectItem>
                                <SelectItem value="EE">EE</SelectItem>
                                <SelectItem value="ME">ME</SelectItem>
                                <SelectItem value="MBA">MBA</SelectItem>
                                <SelectItem value="Other">Other..</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {errors.department && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.department}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semester <span className="text-red-500">*</span>
                    </label>
                    <Select
                        name="Semester"
                        value={formData.semester}
                        onValueChange={(value) => setField("semester", value)}
                    >
                        <SelectTrigger
                            className={`w-full py-2 ${
                            errors.semester && "border-red-300"
                            }`}
                        >
                            <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent className={'z-[70]'}>
                            <SelectGroup>
                                <SelectLabel>Semester</SelectLabel>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="6">6</SelectItem>
                                <SelectItem value="7">7</SelectItem>
                                <SelectItem value="8">8</SelectItem>
                                <SelectItem value="Other">Other..</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.semester && (
                      <p className="mt-1 text-sm text-red-600">{errors.semester}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="outline-button px-8 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-button px-5 py-2"
              >
                {isRegistring ? "Confirming...":"Confirm Registration"}
              </button>
            </div>
          </form>

          {/* Event Summary */}
          <aside className="md:col-span-2 px-6 py-10 border-t md:border-t-0 md:border-l border-gray-200 bg-gray-50">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div
                className="h-36 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    event?.image || "/dummyImage.webp"
                  })`,
                }}
                aria-hidden="true"
              />
              <div className="p-4 space-y-2">
                <h4 className="font-semibold text-gray-900">
                  {event?.name || "Event Title"}
                </h4>
                <div className="text-sm text-gray-600">
                  {event?.club
                    ? `By ${event.club}`
                    : "SKIT Community"}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm pt-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="text-xs text-gray-600">Date</div>
                    <div className="font-medium text-emerald-800">
                      {event?.date || "TBD"}
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-xs text-gray-600">Time</div>
                    <div className="font-medium text-blue-800">
                      {`${event.eventStartTime} - ${event.eventEndTime}`}
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="text-xs text-gray-600">Venue</div>
                    <div className="font-medium text-orange-800">
                      {event?.venue || "On Campus"}
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="text-xs text-gray-600">Available</div>
                    <div className="font-medium text-purple-800">
                      {event?.maxAttendees && event?.attendees != null
                        ? `${Math.max(
                            event.maxAttendees - event.attendees,
                            0
                          )} spots`
                        : "Open"}
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
