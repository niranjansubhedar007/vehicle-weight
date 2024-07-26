"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  faTruckMoving,
  faGauge,
  faPeopleGroup,
  faBoxesPacking,
  faScaleUnbalancedFlip,
  faList,
  faMinus,
  faRightFromBracket,
  faTimes,
  faBars
} from "@fortawesome/free-solid-svg-icons";
const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logout = () => {
    localStorage.removeItem("AdminAuthToken");
    localStorage.removeItem("EmployeeAuthToken"); // Corrected typo
    router.push("/adminLogin");
  };
  
  
  

  return (
    <div>
      <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div class="px-3 py-3 lg:px-5 lg:pl-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                onClick={toggleSidebar}
              >
                {/* Conditional rendering of icon based on sidebar state */}
                {isSidebarOpen ? (
                  <FontAwesomeIcon icon={faTimes} size="xl" />
                ) : (
                  <FontAwesomeIcon icon={faBars} size="xl" />
                )}
              </button>

              <a href="https://flowbite.com" class="flex ms-2 md:me-24">
                <img src="steel.png" class="h-8 me-3" alt="steel Logo" />
                <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Khatav Steel
                </span>
              </a>
            </div>
            <div class="flex items-center">
              <div class="flex items-center ms-3">
                <div>
                  <button
                    type="button"
                    class="flex text-sm  rounded-full "
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                  >
                    <span class="sr-only">Logout</span>
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      className=" w-5 h-5"
                      onClick={logout}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-violet-700 border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar"
      >
        <div class="h-full px-3 pb-4 overflow-y-auto bg-violet-700 dark:bg-gray-800">
          <ul class="space-y-2 font-medium">
           
            <li>
              <a
                href="vehicle"
                class="flex items-center p-2 text-violet-100 rounded-lg dark:text-white hover:bg-violet-600 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon
                  icon={faTruckMoving}
                  size="lg"
                  style={{ color: "#FFFFFF" }}
                />
                <span class="flex-1 ms-3 whitespace-nowrap text-xl">
                  Vehicle
                </span>
                {/* <span class="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                  Pro
                </span> */}
              </a>
            </li>
            <li>
              <a
                href="customer"
                class="flex items-center p-2 text-violet-100 rounded-lg dark:text-white hover:bg-violet-600 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon
                  icon={faPeopleGroup}
                  size="lg"
                  style={{ color: "#FFFFFF" }}
                />
                <span class="flex-1 ms-3 whitespace-nowrap text-xl">
                  Customer
                </span>
                {/* <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                  3
                </span> */}
              </a>
            </li>
            <li>
              <a
                href="material"
                class="flex items-center p-2 text-violet-100 rounded-lg dark:text-white hover:bg-violet-600 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon
                  icon={faBoxesPacking}
                  size="lg"
                  style={{ color: "#FFFFFF" }}
                />
                <span class="flex-1 ms-3 whitespace-nowrap text-xl">
                  Material
                </span>
              </a>
            </li>
            <li>
              <a
                href="vehicleBill"
                class="flex items-center p-2 text-violet-100 rounded-lg dark:text-white hover:bg-violet-600 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon
                  icon={faScaleUnbalancedFlip}
                  size="lg"
                  style={{ color: "#FFFFFF" }}
                />
                <span class="flex-1 ms-3 whitespace-nowrap text-xl">
                  Weight Inward
                </span>
              </a>
            </li>
            <li>
              <a
                href="vehicleBillOutward"
                class="flex items-center p-2 text-violet-100 rounded-lg dark:text-white hover:bg-violet-600 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon
                  icon={faScaleUnbalancedFlip}
                  size="lg"
                  style={{ color: "#FFFFFF" }}
                />
                <span class="flex-1 ms-3 whitespace-nowrap text-xl">
                  Weight Outward
                </span>
              </a>
            </li>

            <li>
              <button
                type="button"
                className="flex items-center w-full p-2 text-base  transition duration-75 text-violet-100 rounded-lg dark:text-white hover:bg-violet-600 dark:hover:bg-gray-700 group"
                aria-controls="dropdown-example"
                data-collapse-toggle="dropdown-example"
                onClick={toggleDropdown} // Added onClick handler
              >
                <FontAwesomeIcon
                  icon={faList}
                  size="lg"
                  style={{ color: "#FFFFFF" }}
                />
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap text-xl">
                  Reports
                </span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="dropdown-example"
                className={`py-2 space-y-2 ${
                  isDropdownOpen ? "" : "hidden" // Conditional class
                }`}
              >
                {" "}
                <li>
                  <a
                    href="weightBillReport"
                    class="flex items-center p-2 text-violet-100 rounded-lg dark:text-white hover:bg-violet-600 dark:hover:bg-gray-700 group"
                  >
                    <FontAwesomeIcon
                      icon={faMinus}
                      size="lg"
                      style={{ color: "#FFFFFF" }}
                    />
                    <span class="flex-1 ms-3 whitespace-nowrap text-base">
                      Daily Inward Report
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="weightOutwardReport"
                    class="flex items-center p-2 text-violet-100 rounded-lg dark:text-white hover:bg-violet-600 dark:hover:bg-gray-700 group"
                  >
                    <FontAwesomeIcon
                      icon={faMinus}
                      size="lg"
                      style={{ color: "#FFFFFF" }}
                    />
                    <span class="flex-1 ms-3 whitespace-nowrap text-base">
                      Daily Outward Report
                    </span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
