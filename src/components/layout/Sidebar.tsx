"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTachometerAlt, FaUsers, FaCog, FaTimes, FaChevronDown, FaEllipsisH, FaChartLine, FaTable } from "react-icons/fa";
import { useState, useRef, useEffect, useCallback } from "react";

type NavItem = {
  name: string;
  icon: any;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const menu: NavItem[] = [
  {
    name: "Dashboard",
    icon: FaTachometerAlt,
    path: "/dashboard", // Main path for when sidebar is collapsed
    subItems: [
      { name: "Analytics", path: "/dashboard" },
      { name: "Ecommerce", path: "/dashboard/ecommerce" },
    ],
  },
  {
    name: "Users",
    icon: FaUsers,
    path: "/users",
  },
  {
    name: "Product",
    icon: FaUsers,
    path: "/product",
  },
  {
    name: "Reports",
    icon: FaChartLine,
    path: "/reports/sales", // Main path for when sidebar is collapsed
    subItems: [
      { name: "Sales Report", path: "/reports/sales" },
      { name: "User Report", path: "/reports/users" },
    ],
  },
  {
    name: "Tables",
    icon: FaTable,
    path: "/tables/basic", // Main path for when sidebar is collapsed
    subItems: [
      { name: "Basic Tables", path: "/tables/basic" },
      { name: "Data Tables", path: "/tables/data" },
    ],
  },
  {
    name: "Settings",
    icon: FaCog,
    path: "/settings",
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>({});
  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  // Auto-open submenu if current path matches a submenu item
  useEffect(() => {
    let submenuMatched = false;
    menu.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu(index);
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  // Calculate submenu height
  useEffect(() => {
    if (openSubmenu !== null && isOpen) {
      if (subMenuRefs.current[openSubmenu]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [openSubmenu]: subMenuRefs.current[openSubmenu]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu, isOpen]);

  const handleSubmenuToggle = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenSubmenu((prev) => (prev === index ? null : index));
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out overflow-y-auto ${isOpen ? "w-64" : "w-0 lg:w-20"
          } ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo Section */}
        <div
          className={`h-16 flex items-center border-b border-gray-200 transition-all duration-300 ${isOpen ? "justify-between px-6" : "lg:justify-center px-0"
            }`}
        >
          <div className={`flex items-center gap-2 ${isOpen ? "" : "lg:hidden"}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Logo</span>
          </div>

          {/* Icon only logo for collapsed state on desktop */}
          <div
            className={`w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg items-center justify-center ${isOpen ? "hidden" : "hidden lg:flex"
              }`}
          >
            <span className="text-white font-bold text-sm">L</span>
          </div>

          {/* Close button - only visible on mobile when open */}
          {isOpen && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Menu Header */}
        <div
          className={`px-6 py-4 flex ${isOpen ? "justify-start" : "lg:justify-center"
            }`}
        >
          {isOpen ? (
            <h2 className="text-xs uppercase text-gray-400 font-semibold">Menu</h2>
          ) : (
            <FaEllipsisH className="text-gray-400 hidden lg:block" />
          )}
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1">
          {menu.map((item, index) => {
            const Icon = item.icon;
            const hasSubmenu = item.subItems && item.subItems.length > 0;
            const isItemActive = item.path ? isActive(item.path) : false;
            const isSubmenuOpen = openSubmenu === index;
            const isAnySubitemActive = hasSubmenu && item.subItems?.some(sub => isActive(sub.path));

            return (
              <div key={item.name}>
                {/* Main Menu Item */}
                {hasSubmenu && isOpen ? (
                  // When sidebar is open and has submenu - show button
                  <button
                    onClick={(e) => handleSubmenuToggle(e, index)}
                    title={item.name}
                    className={`w-full flex items-center rounded-lg transition-all gap-3 px-4 py-3 ${isSubmenuOpen || isAnySubitemActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.name}</span>
                    <FaChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isSubmenuOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                ) : (
                  // When sidebar is collapsed or no submenu - show link
                  <Link
                    href={item.path!}
                    title={!isOpen ? item.name : undefined}
                    className={`flex items-center rounded-lg transition-all ${isOpen ? "gap-3 px-4 py-3" : "lg:justify-center lg:p-3"
                      } ${isItemActive || isAnySubitemActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className={`${isOpen ? "block" : "lg:hidden"}`}>{item.name}</span>
                  </Link>
                )}

                {/* Submenu Items */}
                {hasSubmenu && isOpen && (
                  <div
                    ref={(el) => {
                      subMenuRefs.current[index] = el;
                    }}
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      height: isSubmenuOpen ? `${subMenuHeight[index]}px` : "0px",
                    }}
                  >
                    <ul className="mt-2 space-y-1 ml-9">
                      {item.subItems!.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            href={subItem.path}
                            className={`block px-4 py-2 text-sm rounded-lg transition-colors ${isActive(subItem.path)
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                              }`}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Section - only show when expanded */}
        {isOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-800 mb-1">Need Help?</p>
              <p className="text-xs text-gray-600 mb-3">Check our documentation</p>
              <button className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Get Support
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}