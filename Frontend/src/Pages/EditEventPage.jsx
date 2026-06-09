import RichTextEditor from "@/Components/CreateEvent_Components/RichTextEditor";
import { DatePicker } from "@/Components/ui/DatePicker";
import { Input } from "@/Components/ui/input";
import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
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
import { useUser } from "@/Context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import AddSubAdmins from "@/Components/CreateEvent_Components/AddSubAdmins";
 
const EditEventPage = () => {
  const { user } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [event, setEvent] = useState(null);
  const [selectedUsersIds, setSelectedUsersIds] = useState([]);
  const [existingSubAdmins, setExistingSubAdmins] = useState([]);
 
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    details: "",
    capacity: 50,
    image: "",
    eventStartTime: "",
    eventEndTime: "",
    category: "",
    venue: "",
    club: "",
    eventMode: "Offline",
  });
  const [eventDate, setEventDate] = useState();
  const [errors, setErrors] = useState({});
 

  useEffect(() => {
    if (!user) return;
 
    const fetchEvent = async () => {
      try {
        const BackendURL = import.meta.env.VITE_backendURL;
        const { data } = await axios.get(`${BackendURL}/api/event/${id}/details`, {
          withCredentials: true,
        });
 
        const ev = data.event || data.data || data;
 
        // Only the event admin can access this page
        if (ev.adminId?._id !== user._id && ev.adminId !== user._id) {
          navigate("/error", { replace: true });
          return;
        }
 
        // Block editing if terminal state
        if (ev.status === "cancelled" || ev.status === "completed") {
          navigate("/error", { replace: true });
          return;
        }
 
        setEvent(ev);
        setFormData({
          name: ev.name || "",
          shortDescription: ev.shortDescription || "",
          details: ev.details || "",
          capacity: ev.capacity || 50,
          image: ev.image || "",
          eventStartTime: ev.eventStartTime || "",
          eventEndTime: ev.eventEndTime || "",
          category: ev.category || "",
          venue: ev.venue || "",
          club: ev.club || "",
          eventMode: ev.eventMode || "Offline",
        });
        if (ev.eventDate) setEventDate(new Date(ev.eventDate));

        const existingSubAdmins = (ev.confirmedSubAdmins || []).map((u) => ({
            _id: u._id,
            name: u.name,
            collegeId: u.collegeId,
        }));
        setExistingSubAdmins(existingSubAdmins);

      } catch (err) {
        console.error("Error fetching event:", err);
        navigate("/error", { replace: true });
      } finally {
        setLoading(false);
      }
    };
 
    fetchEvent();
  }, [id, user, navigate]);
 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
    }
  };
 
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Event name is required";
    if (!formData.shortDescription.trim())
      newErrors.shortDescription = "Short description is required";
    if (!formData.details.trim())
      newErrors.details = "Event details are required";
    if (!eventDate) newErrors.eventDate = "Event date is required";
    if (!formData.eventStartTime)
      newErrors.eventStartTime = "Start time is required";
    if (!formData.eventEndTime) newErrors.eventEndTime = "End time is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.venue.trim()) newErrors.venue = "Venue is required";
    if (!formData.club.trim()) newErrors.club = "Club is required";

    if (Object.keys(newErrors).length > 0) {
        newErrors.submit = "Please fill in all required fields before saving.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
 
    setSubmitting(true);
    try {
      const BackendURL = import.meta.env.VITE_backendURL;
      await axios.patch(
        `${BackendURL}/api/event/${id}/update`,
        { ...formData, eventDate, confirmedSubAdmins: selectedUsersIds },
        { withCredentials: true }
      );
      navigate(`/event/${id}`);
    } catch (err) {
      console.error("Error updating event:", err);
      const msg = err.response?.data?.message || "Failed to update event.";
      setErrors((prev) => ({ ...prev, submit: msg }));
    } finally {
      setSubmitting(false);
    }
  };
 

  if (loading) {
    return (
      <div className="min-h-screen w-full">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-4 border-[#00A1A1]/30 border-t-[#00A1A1] animate-spin" />
            <p className="text-gray-500 text-sm">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }
 

  return (
    <div className="min-h-screen w-full">
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          {/* Grid pattern overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.06)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
 
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-28 -right-28 w-72 h-72 bg-gradient-to-br from-teal-400/15 to-teal-600/15 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-28 -left-28 w-72 h-72 bg-gradient-to-br from-teal-400/15 to-teal-600/15 rounded-full blur-3xl"></div>
          </div>
 
          <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    Edit Event
                  </h1>
                </div>
                <p className="mt-2 text-gray-500 max-w-2xl">
                  Update <span className="font-medium">"{event?.name}"</span> event details below.
                </p>
              </div>
            </div>
          </div>
        </section>
 
        {/* Form Section */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#00A1A1]/10 text-[#00A1A1] grid place-items-center text-sm">
                  📋
                </div>
                Basic Information
              </h2>
 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`py-2 ${errors.name && "border-red-300"}`}
                    placeholder="Enter event name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
 
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Image URL
                  </label>
                  <Input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="py-2"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
 
                <div className="md:col-span-2">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    className={`py-2 ${
                      errors.shortDescription && "border-red-300"
                    }`}
                    placeholder="Brief description of the event"
                  />
                  {errors.shortDescription && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.shortDescription}
                    </p>
                  )}
                </div>
 
                {/* Rich Text Editor for details */}
                <RichTextEditor
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
 
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="category"
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange({ target: { name: "category", value } })
                    }
                  >
                    <SelectTrigger
                      className={`w-full py-2 ${
                        errors.category && "border-red-300"
                      }`}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem value="Technology">Technical</SelectItem>
                        <SelectItem value="Cultural">Cultural</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Entrepreneurship">
                          Entrepreneurship
                        </SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Academic">Social</SelectItem>
                        <SelectItem value="Art & Photography">
                          Art & Photography
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.category}
                    </p>
                  )}
                </div>
 
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Club <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="club"
                    value={formData.club}
                    onValueChange={(value) =>
                      handleInputChange({ target: { name: "club", value } })
                    }
                  >
                    <SelectTrigger className="w-full py-2">
                      <SelectValue placeholder="Select Club" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Club</SelectLabel>
                        <SelectItem value="Science & Technology">
                          Science & Technology
                        </SelectItem>
                        <SelectItem value="Toast Master">
                          Toast Master
                        </SelectItem>
                        <SelectItem value="Coding Club">Coding Club</SelectItem>
                        <SelectItem value="Entrepreneurship Cell">
                          Entrepreneurship Cell
                        </SelectItem>
                        <SelectItem value="Cultural Committee">
                          Cultural Committee
                        </SelectItem>
                        <SelectItem value="Photography Club">
                          Photography Club
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.club && (
                    <p className="mt-1 text-sm text-red-600">{errors.club}</p>
                  )}
                </div>
              </div>
            </div>
 
            {/* Date & Time */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 grid place-items-center text-sm">
                  📅
                </div>
                Date & Time
              </h2>
 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    date={eventDate}
                    setDate={setEventDate}
                    errors={errors}
                  />
                  {errors.eventDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.eventDate}
                    </p>
                  )}
                </div>
 
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Time <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4 items-center">
                    <Input
                      type="time"
                      name="eventStartTime"
                      step="1"
                      value={formData.eventStartTime}
                      onChange={handleInputChange}
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                    <span className="text-gray-400 flex-shrink-0">to</span>
                    <Input
                      type="time"
                      name="eventEndTime"
                      step="1"
                      value={formData.eventEndTime}
                      onChange={handleInputChange}
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </div>
                  {(errors.eventStartTime || errors.eventEndTime) && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.eventStartTime || errors.eventEndTime}
                    </p>
                  )}
                </div>
              </div>
            </div>
 
            {/* Location & Capacity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 grid place-items-center text-sm">
                  📍
                </div>
                Location & Capacity
              </h2>
 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className={`py-2 ${errors.venue && "border-red-300"}`}
                    placeholder="Event venue location"
                  />
                  {errors.venue && (
                    <p className="mt-1 text-sm text-red-600">{errors.venue}</p>
                  )}
                </div>
 
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity
                  </label>
                  <Input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="Maximum attendees"
                  />
                </div>
 
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Mode
                  </label>
                  <Select
                    name="eventMode"
                    value={formData.eventMode}
                    onValueChange={(value) =>
                      handleInputChange({
                        target: { name: "eventMode", value },
                      })
                    }
                  >
                    <SelectTrigger className="w-full py-2">
                      <SelectValue placeholder="Select Event Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Event Mode</SelectLabel>
                        <SelectItem value="Offline">Offline</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
 
            {/* Edit sub admins */}
            {
                (user && user.role === "admin") && (
                    <AddSubAdmins setSelectedUsersIds={setSelectedUsersIds} existingSubAdmins={existingSubAdmins}  />
                )
            }


            {errors.submit && (
                <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4">
                <span className="text-red-500">⚠️</span>
                <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
            )}

 
            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pb-8">
              <button
                type="button"
                onClick={() => navigate(`/event/${id}`)}
                className="px-8 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="primary-button px-8 py-3 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
 
export default EditEventPage;