import { useUser } from "@/Context/UserContext";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { PencilIcon, ShareIcon, Trash2Icon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle } from "./ui/alert-dialog";
import axios from "axios";

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
  adminId,
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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteEvent = async () => {
    try {
      setDeleteLoading(true);
      const BackendURL = import.meta.env.VITE_backendURL;
      await axios.patch(`${BackendURL}/api/event/${_id}/delete`, {}, { withCredentials: true });

      setDeleteDialogOpen(false);
      // navigate("/dashboard");   // redirect after deletion, adjust route as needed
      console.log("Event deleted successfully.");
      window.location.reload();
      } catch (error) {
        console.log("Error while deleting event - ", error);
      } finally {
        setDeleteLoading(false);
      }
  };


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
          {
            (user && user?._id.toString() === adminId?.toString()) &&
            <div className="absolute top-3 right-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full size-8 bg-transparent border-gray-300 hover:bg-white/20">
                    <BsThreeDotsVertical className="text-gray-100 " />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to={`/event/${_id}/edit`} className="flex items-center gap-2 w-full">
                        <PencilIcon />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>
                      <ShareIcon />
                      Share
                    </DropdownMenuItem> */}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive"
                      onSelect={(e) => {
                        e.preventDefault();
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <TrashIcon />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Delete Dialog */}
              <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                      <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete Event?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete <span className="font-semibold text-foreground">"{name}"</span>? 
                      <br/>This will permanently remove all registrations and notify all participants. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" disabled={deleteLoading}
                      onClick={() => handleDeleteEvent()}>
                      {deleteLoading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          }
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
