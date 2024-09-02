"use client";
// pages/Weights.js
import { useState, useEffect } from "react";
import axios from "axios";

import { useRouter } from "next/navigation";
import ProxySidebar from "../Components/ProxySidebar";

const ProxyWeightReport = () => {
  const [weights, setWeights] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
      if (event.key === "Escape"){
        // Navigate to proxyLogin page
        router.push('/material');
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
          "https://niranjan.rajpawar.xyz/api/weight/weights"
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

  // useEffect(() => {
  //   const results = weights.filter(weight => {
  //     const weightDate = new Date(weight.createdAt);
  //     const isWithinDateRange =
  //       weightDate >= new Date(startDate) && weightDate <= new Date(endDate);
  
  //     // Include cases where the weight date matches the start date or end date
  //     const isStartDate = isCurrentDate(startDate) && weightDate <= new Date(endDate);
  //     const isEndDate = isCurrentDate(endDate) && weightDate >= new Date(startDate);
  
  //     return (
  //       weight.RSTNo.toString().includes(searchTerm) &&
  //       (isWithinDateRange || isStartDate || isEndDate)
  //     );
  //   });
  //   setSearchResults(results);
  // }, [searchTerm, weights, startDate, endDate]);


  useEffect(() => {
    const results = weights.filter(weight => {
      const weightDate = new Date(weight.createdAt);
      const isWithinSelectedDate =
        weightDate >= new Date(startDate) && weightDate <= new Date(endDate);
  
      // Check if the weight date matches the selected date
      const isMatchingSelectedDate =
        weightDate.toDateString() === new Date(startDate).toDateString();
  
      return (
        weight.RSTNo.toString().includes(searchTerm) &&
        (isWithinSelectedDate || isMatchingSelectedDate)
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

  const handleDetailedPrint = () => {
    const detailedPrintContent = searchResults.map((weight, index) => ({
      srNumber: index + 1,
      RSTNo: weight.RSTNo,
      date: new Date(weight.createdAt).toLocaleDateString("en-GB"),
      vehicalOwnerName: weight.vehicalOwnerName,
      vehicalMobileNo: weight.vehicalMobileNo,
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
        Daily Reports
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
                <td>${weight.selectedMaterialName}</td>
                <td>${weight.grossWeight}</td>
                <td>${weight.tareWeight}</td>
                <td>${weight.netWeight}</td>
              </tr>
            `
              )
              .join("")}
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
        <ProxySidebar/>
        <div class="p-4 lg:pl-72 lg:w-full md:pl-72 md:w-full min-h-screen text-black">
          <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
            <div className="bg-white rounded-lg shadow-lg ">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 border-b rounded-t">
                <h3 className="text-lg font-semibold text-gray-900">
                  Daily Report
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
                      <th className="px-4 py-2  whitespace-nowrap">SR No</th>
                      <th className="px-4 py-2  whitespace-nowrap">RST No</th>
                      <th className="px-4 py-2  whitespace-nowrap">Date</th>
                      <th className="px-4 py-2  whitespace-nowrap">
                        Vehicle Owner Name
                      </th>
                      <th className="px-4 py-2 whitespace-nowrap">
                        Vehicle RTO No
                      </th>
                      <th className="px-4 py-2 whitespace-nowrap">
                        Vehicle Mobile No
                      </th>
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

export default ProxyWeightReport;
