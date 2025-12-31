"use client";

import { useState, useRef, useEffect } from "react";
import { FaBars, FaSearch, FaBell, FaChevronDown } from "react-icons/fa";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 w-full border-b border-gray-200 bg-white flex items-center justify-between px-6 shadow-sm sticky top-0 z-30">
      {/* Left - Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <FaBars className="w-6 h-6 text-gray-600" />
        </button>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Right - Notifications & User */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <FaBell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <p className="text-sm font-medium text-gray-800">New user registered</p>
                    <p className="text-xs text-gray-600 mt-1">2 hours ago</p>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-gray-200">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all notifications
                </a>
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 rounded-lg hover:bg-gray-100 px-3 py-2 transition-colors"
          >
            <img
              src="https://i.pravatar.cc/40?img=3"
              alt="user"
              className="w-9 h-9 rounded-full border-2 border-gray-200"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800">Aarav Patel</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            <FaChevronDown className="w-3 h-3 text-gray-600" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl">
              <div className="p-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-800">Aarav Patel</p>
                <p className="text-xs text-gray-500">aarav@example.com</p>
              </div>
              <ul className="py-2">
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Billing
                  </a>
                </li>
              </ul>
              <div className="border-t border-gray-200 py-2">
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}