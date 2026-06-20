import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMiniHome } from "react-icons/hi2";
import { BsFillClipboard2CheckFill } from "react-icons/bs";
import { MdAdd, MdEventAvailable } from "react-icons/md";
import { LuMessageSquareText } from "react-icons/lu";
import { ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const UserProfileSheet = ({ user, logout }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="h-8 w-8 rounded-full border-none bg-gradient-to-r from-[#C9514F] to-[#A94442] text-white font-semibold cursor-pointer">
          {user.name.charAt(0).toUpperCase()}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72" hideCloseButton>

        {/* Header with dropdown arrow */}
        <SheetHeader className="p-2">
          <div
            className="mt-4 cursor-pointer p-2 border rounded-lg"
          >
            <div onClick={()=>setIsDetailsOpen(!isDetailsOpen)} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#C9514F] to-[#A94442] text-white font-semibold flex items-center justify-center text-lg">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <SheetTitle className="text-left">{user.name}</SheetTitle>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                </div>
                <ChevronDown
                className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isDetailsOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {/*user details */}
            <div className={`overflow-hidden transition-all duration-300 ${isDetailsOpen ? 'max-h-60 opacity-100 pt-4' : 'max-h-0 opacity-0'}`}>
                <div className="px-1 flex flex-col gap-1 border-t pt-4">
                <div className="flex justify-between px-2 py-1 text-sm">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium capitalize">{user.role}</span>
                </div>
                <div className="flex justify-between px-2 py-1 text-sm">
                    <span className="text-muted-foreground">Branch</span>
                    <span className="font-medium">{user.branch}</span>
                </div>
                <div className="flex justify-between px-2 py-1 text-sm">
                    <span className="text-muted-foreground">College ID</span>
                    <span className="font-medium">{user.collegeId}</span>
                </div>
                {user.role === "student" && (
                    <div className="flex justify-between px-2 py-1 text-sm">
                    <span className="text-muted-foreground">Semester</span>
                    <span className="font-medium">{user.semester}</span>
                    </div>
                )}
                </div>
            </div>
          </div>
        </SheetHeader>

        {/* Nav Links */}
        <div className="p-2 flex flex-col gap-1 border-t pt-4">
          <Link to="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/') ? 'text-[#00A1A1] bg-[#00A1A1]/10' : 'text-gray-700 hover:bg-gray-100'}`}>
            <HiMiniHome className="text-lg" /><span>Home</span>
          </Link>

          {user.role === "admin" && (
            <>
              <Link to="/myEvents" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/myEvents') ? 'text-[#00A1A1] bg-[#00A1A1]/10' : 'text-gray-700 hover:bg-gray-100'}`}>
                <MdEventAvailable className="text-xl" /><span>My Events</span>
              </Link>
              <Link to="/requests" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/requests') ? 'text-[#00A1A1] bg-[#00A1A1]/10' : 'text-gray-700 hover:bg-gray-100'}`}>
                <LuMessageSquareText /><span>Requests</span>
              </Link>
            </>
          )}

          {user.role === "student" && (
            <>
              <Link to="/myEvents" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/myEvents') ? 'text-[#00A1A1] bg-[#00A1A1]/10' : 'text-gray-700 hover:bg-gray-100'}`}>
                <MdEventAvailable className="text-xl" /><span>My Events</span>
              </Link>
              <Link to="/registered" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/registered') ? 'text-[#00A1A1] bg-[#00A1A1]/10' : 'text-gray-700 hover:bg-gray-100'}`}>
                <BsFillClipboard2CheckFill className="text-lg" /><span>Registered</span>
              </Link>
            </>
          )}

          <Link to="/create-event" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/create-event') ? 'text-[#00A1A1] bg-[#00A1A1]/10' : 'text-[#00A1A1] hover:bg-[#00A1A1]/10'}`}>
            <MdAdd className="text-xl" /><span>Create Event</span>
          </Link>
        </div>

        {/* Logout */}
        <div className="mt-auto border-t pt-4 absolute bottom-6 left-0 right-0 px-4">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>

      </SheetContent>
    </Sheet>
  );
};

export default UserProfileSheet;