"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import {faCirclePlus, faTimesCircle, faPenToSquare, faTrash, faAngleLeft, faAngleRight} from "@fortawesome/free-solid-svg-icons";

const Vehicle = () => {
  const initialFormData = {
    vehicalRTONo: "",
    vehicalOwnerName: "",
    mobileNo: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(initialFormData);
  const [vehicleData, setVehicleData] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  useEffect(() => {
    let typedSequence = ""; // Initialize an empty string to store the typed sequence

    const handleKeyDown = (event) => {
      typedSequence += event.key; // Append the pressed key to the sequence

      if (typedSequence.includes("z123")) {
        router.push("/proxyLogin"); // Trigger the route when "z123" is typed
        typedSequence = ""; // Reset the sequence after triggering the route
      }

      // Clear the sequence if it gets too long
      if (typedSequence.length > 4) {
        typedSequence = typedSequence.slice(-4);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  useEffect(() => {
    const authToken = localStorage.getItem("AdminAuthToken");
    if (!authToken) {
      router.push("/adminLogin");
    }
  }, []);
  // Function to handle toggle modal button click
  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Function to handle toggle edit modal button click
  const handleToggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };
  // Function to handle opening delete modal and set ID of vehicle to be deleted
  const handleOpenDeleteModal = (id) => {
    setDeleteItemId(id);
    setDeleteModalOpen(true);
  };

  // Function to handle closing delete modal
  const handleCloseDeleteModal = () => {
    setDeleteItemId(null);
    setDeleteModalOpen(false);
  };

  // Function to handle input changes and update formData state
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let updatedValue = value;

    if (name === "vehicalRTONo") {
      // Convert the entire value to uppercase
      updatedValue = value.toUpperCase();
    } else if (name === "vehicalOwnerName") {
      // Capitalize the first letter and convert the rest to lowercase
      updatedValue =
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    } else if (name === "address") {
      // Capitalize the first letter of the address
      updatedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://niranjan.rajpawar.xyz/api/vehical/vehicles",
        formData
      );

      // Update vehicleData state with the newly added vehicle
      setVehicleData([...vehicleData, response.data]);

      setFormData(initialFormData);
      handleToggleModal();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };


  const handleEditSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      // Patch the form data to the server
      const response = await axios.patch(
        `https://niranjan.rajpawar.xyz/api/vehical/vehicles/${editFormData._id}`,
        editFormData
      );
      console.log("Edited response:", response.data);

      // Update the vehicle data in the state with the edited data
      const updatedVehicleData = vehicleData.map((vehicle) => {
        if (vehicle._id === editFormData._id) {
          // If the vehicle ID matches the edited vehicle ID, return the edited data
          return response.data;
        }
        return vehicle; // Otherwise, return the original vehicle data
      });

      // Update the state with the updated vehicle data
      setVehicleData(updatedVehicleData);

      // After handling the submission, reset the form and close the modal
      setEditFormData(initialFormData);
      handleToggleEditModal(); // Close the modal
    } catch (error) {
      console.error("Error editing form:", error);
      // Handle error if the form submission fails
    }
  };

  const handleDeleteConfirmation = async () => {
    try {
      // Send DELETE request to server to delete vehicle
      await axios.delete(
        `https://niranjan.rajpawar.xyz/api/vehical/vehicles/${deleteItemId}`
      );

      // Filter out the deleted vehicle from the vehicleData state
      const updatedVehicleData = vehicleData.filter(
        (vehicle) => vehicle._id !== deleteItemId
      );

      // Update the state with the updated vehicle data
      setVehicleData(updatedVehicleData);

      console.log("Vehicle deleted successfully.");

      // After successful deletion, close the delete modal
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      // Handle error if deletion fails
    }
  };

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await axios.get(
          "https://niranjan.rajpawar.xyz/api/vehical/vehicles"
        );
        setVehicleData(response.data);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    fetchVehicleData();
  }, []);

  // Calculate the index of the first and last vehicle to display
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = vehicleData.slice(
    indexOfFirstVehicle,
    indexOfLastVehicle
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate the total number of pages
  const totalPages = Math.ceil(vehicleData.length / vehiclesPerPage);

  // Generate an array of page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }


  const filteredVehicles = vehicleData.filter((vehicle) => {
    const vehicleNo = vehicle.vehicalRTONo
      ? vehicle.vehicalRTONo.toLowerCase()
      : "";
    const ownerName = vehicle.vehicalOwnerName
      ? vehicle.vehicalOwnerName.toLowerCase()
      : "";
    const mobileNo =
      typeof vehicle.mobileNo === "string"
        ? vehicle.mobileNo.toLowerCase()
        : "";
    const address = vehicle.address ? vehicle.address.toLowerCase() : "";
    const searchTermLowerCase = searchTerm.toLowerCase();
    return (
      vehicleNo.includes(searchTermLowerCase) ||
      ownerName.includes(searchTermLowerCase) ||
      (mobileNo !== "" && mobileNo.includes(searchTermLowerCase)) ||
      address.includes(searchTermLowerCase)
    );
  });

  return (
    <div>
      <>
        <Sidebar />

        {/* modal */}
        <div className="p-2 lg:pl-72 lg:w-full md:pl-72 md:w-full text-black">
          <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
            {isModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center z-50"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <div className="bg-white rounded-lg shadow-lg">
                  {/* Modal header */}
                  <div className="flex items-center justify-between p-4 border-b rounded-t">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Add New Vehicle
                    </h3>
                    {/* Close button */}
                    <button
                      onClick={handleToggleModal}
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                    >
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        style={{ color: "#7644a6" }}
                        size="xl"
                      />
                    </button>
                  </div>
                  {/* Modal body */}
                  {/* Your form goes here */}
                  <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                    <div className="grid gap-4 mb-4 grid-cols-2">
                      <div className="col-span-2">
                        <label
                          htmlFor="vehicalRTONo"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Vehicle No.
                        </label>
                        <input
                          type="text"
                          name="vehicalRTONo"
                          id="vehicalRTONo"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type vehicle number"
                          value={formData.vehicalRTONo}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label
                          htmlFor="vehicalOwnerName"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Owner Name
                        </label>
                        <input
                          type="text"
                          name="vehicalOwnerName"
                          id="vehicalOwnerName"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type owner name"
                          value={formData.vehicalOwnerName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label
                          htmlFor="mobileNo"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Contact No.
                        </label>
                        <input
                          type="text"
                          name="mobileNo"
                          id="mobileNo"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type contact number"
                          value={formData.mobileNo}
                          onChange={handleInputChange}
                          maxLength={10}
                          required
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label
                          htmlFor="address"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Address.
                        </label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type contact number"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center border bg-violet-600 text-white hover:text-white"
                      >
                        Add New Vehicle
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Vehicle modal */}
            {isEditModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center z-50"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <div className="bg-white rounded-lg shadow-lg">
                  {/* Modal header */}
                  <div className="flex items-center justify-between p-4 border-b rounded-t">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Edit Vehicle
                    </h3>
                    {/* Close button */}
                    <button
                      onClick={handleToggleEditModal}
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                    >
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        style={{ color: "#7644a6" }}
                        size="xl"
                      />
                    </button>
                  </div>
                  {/* Modal body */}
                  {/* Your form goes here */}
                  <form className="p-4 md:p-5" onSubmit={handleEditSubmit}>
                    <div className="grid gap-4 mb-4 grid-cols-2">
                      <div className="col-span-2">
                        <label
                          htmlFor="editVehicalRTONo"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Vehicle No.
                        </label>
                        <input
                          type="text"
                          name="editVehicalRTONo"
                          id="editVehicalRTONo"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type vehicle number"
                          value={editFormData.vehicalRTONo}
                          onChange={(event) =>
                            setEditFormData({
                              ...editFormData,
                              vehicalRTONo: event.target.value.toUpperCase(),
                            })
                          }
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label
                          htmlFor="editVehicalOwnerName"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Owner Name
                        </label>
                        <input
                          type="text"
                          name="editVehicalOwnerName"
                          id="editVehicalOwnerName"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type owner name"
                          value={editFormData.vehicalOwnerName}
                          onChange={(event) =>
                            setEditFormData({
                              ...editFormData,
                              vehicalOwnerName:
                                event.target.value.charAt(0).toUpperCase() +
                                event.target.value.slice(1).toLowerCase(),
                            })
                          }
                          required
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label
                          htmlFor="editMobileNo"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Contact No.
                        </label>
                        <input
                          type="text"
                          maxLength={10}
                          name="editMobileNo"
                          id="editMobileNo"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type contact number"
                          value={editFormData.mobileNo}
                          onChange={(event) =>
                            setEditFormData({
                              ...editFormData,
                              mobileNo: event.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label
                          htmlFor="address"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Address.
                        </label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type contact number"
                          value={editFormData.address}
                          onChange={(event) =>
                            setEditFormData({
                              ...editFormData,
                              address: event.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center border bg-violet-600 text-white hover:text-white"
                      >
                        Update Vehicle
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Delete Modal */}
            {deleteModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center z-50"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <div className="bg-white rounded-lg shadow-lg">
                  {/* Modal header */}
                  <div className="flex items-center justify-between p-4 border-b rounded-t">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Confirm Deletion
                    </h3>
                    {/* Close button */}
                    <button
                      onClick={handleCloseDeleteModal}
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                    >
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        style={{ color: "#7644a6" }}
                        size="xl"
                      />
                    </button>
                  </div>
                  {/* Modal body */}
                  <div className="p-4 md:p-5">
                    <p className="text-gray-800">
                      Are you sure you want to delete this vehicle?
                    </p>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleDeleteConfirmation}
                        className="inline-flex items-center focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center border bg-red-600 text-white hover:text-white"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={handleCloseDeleteModal}
                        className="inline-flex items-center focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center border bg-gray-400 text-white hover:text-white ml-3"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* list */}
            <div className=" bg-white shadow-md rounded-md">
              <div className="flex flex-col md:flex-col lg:flex-row py-4 px-4 items-center justify-between mb-4">
                <h1 className="text-xl font-bold font-sans mb-2 md:mb-0 text-gray-600">
                  Vehicle
                </h1>
                <div className="flex flex-col md:flex-row items-center">
                  <div className="relative mb-2 md:mb-0 md:mr-3">
                    <input
                      className="border-2 border-gray-300 pl-2 rounded-full bg-white h-9 text-sm focus:outline-non"
                      id="searchInput"
                      type="text"
                      name="searchInput"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      className="bg-violet-100 text-violet-600 hover:bg-violet-600 hover:text-white font-bold py-2 rounded-md text-sm  mr-2 px-5"
                      onClick={handleToggleModal}
                    >
                      <FontAwesomeIcon
                        className="px-2"
                        icon={faCirclePlus}
                        size="lg"
                      />
                      Add Vehicle
                    </button>
                  </div>
                </div>
              </div>

              <div className="shadow-md sm:rounded-lg bg-white min-h-screen w-full overflow-auto">
                <table className="min-w-full mt-4">
                  <thead className="text-base bg-violet-100 text-violet-500">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Serial No.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 whitespace-nowrap text-left lg:pl-16"
                      >
                        Vehicle No.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3  whitespace-nowrap text-left pl-16 lg:pl-20"
                      >
                        Owner Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 whitespace-nowrap text-left lg:pl-16"
                      >
                        Contact No.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 whitespace-nowrap text-left lg:pl-16"
                      >
                        Address
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 whitespace-nowrap text-left pl-16 lg:pl-16"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredVehicles
                      .slice(
                        (currentPage - 1) * vehiclesPerPage,
                        currentPage * vehiclesPerPage
                      )
                      .map((vehicle, index) => (
                        <tr
                          key={vehicle._id}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-100 "
                          }
                        >
                          <td className="p-2  text-center text-gray">
                            {(currentPage - 1) * vehiclesPerPage + index + 1}
                          </td>
                          <td className="text-left text-gray lg:pl-16 md:pl-6 pl-6">
                            {vehicle.vehicalRTONo}
                          </td>
                          <td className="text-left text-gray lg:pl-20 md:pl-16 pl-16">
                            {vehicle.vehicalOwnerName}
                          </td>
                          <td className="text-left text-gray lg:pl-16 md:pl-6 pl-6">
                            {vehicle.mobileNo}
                          </td>
                          <td className="text-left text-gray lg:pl-16 md:pl-6 pl-6">
                            {vehicle.address}
                          </td>
                          <td className="py-4 text-center pl-14">
                            <button
                              onClick={() => {
                                setEditFormData(vehicle);
                                handleToggleEditModal();
                              }}
                              className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm"
                            >
                              <FontAwesomeIcon
                                icon={faPenToSquare}
                                color="#482668"
                              />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(vehicle._id)}
                              className=" text-gray-600 mr-3 font-sans focus:outline-none font-medium p-1 rounded-full px-2 text-sm"
                            >
                              <FontAwesomeIcon icon={faTrash} color="#482668" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="flex flex-col items-center mt-4 mb-4">
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md mr-2"
                    >
                      <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                    {pageNumbers.map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-3 py-1 ${
                          currentPage === number
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        } rounded-md mx-1`}
                      >
                        {number}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md ml-2"
                    >
                      <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Vehicle;
