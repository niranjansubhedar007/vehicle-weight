"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  faEye,
  faEyeSlash,
  faTimes,
  faTrash,
  faUser,
  fawhatsapp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";


export default function ProxyLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://niranjan.rajpawar.xyz/api/proxyLogin/login",
        { username, password }
      );
      // Handle successful login, save token to localStorage, redirect, etc.
      console.log(response.data);
      const token = response.data.token;

      localStorage.setItem("ProxyAdminAuthToken", token);
      setMessage("Login successful");
      router.push("/proxyMaterial");
    } catch (error) {
      setMessage("Authentication failed");
    }
  };

  useEffect(() => {
    localStorage.removeItem("ProxyAdminAuthToken");
  }, []);
  const [isOrderEnabled, setIsOrderEnabled] = useState(true);
  const handleToggle = () => {
    const newIsOrderEnabled = !isOrderEnabled;
    setIsOrderEnabled(newIsOrderEnabled);
    localStorage.setItem("isOrderEnabled", newIsOrderEnabled.toString());
    // Disable the toggle
    localStorage.setItem("disableToggle", "true");
  };
  const closeLogin=()=>{
    localStorage.removeItem("AdminAuthToken");
    localStorage.removeItem("EmployeeAuthToken"); // Corrected typo
    router.push("/adminLogin");
    
  }
  return (
    <>
     
        <div
          className="bg-cover bg-center min-h-screen flex items-center justify-center"
          style={{ backgroundImage: "url('blue.jpg')" }}
        >
          <div className="absolute inset-0 bg-opacity-50 bg-violet-900"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-md w-full px-6 ">
              <div className="flex flex-col  items-center justify-center h-full">
                <img src="/steel.png" alt="logo" className="h-16 w-16" />
                <h1 className="text-3xl font-bold text-white mb-6">
                  Khatav Steel
                </h1>
              </div>
             

              <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm relative">
                <div className="w-full p-3 lg:w-96 border-solid ">
               
                  <p className="text-2xl text-violet-700 text-center font-medium mb-8">
                    Welcome!
                  </p>
                  <div><FontAwesomeIcon icon={faTimes} onClick={closeLogin} className="text-purple-500 cursor-pointer absolute right-2 top-2"/></div>

                  <div className="mt-4 relative">
                    <label className="block text-gray-700 text-sm md:text-base font-semibold mb-2">
                      Username
                    </label>
                    <input
                      className="bg-violet-200 text-gray-700 focus:outline-none focus:shadow-outline border border-violet-300 rounded py-1 px-4 block w-full appearance-none pr-10 text-sm md:text-base"
                      type="text"
                      value={username}
                      placeholder="Enter Username"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 mt-8">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-violet-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4 relative">
                    <label className="block text-gray-700 text-sm md:text-base font-semibold mb-2">
                      Password
                    </label>
                    <input
                      className="bg-violet-200 text-gray-700 focus:outline-none focus:shadow-outline border border-violet-300 rounded py-1 px-4 block w-full appearance-none pr-10 text-sm md:text-base"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      placeholder="Enter Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 mt-8">
                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        className="text-violet-500 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </div>
                  </div>
                  <div className=" mb-8 flex justify-end">
                    <Link
                      href="/proxyForgotPassword"
                      className="text-sm md:text-sm text-violet-500 mr-2"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="flex justify-center mt-1">
                    <button
                      className="bg-violet-200 text-violet-600 hover:bg-violet-600 hover:text-white font-bold py-2 rounded-md text-sm  px-5 w-full"
                      onClick={handleLogin}
                    >
                      Login
                    </button>
                  </div>

                  {message && <p className="mt-4 text-red-500">{message}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

    </>
  );
}
