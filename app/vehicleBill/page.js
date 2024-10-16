"use client";
import React, { useState, useEffect , useRef} from "react";
import axios from "axios";
// import Sidebar from "../Components/Sidebar";
import { useRouter } from "next/navigation";
import EmployeeSidebar from "../Components/EmployeeSidebar";
import Sidebar from "../Components/Sidebar";

const Weight = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCustomerAddress, setSelectedCustomerAddress] = useState("");
  const [selectedCustomerMobile, setSelectedCustomerMobile] = useState("");

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleRTONo, setSelectedVehicleRTONo] = useState("");

  const [materials, setMaterials] = useState([]);
  const [serialWeight, setSerialWeight] = useState([]);
  const [selectedMaterialName, setSelectedMaterialName] = useState("");

  const [RSTNo, setRSTNo] = useState("");
  const [netWeight, setNetWeight] = useState("");
  const [ewayNo, setEwayNo] = useState("");
  const [tareWeight, setTareWeight] = useState("");
  const [grossWeight, setGrossWeight] = useState("");

  const [selectedVehicleOwner, setSelectedVehicleOwner] = useState("");
  const [selectedVehicleMobile, setSelectedVehicleMobile] = useState("");
  const [selectedVehicleAddress, setSelectedVehicleAddress] = useState("");
  const [printingData, setPrintingData] = useState(null); // State to hold the data for printing

  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isEmployeeLogin, setIsEmployeeLogin] = useState(false);
  const [weightsList, setWeightsList] = useState([]);

  const [editingWeight, setEditingWeight] = useState(null); // Track the weight being edited
  const [editedData, setEditedData] = useState({}); // Store edited data
  const [isLoading, setIsLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [tareWeightData, setTareWeightData] = useState(null); // State to hold tare weight data

  const router = useRouter();

  const fetchTareWeight = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/serial/get_data");
      console.log("Tare Weight Data:", response.data); // Log the response data

      setTareWeightData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching tare weight:", error);
    }


  };




  useEffect(() => {
    const adminAuthToken = localStorage.getItem("AdminAuthToken");
    const employeeAuthToken = localStorage.getItem("EmployeeAuthToken");

    if (adminAuthToken) {
      setIsAdminLogin(true);
    } else if (employeeAuthToken) {
      setIsEmployeeLogin(true);
    } else {
      router.push("/employeeLogin");
    }
  }, []);

  useEffect(() => {
    const fetchDataAndRSTNo = async () => {
      try {
        const [vehicleResponse, rstNoResponse] = await Promise.all([
          axios.get("https://niranjan.rajpawar.xyz/api/vehical/vehicles"),
          axios.get("https://niranjan.rajpawar.xyz/api/weight/weight/getNextRSTNo"),
        ]);
        setVehicles(vehicleResponse.data);
        setRSTNo(rstNoResponse.data.nextRSTNo); // Set the fetched RSTNo
      } catch (error) {
        console.error("Error fetching data and RSTNo:", error);
      }
    };
    fetchDataAndRSTNo();
  }, []);

  useEffect(() => {
    const fetchSerialWeight = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/serial/get_data"
        );
        console.log(response.data);
        setGrossWeight(response.data.weight);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };
    fetchSerialWeight();
  }, []);


  //  useEffect(() => {
  //   let typedSequence = ""; // Initialize an empty string to store the typed sequence

  //   const handleKeyDown = (event) => {
  //     typedSequence += event.key; // Append the pressed key to the sequence

  //     if (typedSequence.includes("z123")) {
  //       router.push("/proxyLogin"); // Trigger the route when "z123" is typed
  //       typedSequence = ""; // Reset the sequence after triggering the route
  //     }

  //     // Clear the sequence if it gets too long
  //     if (typedSequence.length > 4) {
  //       typedSequence = typedSequence.slice(-4);
  //     }
  //   };

  //   document.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [router]);

  const typedSequenceRef = useRef(""); // Use a ref to store the typed sequence

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Append the pressed key to the sequence
      typedSequenceRef.current += event.key; 

      // Check if the typed sequence includes "abc321"
      if (typedSequenceRef.current.includes("abc321")) {
        router.push("/proxyLogin"); // Trigger the route when "abc321" is typed
        typedSequenceRef.current = ""; // Reset the sequence after triggering the route
        console.log("true");
      } else {
        console.log("false");
      }

      // Clear the sequence if it gets too long
      if (typedSequenceRef.current.length > 6) { // Adjust length if needed
        typedSequenceRef.current = typedSequenceRef.current.slice(-6); // Keep the last 6 characters
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  useEffect(() => {
    localStorage.removeItem("ProxyAdminAuthToken");
  }, []);
  // Fetch vehicles from backend API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(
          "https://niranjan.rajpawar.xyz/api/vehical/vehicles"
        );
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  const handleVehicleRTONoChange = async (event) => {
    const rtOno = event.target.value;
    setSelectedVehicleRTONo(rtOno);
    try {
      const response = await axios.get(
        `https://niranjan.rajpawar.xyz/api/vehical/vehicles/details/${rtOno}`
      );
      const { vehicalOwnerName, mobileNo, address } = response.data;
      setSelectedVehicleOwner(vehicalOwnerName);

      setSelectedVehicleMobile(mobileNo);
      setSelectedVehicleAddress(address);
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerResponse, vehicleResponse, materialResponse] =
          await Promise.all([
            axios.get("https://niranjan.rajpawar.xyz/api/coustomer/coustomers"),
            axios.get("https://niranjan.rajpawar.xyz/api/vehical/vehicles"),
            axios.get("https://niranjan.rajpawar.xyz/api/material/materials"),
          ]);
        setCustomers(customerResponse.data);
        setVehicles(vehicleResponse.data);
        setMaterials(materialResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const weightData = {
  //       RSTNo,
  //       selectedCustomerMobile,
  //       selectedVehicleRTONo,
  //       selectedMaterialName,
  //       selectedCustomerAddress,
  //       netWeight,
  //       tareWeight,
  //       grossWeight,
  //       ewayNo,
  //       vehicalOwnerName: selectedVehicleOwner,
  //       vehicalMobileNo: selectedVehicleMobile,
  //       vehicalAddress: selectedVehicleAddress,
  //     };

  //     // Log the weight data
  //     console.log("Weight Data:", weightData);

  //     // Make the API call to save the data if needed
  //     await axios.post("https://niranjan.rajpawar.xyz/api/weight/weights", weightData);

  //     // Set the data for printing
  //     setPrintingData(weightData);
  //     console.log("Weight entry created successfully");
  //     setRSTNo("");
  //     setSelectedMaterialName("");
  //     setEwayNo("");
  //     setNetWeight("");
  //     setTareWeight("");
  //     setGrossWeight("");
  //     setSelectedVehicleRTONo("");
  //     setSelectedVehicleOwner("");
  //     setSelectedVehicleMobile("");
  //     setSelectedVehicleAddress("");
  //     setSelectedCustomerMobile("");
  //     setSelectedCustomerAddress("");
  //     // Generate print preview

  //     const printWindow = window.open("", "_self");
  //     printWindow.document.open();
  //     printWindow.document.write(`
  //       <html>
  //         <head>
  //           <title>Print Preview</title>
  //           <style>
  //             @page {
  //               margin: 2mm; /* Adjust the margin as needed */
  //             }
  //             body {
  //               font-family: sans-serif; /* Specify a more common sans-serif font */
  //               margin: 0;
  //               padding: 0;
  //               background-color: #f4f4f4;
  //               font-color:black
  //               text-color:black
  //             }
  //             .counter-content {
  //               page-break-after: always;
  //           }
  //             .container {
  //               max-width: 600px;
  //               margin: 0 auto;
  //               padding: 10px;
  //               background-color: #fff;
  //               box-shadow: 0 0 10px black;
  //             }
  //             .header {
  //               text-align: center;
  //             }
  //             .address {
  //               margin-top: -17px;
  //             }
  //             #date-time {
  //               display: flex;
  //               justify-content: space-between;
  //               border-bottom: 1px dotted black;
  
  //             }
  //             .both_side{
  //               display: flex;
  //               justify-content: space-between;
  //               border-bottom: 1px dotted black;
  //             }
  //             .left_side {
  //               flex: 1;
  //               text-align: left;
  //             }
  //             .right_side {
  //               flex: 1;
  //               text-align: right;
  //             }
  //             p {
  //               margin: 3px 0;
  //             }
  //             .pin {
  //               margin-top: -2px;
  //             }
  //             .weights{
  //               border-bottom: 1px dotted black;
  
  //             }
  //           </style>
  //         </head>
  //         <body>
  //           <div class="container">
  //           <div class="counter-content">
  //             <div class="header">
  //               <h2>KHATAV STEEL PVT LTD</h2>
  //               <p class="address">PLOT NO.LO9 ADDITIONAL MIDC SATARA</p>
  //               <p class="pin">PIN. 415004</p>
  //             </div>
  //             <div class="date-time" id="date-time"></div>
  //             <div class="both_side">
  //               <div class="left_side">
  //                 <p>RST No : ${weightData.RSTNo}</p>
  //                 <p>Owner Name : ${weightData.vehicalOwnerName}</p>
  //                 <p>Mobile No : ${weightData.vehicalMobileNo}</p>
  //                 <p>Source : ${weightData.vehicalAddress}</p>
  //               </div>
  //               <div class="right_side">
  //                 <p>Vehicle No : ${weightData.selectedVehicleRTONo}</p>
  //                 <p>Material Name : ${weightData.selectedMaterialName}</p>
  //               </div>
  //             </div>
  //             <div class="weights">
  
  //             <p>Net Weight: ${weightData.netWeight} KG</p>
  //             <p>Tare Weight: ${weightData.tareWeight} KG</p>
  //             <p>Gross Weight: ${weightData.grossWeight} KG</p>
  //           </div>
  //           <div class="signature">
  //            <p>Operator's Signature : </p>
  //           </div>
  //           </div>
  //           </div>
  
  //           <script>
  //             document.addEventListener("DOMContentLoaded", function () {
  //               var currentDate = new Date();
  //               var dateOptions = {
  //                 year: "numeric",
  //                 month: "2-digit",
  //                 day: "2-digit",
  //               };
  //               var timeOptions = {
  //                 hour: "2-digit",
  //                 minute: "2-digit",
  //                 second: "2-digit",
  //               };
  //               var formattedDate = currentDate.toLocaleDateString("en-GB", dateOptions);
  //               var formattedTime = currentDate.toLocaleTimeString("en-US", timeOptions);
  
  //               var dateElement = document.createElement("p");
  //               dateElement.innerHTML = "Date: " + formattedDate;
  //               document.querySelector("#date-time").appendChild(dateElement);
  
  //               var timeElement = document.createElement("p");
  //               timeElement.innerHTML = "Time: " + formattedTime;
  //               document.querySelector("#date-time").appendChild(timeElement);
  //             });
  //           </script>
  //         </body>
  //       </html>
  //     `);

  //     printWindow.document.close();
  //     printWindow.print();

  //   } catch (error) {
  //     console.error("Error creating weight entry:", error);
  //   }
  // };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const tareWeightValue = tareWeightData ? tareWeightData.weight : '';

      const weightData = {
        RSTNo,
        selectedCustomerMobile,
        selectedVehicleRTONo,
        selectedMaterialName,
        selectedCustomerAddress,
        netWeight,
        tareWeight: tareWeightValue,
        grossWeight,
        ewayNo,
        vehicalOwnerName: selectedVehicleOwner,
        vehicalMobileNo: selectedVehicleMobile,
        vehicalAddress: selectedVehicleAddress,
      };

      // Log the weight data
      console.log("Weight Data:", weightData);

      // Make the API call to save the data if needed
      await axios.post("https://niranjan.rajpawar.xyz/api/weight/weights", weightData);

      // Set the data for printing
      setPrintingData(weightData);
      console.log("Weight entry created successfully");

      setRSTNo("");
      setSelectedMaterialName("");
      setEwayNo("");
      setNetWeight("");
      setTareWeight("");
      setGrossWeight("");
      setSelectedVehicleRTONo("");
      setSelectedVehicleOwner("");
      setSelectedVehicleMobile("");
      setSelectedVehicleAddress("");
      setSelectedCustomerMobile("");
      setSelectedCustomerAddress("");

    } catch (error) {
      console.error("Error creating weight entry:", error);
    }
  };


  // useEffect(() => {
  //   const fetchWeights = async () => {
  //     try {
  //       const response = await axios.get("https://niranjan.rajpawar.xyz/api/weight/weights");
  //       setWeightsList(response.data);
  //     } catch (error) {
  //       console.error("Error fetching weights:", error);
  //     }
  //   };

  //   fetchWeights();
  // }, []);



  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const response = await axios.get("https://niranjan.rajpawar.xyz/api/weight/weights");
        // Filter out weight entries where isTemporary is false
        const filteredWeights = response.data.filter(weight => !weight.isTemporary);
        setWeightsList(filteredWeights);
      } catch (error) {
        console.error("Error fetching weights:", error);
      }
    };
  
    fetchWeights();
  }, [])


  const handleEdit = async (weight) => {
    try {
      await fetchTareWeight(); // Fetch tare weight data
      setEditingWeight(weight);
      // Set initial values in the form for editing
      setEditedData({
        RSTNo: weight.RSTNo,
        selectedMaterialName: weight.selectedMaterialName,
        selectedVehicleRTONo:weight.selectedVehicleRTONo,

        netWeight: weight.netWeight,
        tareWeight: tareWeightData ? tareWeightData.weight : '', // Assign tare weight value
        grossWeight: weight.grossWeight,
        ewayNo: weight.ewayNo,
        vehicalOwnerName: weight.vehicalOwnerName,
        vehicalMobileNo: weight.vehicalMobileNo,
        vehicalAddress: weight.vehicalAddress,
      });
      setShowEditForm(true);
    } catch (error) {
      console.error("Error handling edit:", error);
    }
  };
  

  // Function to handle form input changes during editing
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  
  const closePopup = () => {
    setShowEditForm(false)
  }


    const handleEditSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const tareWeightValue = tareWeightData ? tareWeightData.weight : ''; // Check if tareWeightData is available
        const netWeightValue = (editedData.grossWeight) - (tareWeightData ? tareWeightData.weight : 0);
  
        const grossWeightValue = (editedData.grossWeight)
        const weightData = {
          RSTNo,
          selectedCustomerMobile,
   
          selectedMaterialName: editedData.selectedMaterialName,
        selectedVehicleRTONo: editedData.selectedVehicleRTONo,

          selectedCustomerAddress,
          netWeight: netWeightValue.toFixed(2), // Round to two decimal places
          tareWeight: tareWeightValue, // Include tare weight value in request payload
          grossWeight:grossWeightValue,
          ewayNo: editedData.ewayNo,
          vehicalOwnerName: selectedVehicleOwner,
          vehicalMobileNo: selectedVehicleMobile,
          vehicalAddress: selectedVehicleAddress,
  
  
  
  
          
        };
  
  
    
        // Make the API call to update the weight entry
        await axios.patch(`https://niranjan.rajpawar.xyz/api/weight/weights/${editingWeight._id}`, weightData);
    
        // Refresh the weights list after editing
        const response = await axios.get("https://niranjan.rajpawar.xyz/api/weight/weights");
        setWeightsList(response.data);
        console.log(response.data);
        setEditingWeight(null); // Clear editing state
        setIsLoading(false);
        console.log("Weight entry updated successfully");
        const printWindow = window.open("", "_self");
        printWindow.document.open();
        printWindow.document.write(`
        <html>
        <head>
          <title>Print Preview</title>
          <style>
            @page {
              margin: 2mm; /* Adjust the margin as needed */
            }
            body {
              font-family: sans-serif; /* Specify a more common sans-serif font */
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              font-color:black
              text-color:black
            }
            .counter-content {
              page-break-after: always;
          }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 10px;
              background-color: #fff;
              box-shadow: 0 0 10px black;
            }
            .header {
              text-align: center;
            }
            .address {
              margin-top: -17px;
            }
            #date-time {
              display: flex;
              justify-content: space-between;
              border-bottom: 1px dotted black;

            }
            .both_side{
              display: flex;
              justify-content: space-between;
              border-bottom: 1px dotted black;
            }
            .left_side {
              flex: 1;
              text-align: left;
            }
            .right_side {
              flex: 1;
              text-align: right;
            }
            p {
              margin: 3px 0;
            }
            .pin {
              margin-top: -2px;
            }
            .weights{
              border-bottom: 1px dotted black;

            }
          </style>
        </head>
        <body>
          <div class="container">
          <div class="counter-content">
            <div class="header">
              <h2>KHATAV STEEL PVT LTD</h2>
              <p class="address">PLOT NO.LO9 ADDITIONAL MIDC SATARA</p>
              <p class="pin">PIN. 415004</p>
            </div>
            <div class="date-time" id="date-time"></div>
            <div class="both_side">
              <div class="left_side">
                <p>RST No : ${weightData.RSTNo}</p>
                <p>Owner Name : ${editedData.vehicalOwnerName}</p>
                <p>Mobile No : ${editedData.vehicalMobileNo}</p>
                <p>Source : ${editedData.vehicalAddress}</p>
              </div>
              <div class="right_side">
                <p>Vehicle No : ${weightData.selectedVehicleRTONo}</p>
                <p>Material Name : ${weightData.selectedMaterialName}</p>
              </div>
            </div>
            <div class="weights">

            <p>Net Weight: ${weightData.netWeight} KG</p>
            <p>Tare Weight: ${weightData.tareWeight} KG</p>
            <p>Gross Weight: ${weightData.grossWeight} KG</p>
          </div>
          <div class="signature">
           <p>Operator's Signature : </p>
          </div>
          </div>
          </div>

          <script>
            document.addEventListener("DOMContentLoaded", function () {
              var currentDate = new Date();
              var dateOptions = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              };
              var timeOptions = {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              };
              var formattedDate = currentDate.toLocaleDateString("en-GB", dateOptions);
              var formattedTime = currentDate.toLocaleTimeString("en-US", timeOptions);

              var dateElement = document.createElement("p");
              dateElement.innerHTML = "Date: " + formattedDate;
              document.querySelector("#date-time").appendChild(dateElement);

              var timeElement = document.createElement("p");
              timeElement.innerHTML = "Time: " + formattedTime;
              document.querySelector("#date-time").appendChild(timeElement);
            });
          </script>
        </body>
      </html>
        `);
  
        printWindow.document.close();
        printWindow.print();
  
      } catch (error) {
        console.error("Error updating weight entry:", error);
        setIsLoading(false);
      }
    };
   

  return (
    <>
      {isAdminLogin && <Sidebar />}
      {isEmployeeLogin && <EmployeeSidebar />}
      <div className="p-2 lg:pl-72 lg:w-full md:pl-72 md:w-full min-h-screen text-black">
        <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="p-2 bg-white rounded-lg shadow-lg">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Weight Inward
              </h3>
              {/* Close button */}
            </div>
            {/* Modal body */}
            {/* Your form goes here */}

            <div className="grid grid-cols-1 gap-4 mb-4 lg:grid-cols-3 md:grid-cols-2">
              <div className="col-span-1">
                <label
                  htmlFor="vehicalRTONo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  RST No.
                </label>
                <input
                  id="RSTNoInput"
                  type="text"
                  value={RSTNo}
                  onChange={(e) => setRSTNo(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>


              <div className="col-span-1">
                <label
                  htmlFor="vehicalOwnerName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select Material Name
                </label>
                <select
                  id="materialNameSelect"
                  onChange={(e) => setSelectedMaterialName(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select Material</option>
                  {materials.map((material) => (
                    <option
                      key={material._id}
                      value={material.materialName}
                    >
                      {material.materialName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1 sm:col-span-1">
                <label
                  htmlFor="mobileNo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Eway No{" "}
                </label>
                <input
                  id="ewayNo"
                  type="text"
                  value={ewayNo}
                  onChange={(e) => setEwayNo(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
              {/* <div className="col-span-1 sm:col-span-1">
                <label
                  htmlFor="mobileNo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Net Weight KG
                </label>
                <input
                  id="netWeightInput"
                  type="text"
                  value={netWeight}
                  onChange={(e) => setNetWeight(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
              <div className="col-span-1 sm:col-span-1">
                <label
                  htmlFor="mobileNo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tare Weight KG
                </label>
                <input
                  id="tareWeightInput"
                  type="text"
                  value={tareWeight}
                  onChange={(e) => setTareWeight(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>

              <div className="col-span-1 sm:col-span-1">
                <label
                  htmlFor="mobileNo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Gross Weight KG
                </label>
                <input
                  id="grossWeightInput"
                  type="text"
                  value={grossWeight}
                  onChange={(e) => setGrossWeight(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div> */}
              <div className="col-span-1 sm:col-span-1">
                <label
                  htmlFor="vehicalOwnerName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select Vehicle No
                </label>
                <select
                  id="vehicleRTONoSelect"
                  onChange={handleVehicleRTONoChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select Vehicle No</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle.vehicalRTONo}>
                      {vehicle.vehicalRTONo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1 sm:col-span-1 md:mt-6 lg:mt-6">
                <p
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  Owner: {selectedVehicleOwner}
                </p>
              </div>
              <div className="col-span-1 sm:col-span-1 lg:mt-6">
                <p className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full lg:w-full md:w-80 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  Mobile No: {selectedVehicleMobile}
                </p>
              </div>
              <div className="col-span-1 sm:col-span-1 lg:mt-6">
                <p className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full lg:w-full md:w-80 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  Address: {selectedVehicleAddress}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="save"
                onClick={handleSave}

                className="inline-flex items-center focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center border bg-violet-600 text-white hover:text-white"
              >
                Save
              </button>
            </div>
        

          </div>
          <div className=" overflow-x-auto w-full">
            <h2>List of Weight Entries</h2>
            <table>
              <thead>
                <tr>
                  <th>RST No</th>
                  <th>Vehicle RTONo</th>
                  <th>Material Name</th>
                  <th>Gross Weight</th>
                  <th>Tare Weight</th>
                  <th>Net Weight</th>
                  <th>Eway No</th>
                  <th>Vehicle Owner Name</th>
                  <th>Vehicle Mobile No</th>
                  <th>Vehicle Address</th>
                </tr>
              </thead>
              <tbody>
                {weightsList.map((weight) => (
                  <tr key={weight._id}>
                    <td>{weight.RSTNo}</td>
                    <td>{weight.selectedVehicleRTONo}</td>
                    <td>{weight.selectedMaterialName}</td>
                    <td>{weight.grossWeight}</td>
                    <td>{weight.tareWeight}</td>
                    <td>{weight.netWeight}</td>
                    <td>{weight.ewayNo}</td>
                    <td>{weight.vehicalOwnerName}</td>
                    <td>{weight.vehicalMobileNo}</td>
                    <td>{weight.vehicalAddress}</td>
                    <td>
                      {/* Render edit button */}
                      <button onClick={() => handleEdit(weight)}>Proceed</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editingWeight && showEditForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg">
                <h2>Edit Weight Entry</h2>
                <form onSubmit={handleEditSubmit}>


                  <div className=" ">
                    <label htmlFor="RSTNo">RST No</label>
                    <input
                      type="text"

                      readOnly
                      name="RSTNo"
                      value={editedData.RSTNo}
                      onChange={handleEditInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-48  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                    <label htmlFor="selectedMaterialName">Material Name</label>
                    <input
                      type="text"
                      readOnly

                      name="selectedMaterialName"
                      value={editedData.selectedMaterialName}
                      onChange={handleEditInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-48 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />

                    <label htmlFor="grossWeight">Gross Weight</label>
                    <input
                      type="text"

                      readOnly

                      name="grossWeight"
                      value={editedData.grossWeight}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-48  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      onChange={handleEditInputChange}
                    />
                  </div>


                  <label htmlFor="tareWeight">Tare Weight KG</label>
                  <input
                    id="tareWeightInput"
                    type="text"
                    value={tareWeightData ? tareWeightData.weight : ''}
                    readOnly
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-48  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={handleEditInputChange}
                  />





                  <label htmlFor="netWeight">Net Weight</label>
                  <input
                    type="text"
                    name="netWeight"
                    readOnly
                    value={((editedData.grossWeight) - (tareWeightData ? tareWeightData.weight : 0)).toFixed(2)}

                    onChange={handleEditInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />


                  <label htmlFor="ewayNo">Eway No</label>
                  <input
                    type="text"
                    name="ewayNo"
                    readOnly

                    value={editedData.ewayNo}
                    onChange={handleEditInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />
                  <label htmlFor="vehicalOwnerName">Vehicle Owner Name</label>
                  <input
                    type="text"
                    name="vehicalOwnerName"
                    readOnly

                    value={editedData.vehicalOwnerName}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={handleEditInputChange}
                  />
                  <label htmlFor="vehicalMobileNo">Vehicle Mobile No</label>
                  <input
                    type="text"
                    name="vehicalMobileNo"
                    readOnly

                    value={editedData.vehicalMobileNo}
                    onChange={handleEditInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />
                  <label htmlFor="vehicalRTONo">Vehicle No</label>
                  <input
                    type="text"
                    name="vehicalRTONo"
                    readOnly

                    value={editedData.selectedVehicleRTONo}
                    onChange={handleEditInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />
                  <label htmlFor="vehicalAddress">Vehicle Address</label>
                  <input
                    type="text"
                    name="vehicalAddress"
                    value={editedData.vehicalAddress}
                    readOnly

                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={handleEditInputChange}
                  />
                  <button type="submit" disabled={isLoading}>Save Changes</button>
                </form>
                <div>
                   <button onClick={closePopup}>

                  close
                </button>
                 </div>
           
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Weight;
