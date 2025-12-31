"use client";

import Link from "next/link";

const menu = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Users", path: "/users" },
  { name: "Settings", path: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 h-screen bg-gray-900 text-white">
      <div className="h-14 flex items-center px-4 font-bold border-b border-gray-700">
        Logo
      </div>

      <nav className="p-4 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className="block px-3 py-2 rounded hover:bg-gray-700"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
