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
import AddSubAdmins from "@/Components/CreateEvent_Components/AddSubAdmins";
import { useUser } from "@/Context/UserContext";
import AddAdmin from "@/Components/CreateEvent_Components/AddAdmin";
import socket from "@/Socket/socket";

const CreateEventPage = () => {
    const {user} = useUser();
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
    status: "upcoming",
  });
  const [eventDate, setEventDate] = useState();
  const [selectedUsersIds, setSelectedUsersIds] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedAdmin,setSelectedAdmin] = useState();



  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
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
      newErrors.eventStartTime = "Event time is required";
    if (!formData.eventEndTime)
      newErrors.eventEndTime = "Event time is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.venue.trim()) newErrors.venue = "Venue is required";
    if (!formData.club.trim()) newErrors.club = "Club is required";

    if ((user && user.role==='student') && !selectedAdmin) newErrors.selectAdmin = "Select a faculty (Admin)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // admin event creation
  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    if(user && user.role!=='admin') return; 

    if (validateForm()) {
      try {
        const {name,shortDescription,details,capacity,image,eventStartTime, eventEndTime,category,venue,club,eventMode,status,} = formData;

        const BackendURL = import.meta.env.VITE_backendURL;
        const response = await axios.post(
          `${BackendURL}/api/event/new/admin`,
          {
            name,shortDescription,details,capacity,image,
            eventStartTime,eventEndTime, eventDate,category,venue,
            club,eventMode,status,

            selectedSubAdmins: selectedUsersIds,
          },
          { withCredentials: true }
        );

        console.log(response.data);
      } catch (error) {
        console.log("Error in creating admin-event - ", error);
      }
    }
  };


  // student event creation
  const handleStudentSubmit = async (e)=>{
    e.preventDefault();

    if(user && user.role!=='student') return; 

    if (validateForm() && selectedAdmin) {
      try {
        const {name,shortDescription,details,capacity,image,eventStartTime, eventEndTime,category,venue,club,eventMode,status,} = formData;

        const BackendURL = import.meta.env.VITE_backendURL;
        const response = await axios.post(
          `${BackendURL}/api/event/new/student`,
          {
            name,shortDescription,details,capacity,image,
            eventStartTime,eventEndTime, eventDate,category,venue,
            club,eventMode,status,
            
            selectedAdmin,
          },
          { withCredentials: true }
        );

        console.log(response.data);
      } catch (error) {
        console.log("Error in creating student-event - ", error);
      }
    }
  }

  // socket handlers 
  useEffect(()=>{
    if(!user) return;

    socket.on('new_event_created',(data)=>{
        console.log(data);
    })
  },[user])


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
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
                Create New Event
              </h1>
              <p className="mt-2 text-gray-500 max-w-2xl">
                Fill out the form below to create and publish a new event for
                the SKIT community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <form className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#00A1A1]/10 text-[#00A1A1] grid place-items-center text-sm">
                📋
              </div>
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="">
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

              {/* Event details */}
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
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Cultural">Cultural</SelectItem>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Competition">Competition</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Academic">Academic</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
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
                  <SelectTrigger className={`w-full py-2`}>
                    <SelectValue placeholder="Select Club" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Club</SelectLabel>
                      <SelectItem value="S&t">S&t</SelectItem>
                      <SelectItem value="Toast Master">Toast Master</SelectItem>
                      <SelectItem value="Club3">Club3</SelectItem>
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
                    id="time-picker1"
                    step="1"
                    value={formData.eventStartTime}
                    onChange={handleInputChange}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                  <span> to </span>
                  <Input
                    type="time"
                    name="eventEndTime"
                    id="time-picker2"
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
                    handleInputChange({ target: { name: "eventMode", value } })
                  }
                >
                  <SelectTrigger className={`w-full py-2`}>
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

          {
            (user && user.role === "admin") ? (
                <AddSubAdmins setSelectedUsersIds={setSelectedUsersIds} />
            )
            : (
                <AddAdmin setSelectedAdmin={setSelectedAdmin} errors={errors} />
            )
          }

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            {
            (user && user.role === 'admin') ?
                (
                <button onClick={handleAdminSubmit} className="primary-button px-8 py-3">
                    Create Event
                </button>
                )
            :
                (
                <button onClick={handleStudentSubmit} className="primary-button px-8 py-3">
                 Submit for Approval
                </button>
                )
            }
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
