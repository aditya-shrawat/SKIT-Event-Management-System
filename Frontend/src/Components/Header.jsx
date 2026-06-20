import React, { useEffect, useState } from "react";
import { HiMiniHome } from "react-icons/hi2";
import { BsFillClipboard2CheckFill } from "react-icons/bs";
import { MdAdd } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@/Context/UserContext.jsx";
import { MdEventAvailable } from "react-icons/md";
import { LuMessageSquareText } from "react-icons/lu";
import { cleanupNotificationListener, registerUserSocket, setupNotificationListener } from "@/Socket/socketService";
import socket from "@/Socket/socket";
import { FaBell } from "react-icons/fa";
import Notifications from "./Notifications";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import UserProfileSheet from "./UserProfileSheet";

const Header = () => {
  const {user, loading, logout } = useUser();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const location = useLocation();

  useEffect(() => {
    if (!user?._id) return;

    registerUserSocket(socket,user._id);
    setupNotificationListener(socket);

    return () => {
      cleanupNotificationListener(socket);
    };
  },[user]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
    <nav className="sticky top-0 z-50 w-full border-b border-gray-300 bg-white/95 backdrop-blur-sm">
      <div className="w-full px-6">
        <div className="flex h-16 items-center justify-between">

          <Link to="/" className="flex items-center outline-none border-none gap-1">
            <div className="flex h-1 items-center justify-center mr-2">
              <img src="/logo.png" className="h-10 w-auto" />
            </div>
            <span className="text-2xl font-bold text-[#A94442]">SKIT-EMS</span>
          </Link>

          { user &&
            <div className="flex items-center gap-6">
              <Link to="/" className={`hidden md:flex items-center gap-2 p-2 text-sm font-medium transition-colors cursor-pointer outline-none border-none ${isActive('/') ? 'text-[#00A1A1]' : 'text-gray-700 hover:text-[#00A1A1]'}`}>
                <div className="text-lg">
                  <HiMiniHome />
                </div>
                <span>Home</span>
              </Link>

              {/* Teacher/admin nav */}
              {
                (user && user.role==="admin") &&
                <Link to="/myEvents" className={`hidden md:flex items-center gap-2 p-2 text-sm font-medium transition-colors cursor-pointer outline-none border-none ${isActive('/myEvents') ? 'text-[#00A1A1]' : 'text-gray-700 hover:text-[#00A1A1]'}`}>
                  <div className="text-lg">
                    <MdEventAvailable className="text-xl" />
                  </div>
                  <span>My Events</span>
                </Link>
              }
              {
                  (user && user.role==="admin") &&
                  <Link to={"/requests"} className={`hidden md:flex items-center gap-2 p-2 text-sm font-medium transition-colors cursor-pointer outline-none border-none ${isActive('/requests') ? 'text-[#00A1A1]' : 'text-gray-700 hover:text-[#00A1A1]'}`}>
                  <div className="text-lg">
                    <LuMessageSquareText />
                  </div>
                  <span>Requests</span>
                </Link>
              }

              {/* Student nav */}
              {
                (user && user.role==="student") &&
                <Link to="/myEvents" className={`hidden md:flex items-center gap-2 p-2 text-sm font-medium transition-colors cursor-pointer outline-none border-none ${isActive('/myEvents') ? 'text-[#00A1A1]' : 'text-gray-700 hover:text-[#00A1A1]'}`}>
                  <div className="text-lg">
                    <MdEventAvailable className="text-xl" />
                  </div>
                  <span>My Events</span>
                </Link>
              }
              {
                (user && user.role==="student") &&
                <Link to="/registered" className={`hidden md:flex items-center gap-2 p-2 text-sm font-medium transition-colors cursor-pointer outline-none border-none ${isActive('/registered') ? 'text-[#00A1A1]' : 'text-gray-700 hover:text-[#00A1A1]'}`}>
                  <div className="text-lg">
                    <BsFillClipboard2CheckFill />
                  </div>
                  <span>Registered</span>
                </Link>
              }

                <div>
                  <Link to={'/create-event'} className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#00A1A1]/10 text-[#00A1A1] border-none rounded-lg cursor-pointer text-sm font-medium hover:bg-[#00A1A1]/18 transition-colors">
                    <div className="text-2xl">
                      <MdAdd />
                    </div>
                    Create
                  </Link>
                </div>
            </div>
          }
          {loading ? (
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
              </div>
            ) : user ? (
              <div className="flex items-center gap-4">
                <div
                  onClick={() => setIsNotificationsOpen(true)}
                  className="relative p-2 text-xl text-gray-700 hover:text-[#00A1A1] transition-colors cursor-pointer"
                >
                  <FaBell />
                </div>
                <div className="relative">
                  {/* Mobile*/}
                  <div className="md:hidden">
                    <UserProfileSheet user={user} logout={logout} />
                  </div>

                  {/* Desktop Popover */}
                  <div className="hidden md:block">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="h-8 w-8 rounded-full border-none bg-gradient-to-r from-[#C9514F] to-[#A94442] text-white font-semibold cursor-pointer">
                          {user.name.charAt(0).toUpperCase()}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-72" align="end">
                        {/* User details */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#C9514F] to-[#A94442] text-white font-semibold flex items-center justify-center">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 border-t pt-3">
                          <div className="flex justify-between px-1 py-1 text-sm">
                            <span className="text-muted-foreground">Role</span>
                            <span className="font-medium capitalize">{user.role}</span>
                          </div>
                          <div className="flex justify-between px-1 py-1 text-sm">
                            <span className="text-muted-foreground">Branch</span>
                            <span className="font-medium">{user.branch}</span>
                          </div>
                          <div className="flex justify-between px-1 py-1 text-sm">
                            <span className="text-muted-foreground">College ID</span>
                            <span className="font-medium">{user.collegeId}</span>
                          </div>
                          {user.role === "student" && (
                            <div className="flex justify-between px-1 py-1 text-sm">
                              <span className="text-muted-foreground">Semester</span>
                              <span className="font-medium">{user.semester}</span>
                            </div>
                          )}
                        </div>

                        {/* Logout */}
                        <div className="border-t mt-3 pt-3">
                          <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                  <Link to="/signin" className="px-3 py-1 text-[#00A1A1] border-2 border-[#00A1A1] rounded-md cursor-pointer text-sm font-medium hover:bg-[#00A1A1]/10 transition-colors">
                    Sign In
                  </Link>
                </div>
                <div>
                  <Link to="/signup" className="primary-button px-3 py-1.5 text-sm">
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
        </div>
      </div>
    </nav>

    {
      (isNotificationsOpen && user) &&
        <Notifications setIsNotificationsOpen={setIsNotificationsOpen}  />
    }
    </>
  );
};

export default Header;
