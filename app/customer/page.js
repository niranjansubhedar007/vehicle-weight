"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faCircleXmark,
  faTimesCircle,
  faPenToSquare,
  faTrash,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

const Customer = () => {
  const [formData, setFormData] = useState({
    coustomerName: "",
    address: "",
    mobileNo: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [coustomers, setCoustomers] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

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


  // Function to handle opening delete modal and set ID of customer to be deleted
  const handleOpenDeleteModal = (id) => {
    setDeleteItemId(id);
    setDeleteModalOpen(true);
  };

  // Function to handle closing delete modal
  const handleCloseDeleteModal = () => {
    setDeleteItemId(null);
    setDeleteModalOpen(false);
  };

  const handleDeleteConfirmation = async () => {
    try {
      // Send DELETE request to server to delete customer
      const response = await axios.delete(
        `https://niranjan.rajpawar.xyz/api/coustomer/coustomers/${deleteItemId}`
      );
      console.log("Deleted response:", response.data);

      // After successful deletion, close the delete modal and update customer list
      handleCloseDeleteModal();

      // Update the customer list by refetching from the server
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      // Handle error if deletion fails
    }
  };

  useEffect(() => {
    if (editItemId) {
      // Fetch the customer data to pre-fill the form
      axios
        .get(`https://niranjan.rajpawar.xyz/api/coustomer/coustomers/${editItemId}`)
        .then((response) => {
          setFormData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching customer data:", error);
        });
    }
  }, [editItemId]);

  // Function to handle toggle modal button click
  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleToggleEditModal = (id) => {
    setEditItemId(id);
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let capitalizedValue = value;
    if (name === "coustomerName" || name === "address") {
      // Capitalize the first letter of the value
      capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setFormData({ ...formData, [name]: capitalizedValue });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault(); // Prevent the default form submission behavior
  //   try {
  //     // Make a POST request to your backend API
  //     const response = await axios.post(
  //       "http://localhost:5000/api/coustomer/coustomers",
  //       formData
  //     );
  //     console.log("Customer added:", response.data);
  //     // Reset the form data
  //     setFormData({
  //       coustomerName: "",
  //       address: "",
  //       mobileNo: "",
  //     });
  //     // Close the modal
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     console.error("Error adding customer:", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      // Make a POST request to your backend API
      const response = await axios.post(
        "https://niranjan.rajpawar.xyz/api/coustomer/coustomers",
        formData
      );
      console.log("Customer added:", response.data);
      // Reset the form data
      setFormData({
        coustomerName: "",
        address: "",
        mobileNo: "",
      });
      // Close the modal
      setIsModalOpen(false);

      // Fetch the updated list of customers after adding a new customer
      fetchCustomers(); // <-- Call fetchCustomers to update the table
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      // Patch the form data to the server
      const response = await axios.patch(
        `https://niranjan.rajpawar.xyz/api/coustomer/coustomers/${editItemId}`,
        formData
      );
      // After handling the submission, reset the form and close the modal
      console.log("Customer saved:", response.data);
      setFormData({
        coustomerName: "",
        address: "",
        mobileNo: "",
      });
      setIsModalOpen(false); // Close the main modal
      setIsEditModalOpen(false); // Close the edit modal
      setEditItemId(null);

      // Fetch the updated list of customers
      fetchCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Calculate the index of the first and last vehicle to display
  const indexOfLastCustomers = currentPage * customersPerPage;
  const indexOfFirstCustomers = indexOfLastCustomers - customersPerPage;
  const currentCustomers = coustomers.slice(
    indexOfFirstCustomers,
    indexOfLastCustomers
  );

  // Function to handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(coustomers.length / customersPerPage);

  // Generate an array of page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "https://niranjan.rajpawar.xyz/api/coustomer/coustomers"
      );
      setCoustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Function to handle search input change
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to filter customers based on search term
  const filteredCustomers = coustomers.filter(
    (customer) =>
      customer.coustomerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.mobileNo && customer.mobileNo.toString().includes(searchTerm))
  );

  return (
    <div>
      <>
        <Sidebar />

        {/* modal */}

        <div className="p-2 lg:pl-72 lg:w-full md:pl-72 md:w-full text-black">
          <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
            {/* <!-- Main modal --> */}
            {isModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center z-50"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                {" "}
                <div className="bg-white rounded-lg shadow-lg">
                  {/* Modal header */}
                  <div className="flex items-center justify-between p-4 border-b rounded-t">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Add New Customer
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
                          htmlFor="name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Customer Name
                        </label>
                        <input
                          type="text"
                          name="coustomerName"
                          id="coustomerName"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type customer name"
                          required
                          value={formData.coustomerName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-span-2">
                        <label
                          htmlFor="address"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Customer Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type customer address"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
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
                          maxLength={10}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type customer contact number"
                          required
                          value={formData.mobileNo}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center border bg-violet-600 text-white hover:text-white"
                      >
                        Add New Customer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Customer Modal */}
            {isEditModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center z-50"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                {" "}
                <div className="bg-white rounded-lg shadow-lg">
                  {/* Modal header */}
                  <div className="flex items-center justify-between p-4 border-b rounded-t">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Edit Customer
                    </h3>
                    {/* Close button */}
                    <button
                      onClick={() => setIsEditModalOpen(false)}
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
                  <form className="p-4 md:p-5" onSubmit={handleEditSubmit}>
                    <div className="grid gap-4 mb-4 grid-cols-2">
                      <div className="col-span-2">
                        <label
                          htmlFor="name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Customer Name
                        </label>
                        <input
                          type="text"
                          name="coustomerName"
                          id="coustomerName"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type customer name"
                          required
                          value={formData.coustomerName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-span-2">
                        <label
                          htmlFor="address"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Customer Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type customer address"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
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
                          placeholder="Type customer contact number"
                          required
                          value={formData.mobileNo}
                          onChange={handleInputChange}
                          maxLength={10}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center border bg-violet-600 text-white hover:text-white"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {deleteModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center z-50"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                {" "}
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
                      Are you sure you want to delete this customer?
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

            <div className=" bg-white shadow-md rounded-md">
              <div className="flex flex-col md:flex-col lg:flex-row py-4 px-4 items-center justify-between mb-4">
                <h1 className="text-xl font-bold font-sans mb-2 md:mb-0 text-gray-600">
                  Customer
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
                      onChange={handleSearchInputChange}
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={handleToggleModal} // Call handleToggleModal function on click
                      className="bg-violet-100 text-violet-600 hover:bg-violet-600 hover:text-white font-bold py-2 rounded-md text-sm  mr-2 px-5"
                      type="button"
                    >
                      <FontAwesomeIcon className="px-2" icon={faCirclePlus} />
                      Add Customer
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
                        Customer Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 whitespace-nowrap text-left lg:pl-16"
                      >
                        Address
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 whitespace-nowrap text-left lg:pl-16"
                      >
                        Mobile No.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 whitespace-nowrap text-left pl-16 lg:pl-16"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  {/* <tbody>
                    {coustomers
                      .slice(
                        (currentPage - 1) * customersPerPage,
                        currentPage * customersPerPage
                      )
                      .map((customer, index) => (
                        <tr
                          key={customer._id}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-100 "
                          }
                        >
                          <td className="p-2  text-center text-gray">
                            {(currentPage - 1) * customersPerPage + index + 1}
                          </td>
                          <td className="px-6 py-4 text-left text-gray lg:pl-16 md:pl-6 pl-6">
                            {customer.coustomerName}
                          </td>
                          <td className="px-6 py-4 text-left text-gray lg:pl-16 md:pl-6 pl-6">
                            {customer.address}
                          </td>
                          <td className="px-6 py-4 text-left text-gray lg:pl-16 md:pl-6 pl-6">
                            {customer.mobileNo}
                          </td>
                          <td className="py-4 text-center pl-8">
                            <button
                              onClick={() =>
                                handleToggleEditModal(customer._id)
                              }
                              className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm"
                            >
                              <FontAwesomeIcon
                                icon={faPenToSquare}
                                color="#482668"
                              />
                            </button>
                            <button
                              onClick={() =>
                                handleOpenDeleteModal(customer._id)
                              } 
                              className=" text-gray-600 mr-3 font-sans focus:outline-none font-medium p-1 rounded-full px-2 text-sm"
                            >
                              <FontAwesomeIcon icon={faTrash} color="#482668" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody> */}
                  <tbody>
                    {filteredCustomers
                      .slice(
                        (currentPage - 1) * customersPerPage,
                        currentPage * customersPerPage
                      )
                      .map((customer, index) => (
                        <tr
                          key={customer._id}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-100 "
                          }
                        >
                          <td className="p-2  text-center text-gray">
                            {(currentPage - 1) * customersPerPage + index + 1}
                          </td>
                          <td className="px-6 py-4 text-left text-gray lg:pl-16 md:pl-6 pl-6">
                            {customer.coustomerName}
                          </td>
                          <td className="px-6 py-4 text-left text-gray lg:pl-16 md:pl-6 pl-6">
                            {customer.address}
                          </td>
                          <td className="px-6 py-4 text-left text-gray lg:pl-16 md:pl-6 pl-6">
                            {customer.mobileNo}
                          </td>
                          <td className="py-4 text-center pl-8">
                            <button
                              onClick={() =>
                                handleToggleEditModal(customer._id)
                              }
                              className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm"
                            >
                              <FontAwesomeIcon
                                icon={faPenToSquare}
                                color="#482668"
                              />
                            </button>
                            <button
                              onClick={() =>
                                handleOpenDeleteModal(customer._id)
                              }
                              className=" text-gray-600 mr-3 font-sans focus:outline-none font-medium p-1 rounded-full px-2 text-sm"
                            >
                              <FontAwesomeIcon icon={faTrash} color="#482668" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="flex justify-center mt-6 mb-6">
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
      </>
    </div>
  );
};

export default Customer;
