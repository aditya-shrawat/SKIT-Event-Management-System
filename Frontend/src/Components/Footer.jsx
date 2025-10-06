import React from "react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 border-t border-gray-300 py-12 px-4">
      
      <div className="z-0 pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-teal-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-teal-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            {/* <h3 className="text-xl font-bold text-[#A94442] mb-4">
              SKIT EMS
            </h3> */}

            <div className="flex items-center outline-none border-none gap-1 mb-4">
            <div className="flex h-1 items-center justify-center">
              <img src="/logo.png" className="h-10 w-auto" />
            </div>
            <span className="text-xl font-bold text-[#A94442]">SKIT-EMS</span>
          </div>


            <p className="text-gray-600 text-sm leading-relaxed">
              Connecting SKIT community through amazing events and experiences.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Browse Events
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Create Event
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Student Portal
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Support</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Contact Admin
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  SKIT Community
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">About SKIT</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  About College
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Departments
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Faculty
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-300 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600">
            © 2024 SKIT Event Management System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
