import React from "react";
import { HiMiniHome } from "react-icons/hi2";
import { FaFireAlt } from "react-icons/fa";
import { BsFillClipboard2CheckFill } from "react-icons/bs";
import { MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";

const Header = () => {
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

          {
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 p-2 text-sm font-medium text-gray-700 hover:text-[#00A1A1] transition-colors cursor-pointer outline-none border-none">
                <div className="text-lg">
                  <HiMiniHome />
                </div>
                <span>Home</span>
              </Link>

              <Link to="/myEvents" className="flex items-center gap-2 p-2 text-sm font-medium text-gray-700 hover:text-[#00A1A1] transition-colors cursor-pointer outline-none border-none">
                <div className="text-lg">
                  <FaFireAlt />
                </div>
                <span>My Events</span>
              </Link>

              <Link to="/registered" className="flex items-center gap-2 p-2 text-sm font-medium text-gray-700 hover:text-[#00A1A1] transition-colors cursor-pointer outline-none border-none">
                <div className="text-lg">
                  <BsFillClipboard2CheckFill />
                </div>
                <span>Registered</span>
              </Link>

              <div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#00A1A1]/10 text-[#00A1A1] border-none rounded-lg cursor-pointer text-sm font-medium hover:bg-[#00A1A1]/18 transition-colors">
                  <div className="text-2xl">
                    <MdAdd />
                  </div>
                  Create
                </button>
              </div>
            </div>
          }

          <div className="relative">
            <button className="h-8 w-8 rounded-full border-none bg-gray-400 text-white font-semibold cursor-pointer">
              P
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Header;
