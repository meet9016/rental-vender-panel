"use client";

import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="h-16 w-full border-b bg-white flex items-center justify-between px-6 shadow-sm">
      {/* Left - Brand */}
      <h1 className="text-xl font-bold text-gray-800">My Dashboard</h1>

      {/* Center - Search */}
      <div className="hidden md:flex flex-1 max-w-lg mx-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Right - User */}
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full hover:bg-gray-100 px-2 py-1 transition"
        >
          <img
            src="https://i.pravatar.cc/40?img=3"
            alt="user"
            className="w-9 h-9 rounded-full border"
          />
          <span className="hidden md:inline text-sm font-medium text-gray-700">Aarav</span>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
            <ul className="py-2 text-sm text-gray-700">
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">Settings</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">Logout</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}