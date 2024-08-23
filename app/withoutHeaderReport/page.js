"use client";
// pages/Weights.js
import { useState, useEffect } from "react";
import axios from "axios";

import { useRouter } from "next/navigation";
import ProxySidebar from "../Components/ProxySidebar";

const HeaderReport = () => {
  const [weights, setWeights] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalNetWeight, setTotalNetWeight] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("ProxyAdminAuthToken");
    if (!authToken) {
      router.push("/material");
    }
  }, []);

  useEffect(() => {
    // Add event listener when component mounts
    const handleKeyDown = (event) => {
      // Check if Ctrl + N is pressed
      if (event.key === "Escape") {
        // Navigate to proxyLogin page
        router.push("/material");
      }
    };

    // Attach event listener to the document
    document.addEventListener("keydown", handleKeyDown);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/proxyWeight/weights"
        );
        setWeights(response.data);
      } catch (error) {
        console.error("Error fetching weights:", error);
      }
    };
    fetchWeights();
  }, []);

  useEffect(() => {
    // Initialize start date and end date with current date
    const currentDate = new Date();
    const formattedCurrentDate = formatDate(currentDate);
    setStartDate(formattedCurrentDate);
    setEndDate(formattedCurrentDate);
  }, []);

  useEffect(() => {
    const results = weights.filter((weight) => {
      const weightDate = new Date(weight.createdAt);
      // Normalize dates by setting the time to 00:00:00
      const start = startDate ? new Date(startDate) : new Date(0); // Default to a very old date if no startDate
      const end = endDate ? new Date(endDate) : new Date(); // Default to current date if no endDate

      // Set the time component to 00:00:00 for accurate date comparison
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      const isWithinSelectedDate = weightDate >= start && weightDate <= end;

      const isMatchingRSTNo = weight.RSTNo.toString().includes(searchTerm);
      const isMatchingMaterialName = weight.selectedMaterialName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return (
        (isMatchingRSTNo || isMatchingMaterialName) && isWithinSelectedDate
      );
    });
    setSearchResults(results);
  }, [searchTerm, weights, startDate, endDate]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${year}-${month}-${day}`;
  };

  const isCurrentDate = (date) => {
    const currentDate = new Date();
    const formattedCurrentDate = formatDate(currentDate);
    return date === formattedCurrentDate;
  };
  const calculateTotalNetWeight = () => {
    const total = searchResults.reduce((sum, weight) => {
      const netWeight = parseFloat(weight.netWeight) || 0;
      return sum + netWeight;
    }, 0);

    return total.toFixed(2); // Format the result with 2 decimal places
  };
  const handleDetailedPrint = () => {
    const detailedPrintContent = searchResults.map((weight, index) => ({
      srNumber: index + 1,
      RSTNo: weight.RSTNo,
      date: new Date(weight.createdAt).toLocaleDateString("en-GB"),
      vehicalOwnerName: weight.vehicalOwnerName,
      vehicalMobileNo: weight.vehicalMobileNo,
      vehicalAddress: weight.vehicalAddress,
      selectedMaterialName: weight.selectedMaterialName,
      grossWeight: weight.grossWeight,
      tareWeight: weight.tareWeight,
      netWeight: weight.netWeight,

      // Add any additional details you want to include in the detailed print
      // For example, order date, order number, etc.
    }));

    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(dateString).toLocaleDateString("en-GB", options);
    };

    const startDateFormatted = formatDate(startDate);
    const endDateFormatted = formatDate(endDate);
    const dateRange =
      startDate && endDate
        ? `${startDateFormatted} - ${endDateFormatted}`
        : "(All Dates)";

    const startDates = formatDate(startDate);

    const detailedPrintableContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Detailed Reports</title>
        <style>
          @page {
            margin: 2mm;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .report-header {
          
            color: black;
            font-size: 25px;
            padding: 10px;
            text-align: center;
          }
          .date-range {
            font-size: 17px;
            margin: -8px 0;
            text-align: center;
            
          }
          .report-content {
            margin-top: 10px;
            width: 100%;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          .table th, .table td {
            border: 1px solid black;
            padding: 3px;
            text-align: center;
          }
          .table th {
            background-color: #f2f2f2;
          }
          .hotel-name {
            font-size: 25px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
      <div class="report-header">
        With Header Reports
      </div>
      <div class="date-range">
        Today's Date: ${startDates}<br/>
        Date: ${dateRange}
      </div>
      <div class="report-content">
        <table class="table">
          <thead>
            <tr>
              <th>SR No</th>
              <th>RSTNo</th>
              <th>Owner Name</th>
              <th>Vehicle No</th>
              <th>Mobile No</th>
              <th>Address</th>
              <th>Material Name</th>
              <th>Gross Wt</th>
              <th>Tare Wt</th>
              <th>Net Wt</th>
            </tr>
          </thead>
          <tbody>
            ${searchResults
              .map(
                (weight, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${weight.RSTNo}</td>
                <td>${weight.vehicalOwnerName}</td>
                <td>${weight.selectedVehicleRTONo}</td>
                <td>${weight.vehicalMobileNo}</td>
                <td>${weight.vehicalAddress}</td>
                <td>${weight.selectedMaterialName}</td>
                <td>${weight.grossWeight}</td>
                <td>${weight.tareWeight}</td>
                <td>${weight.netWeight}</td>
              </tr>
            `
              )
              .join("")}
              <tr>
              <td colspan="9" style="text-align: right; font-weight: bold;">Total Net Weight:</td>
              <td style="font-weight: bold;">${calculateTotalNetWeight()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </body>
    </html>
    `;

    const detailedPrintWindow = window.open("", "_self");

    if (!detailedPrintWindow) {
      alert("Please allow pop-ups to print the detailed report.");
      return;
    }

    detailedPrintWindow.document.write(detailedPrintableContent);
    detailedPrintWindow.document.close();
    detailedPrintWindow.print();
    detailedPrintWindow.close();
  };

  return (
    <div>
      <>
        <ProxySidebar />
        <div className="p-2 lg:pl-72 lg:w-full md:pl-72 md:w-full">
          <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
            <div className="bg-white rounded-lg shadow-lg">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 border-b rounded-t">
                <h3 className="text-lg font-semibold text-gray-900">
                  Without Header Inward Report
                </h3>
              </div>
              <div className="mb-4 lg:flex gap-5 p-4 flex flex-wrap items-center ">
                <input
                  type="text"
                  placeholder="Search by RSTNo"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="px-4 py-2 border border-gray-400 rounded-full w-full lg:w-60 md:w-60"
                />
                <div>
                  <label className="mr-2 text-gray-600">Start Date:</label>

                  <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="px-4 py-2 border border-gray-400 rounded-lg"
                  />
                </div>
                <div>
                  <label className="mr-2 text-gray-600">End Date:</label>

                  <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="px-4 py-2 border border-gray-400 rounded-lg"
                  />
                </div>
                <div className="flex flex-wrap just">
                  <button
                    onClick={handleDetailedPrint}
                    className="inline-flex items-center focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center border bg-violet-600 text-white hover:text-white"
                  >
                    Print
                  </button>
                </div>
              </div>
              <div className="table-container overflow-x-auto overflow-y-auto text-sm custom-scrollbars">
                <table className="min-w-full bg-white border border-gray-300 text-left align-middle">
                  <thead className="text-base bg-violet-100 text-violet-500 ">
                    <tr>
                      <th className="px-4 py-2 whitespace-nowrap">SR No</th>
                      <th className="px-4 py-2 whitespace-nowrap">RSTNo</th>
                      <th className="px-4 py-2 whitespace-nowrap">Date</th>
                      <th className="px-4 py-2 whitespace-nowrap">
                        Vehicle Owner Name
                      </th>
                      <th className="px-4 py-2 whitespace-nowrap">
                        Vehicle RTO No
                      </th>
                      <th className="px-4 py-2 whitespace-nowrap">
                        Vehicle Mobile No
                      </th>
                      <th className="px-4 py-2 whitespace-nowrap">Address</th>
                      <th className="px-4 py-2 whitespace-nowrap">
                        Material Name
                      </th>
                      <th className="px-4 py-2 whitespace-nowrap">
                        Gross Weight
                      </th>
                      <th className="px-4 py-2 whitespace-nowrap">
                        Tare Weight
                      </th>
                      <th className="px-4 py-2 whitespace-nowrap">
                        Net Weight
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((weight, index) => (
                      <tr className=" text-center text-base" key={weight._id}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{weight.RSTNo}</td>
                        <td className="border px-4 py-2">
                          {new Date(weight.createdAt).toLocaleDateString(
                            "en-IN"
                          )}
                        </td>
                        <td className="border px-4 py-2">
                          {weight.vehicalOwnerName}
                        </td>
                        <td className="border px-4 py-2">
                          {weight.selectedVehicleRTONo}
                        </td>
                        <td className="border px-4 py-2">
                          {weight.vehicalMobileNo}
                        </td>
                        <td className="border px-4 py-2">
                          {weight.vehicalAddress}
                        </td>
                        <td className="border px-4 py-2">
                          {weight.selectedMaterialName}
                        </td>
                        <td className="border px-4 py-2">
                          {weight.grossWeight}
                        </td>
                        <td className="border px-4 py-2">
                          {weight.tareWeight}
                        </td>
                        <td className="border px-4 py-2">{weight.netWeight}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="10" className=" p-2 text-right font-bold">
                        Total Net Weight:
                      </td>
                      <td className="font-bold p-2">
                        {calculateTotalNetWeight()} kg
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default HeaderReport;
