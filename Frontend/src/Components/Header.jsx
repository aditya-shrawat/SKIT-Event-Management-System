import React, { useEffect } from "react";
import { HiMiniHome } from "react-icons/hi2";
import { FaFireAlt } from "react-icons/fa";
import { BsFillClipboard2CheckFill } from "react-icons/bs";
import { MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import { useUser } from "@/Context/UserContext.jsx";
import { MdEventAvailable } from "react-icons/md";
import { LuMessagesSquare } from "react-icons/lu";
import { LuMessageSquareText } from "react-icons/lu";
import { cleanupNotificationListener, registerUserSocket, setupNotificationListener } from "@/Socket/socketService";
import socket from "@/Socket/socket";

const Header = () => {
  const {user} = useUser();

  useEffect(() => {
    if (!user?._id) return;

    registerUserSocket(socket,user._id);
    setupNotificationListener(socket);

    return () => {
      cleanupNotificationListener(socket);
    };
  },[user]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-300 bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          <Link to="/" className="flex items-center outline-none border-none gap-1">
            <div className="flex h-1 items-center justify-center">
              <img src="/logo.png" className="h-10 w-auto" />
            </div>
            <span className="text-xl font-bold text-[#A94442]">SKIT-EMS</span>
          </Link>

          { user &&
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 p-2 text-sm font-medium text-gray-700 hover:text-[#00A1A1] transition-colors cursor-pointer outline-none border-none">
                <div className="text-lg">
                  <HiMiniHome />
                </div>
                <span>Home</span>
              </Link>

              {/* Teacher/admin nav */}
              {
                (user && user.role==="admin") &&
                <Link to="/myEvents" className="flex items-center gap-2 p-2 text-sm font-medium text-gray-700 hover:text-[#00A1A1] transition-colors cursor-pointer outline-none border-none">
                  <div className="text-lg">
                    <MdEventAvailable className="text-xl" />
                  </div>
                  <span>My Events</span>
                </Link>
              }
              {
                (user && user.role==="admin") &&
                <div className="flex items-center gap-2 p-2 text-sm font-medium text-gray-700 hover:text-[#00A1A1] transition-colors cursor-pointer outline-none border-none">
                  <div className="text-lg">
                    <LuMessageSquareText />
                  </div>
                  <span>Requests</span>
                </div>
              }

              {/* Student nav */}
              {
                (user && user.role==="student") &&
                <Link to="/popular" className="flex items-center gap-2 p-2 text-sm font-medium text-gray-700 hover:text-[#00A1A1] transition-colors cursor-pointer outline-none border-none">
                  <div className="text-lg">
                    <FaFireAlt />
                  </div>
                  <span>Popular</span>
                </Link>
              }
              {
                (user && user.role==="student") &&
                <Link to="/registered" className="flex items-center gap-2 p-2 text-sm font-medium text-gray-700 hover:text-[#00A1A1] transition-colors cursor-pointer outline-none border-none">
                  <div className="text-lg">
                    <BsFillClipboard2CheckFill />
                  </div>
                  <span>Registered</span>
                </Link>
              }

                <div>
                  <Link to={'/create-event'} className="flex items-center gap-2 px-3 py-1.5 bg-[#00A1A1]/10 text-[#00A1A1] border-none rounded-lg cursor-pointer text-sm font-medium hover:bg-[#00A1A1]/18 transition-colors">
                    <div className="text-2xl">
                      <MdAdd />
                    </div>
                    Create
                  </Link>
                </div>
            </div>
          }

          {
            user ? (
            <div className="relative">
              <button className="h-8 w-8 rounded-full border-none bg-gradient-to-r from-[#C9514F] to-[#A94442] text-white font-semibold cursor-pointer">
                {user && user.name.charAt(0).toUpperCase()}
              </button>
            </div> )
            : (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                  <Link to={'/signin'} className="px-3 py-1 text-[#00A1A1] border-2 border-[#00A1A1] rounded-md cursor-pointer text-sm font-medium hover:bg-[#00A1A1]/10 transition-colors">
                    Sign In
                  </Link>
                </div>
                <div>
                  <Link to={'/signup'} className="primary-button px-3 py-1.5 text-sm">
                    Sign Up
                  </Link>
                </div>
              </div>
            )
          }

        </div>
      </div>
    </nav>
  );
};

export default Header;
