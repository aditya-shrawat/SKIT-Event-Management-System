import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React, { useEffect, useRef, useState } from "react";
import RegistrationTrendChart from "./ui/Registration-trend-chart";
import CapacityGauge from "./ui/Capacity-gauge";
import DepartmentBreakdown from "./ui/Department-breakdown";
import axios from "axios";
import dayjs from "dayjs";
import { set } from "date-fns";
import { AiFillLike } from "react-icons/ai";



function AnalyticsModel({ onClose, eventId }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const [event,setEvent] = useState();
  const [analytics,setAnalytics] = useState();
  const [loading,setLoading] = useState(false)

  const [remainingCapacity,setRemainingCapacity] = useState(0);
  const [percentCapacity,setPercentCapacity] = useState(0);
  const [formattedDate,setFormattedDate] = useState("");
  const [formattedStartTime,setFormattedStartTime] = useState("");
  const [formattedEndTime,setFormattedEndTime] = useState("");


  // close modal
  const onBackdropClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  const getEventAnalytics = async ()=>{
    try {
        const BackendURL = import.meta.env.VITE_backendURL;
        const response = await axios.get(`${BackendURL}/api/event/${eventId}/analytics`,{withCredentials:true});

        setEvent(response.data.eventDetails);
        setAnalytics(response.data.analytics);
    } catch (error) {
        console.log("Error while fetching event analytics - ",error)
    }
    finally{
        setLoading(false);
    }
  }

  useEffect(()=>{
    if(eventId){
        getEventAnalytics();
    }
  },[eventId])


  useEffect(()=>{
    if(event && analytics){
        setRemainingCapacity(event.capacity - analytics.totalRegisteredUsers);
        setPercentCapacity(Math.round((analytics.totalRegisteredUsers / event.capacity) * 100)); 

        setFormattedDate(dayjs(event.eventDate).format("DD MMM, YYYY"));
        setFormattedStartTime(dayjs(`1970-01-01T${event.eventStartTime}`).format("h:mm A" ));
        setFormattedEndTime(dayjs(`1970-01-01T${event.eventEndTime}`).format("h:mm A"));
    }
  },[event,analytics]) ;


    const transformBranchData = (branchWiseCount) => {
        if (!branchWiseCount) return [];
        
        return Object.entries(branchWiseCount).map(([department, count]) => ({
            department: department.toUpperCase(), // Convert 'cse' to 'CSE'
            count: count
        }));
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
        className="mx-auto my-10 md:my-20 w-full max-w-6xl rounded-2xl shadow-xl overflow-hidden bg-background"
      >
        {(!loading && event && analytics) &&
        <main className="w-full space-y-6 relative">
          <header className="flex flex-col gap-2 px-8 pt-10 pb-8 border-b-gray-300 border-[1px] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <h1 className="text-pretty text-2xl font-semibold tracking-tight">
              Event Analytics
            </h1>
            <p className="text-muted-foreground">
              Overview of registrations, capacity, and attendee details for the
              selected event.
            </p>
          </header>

          <div className="absolute top-10 right-8">
            <button onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 text-3xl">
                ×
            </button>
          </div>

          {/* Event Details + Department Breakdown */}
          <section className="px-8 pt-2">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Event Details</CardTitle>
                <CardDescription>
                  Core information for organizers and volunteers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Event name</p>
                    <p className="font-medium">{event.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Date</p>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Time</p>
                    <p className="font-medium">{`${formattedStartTime} - ${formattedEndTime}`}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Venue</p>
                    <p className="font-medium">{event.venue}</p>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <p className="text-muted-foreground text-sm">Description</p>
                    <p className="text-pretty">{event.shortDescription}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* KPI Cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3 px-8">
            <Card>
              <CardHeader>
                <CardDescription>Total Registered</CardDescription>
                <CardTitle className="text-3xl">{analytics.totalRegisteredUsers}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Total Capacity</CardDescription>
                <CardTitle className="text-3xl">{event.capacity}</CardTitle>
              </CardHeader>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardDescription>Seats Remaining</CardDescription>
                <CardTitle className="text-3xl">{remainingCapacity}</CardTitle>
              </CardHeader>
            </Card> */}

            <Card>
              <CardHeader>
                <CardDescription>Total Likes</CardDescription>
                <CardTitle className="text-3xl flex justify-center items-center gap-3">
                    {analytics.totalLikes}
                    <span className="text-amber-400">
                        <AiFillLike />
                    </span>
                </CardTitle>
              </CardHeader>
            </Card>
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 px-8">
            <Card>
              <CardHeader>
                <CardTitle>By Department</CardTitle>
                <CardDescription>
                  Registrations by academic department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DepartmentBreakdown data={transformBranchData(analytics.branchWiseCount)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capacity Utilization</CardTitle>
                <CardDescription>Filled vs remaining seats</CardDescription>
              </CardHeader>
              <CardContent>
                <CapacityGauge percent={percentCapacity} />
              </CardContent>
            </Card>
          </section>


          {/* Optional: Recent Registrations Table (example placeholder) */}
          <section className="grid grid-cols-1 gap-4 px-8 pb-10">
            <Card>
              <CardHeader>
                <CardTitle>Recent Registrations</CardTitle>
                <CardDescription>Latest student sign-ups</CardDescription>
              </CardHeader>
              <CardContent>
                { analytics.registeredStudents?.length === 0 ?
                <p className="text-muted-foreground text-center">No registrations yet.</p>
                :
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>College Id</TableHead>
                      <TableHead>Registered On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                    (analytics.registeredStudents?.map((st)=>(
                        <TableRow key={st.collegeId}>
                            <TableCell>{st.name}</TableCell>
                            <TableCell>{st.branch}</TableCell>
                            <TableCell>{st.collegeId}</TableCell>
                            <TableCell>{dayjs(st.registrationDate).format("DD MMM, YYYY")}</TableCell>
                        </TableRow>
                    )))
                    }
                  </TableBody>
                </Table>
                }
              </CardContent>
            </Card>
          </section>
        </main>
        }
      </div>
    </div>
  );
}

export default AnalyticsModel;
