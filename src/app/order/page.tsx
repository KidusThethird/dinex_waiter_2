"use client";
import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  setAccessToken,
  getAccessToken,
  clearAccessToken,
} from "../../lib/tokenManager";
import { apiUrl } from "@/apiConfig";

interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  type: string;
  status: string;
  email: string;
  password: string;
  phoneNumber: string;
  deleted: boolean;
  createdAt: string;
}

const accessToken = getAccessToken();

export default function Order() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null); // State for profile data
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Reference for the search area
  const searchAreaRef = useRef<HTMLDivElement>(null);

  // Sorted options list
  const options: string[] = [
    "Pizza",
    "Burger",
    "Pasta",
    "Sushi",
    "Salad",
    "Steak",
    "Tacos",
    "Fries",
  ].sort(); // Sort alphabetically

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter options based on the search term
    if (value.trim() !== "") {
      const filtered = options.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
      setShowDropdown(true);
    } else {
      setFilteredOptions(options); // Show all options if search is empty
    }
  };

  const handleOptionClick = (option: string) => {
    setSearchTerm(option); // Set the selected option as the search term
    setShowDropdown(false); // Close the dropdown
  };

  const toggleDropdown = () => {
    // Show all options if the dropdown is opened
    setFilteredOptions(options);
    setShowDropdown((prev) => !prev);
  };

  // Close dropdown when clicking outside the search area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchAreaRef.current &&
        !searchAreaRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!accessToken) {
          setError("Waiter is not logged in");
          return;
        }

        const response = await fetch(`${apiUrl}/login_waiter/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 403) {
          setError("Waiter is not logged in");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data: Profile = await response.json();
        setProfile(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <div className="py-14 px-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Order</h1>
        <div className="relative" ref={searchAreaRef}>
          <div className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search items..."
              className="w-full border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={toggleDropdown}
              className="px-4 py-2 bg-gray-300 border border-gray-300 rounded-r-lg focus:outline-none hover:bg-gray-400"
            >
              ▼
            </button>
          </div>
          {showDropdown && (
            <ul className="absolute left-0 right-0 mt-2 max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <li
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {option}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">No results found</li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 my-6 w-full">
        <div className="col-span-3  w-full p-7 ">
          <Tabs defaultValue="account" className="w-full">
            <TabsList>
              <TabsTrigger value="account">Kitchen</TabsTrigger>
              <TabsTrigger value="password">Hot Drinks</TabsTrigger>
              <TabsTrigger value="password">Soft Drinks</TabsTrigger>
              <TabsTrigger value="password">Special</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <div className=" w-full">
                <div className="w-full grid grid-cols-5 gap-3">
                  {options.map((item, index): any => {
                    return (
                      <div
                        key={index}
                        className="border border-primaryColor flex rounded w-full bg-primaryColor bg-opacity-30 text-gray-800 p-4"
                      >
                        <h1 className="text-center my-auto mx-auto">{item}</h1>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="password">
              Change your password here.
            </TabsContent>
          </Tabs>
        </div>
        <div className="col-span-1">
          {/* <div>
            <h1>Order Receipt</h1>
            <h1>Waiter: </h1> {profile?.firstName}
          </div> */}

          <div className="bg-primaryColor bg-opacity-20 py-6 mx-2 px-2 rounded shadow-xl">
            <h1 className="text-lg text-center underline">Order Receipt</h1>{" "}
            <div className="flex space-x-4 bg-primaryColor bg-opacity-65 text-white px-2 my-3">
              <h1 className="bg-primaryColor px-1 rounded-2xl">Orders: 2</h1>{" "}
              <h1>Table: 3</h1>
            </div>
            <div className="my-3">
              <h1 className="">
                Waiter:{" "}
                <span className="underline text-primaryColor">
                  {profile?.firstName}
                </span>
              </h1>
              <h1>
                Date:{" "}
                <span className="underline text-primaryColor">
                  {new Date().toLocaleDateString()}
                </span>
              </h1>
            </div>
            <div className="bg-primaryColor bg-opacity-50 p-2 rounded-2xl">
              <table className="w-full">
                <thead className="justify-start">
                  <tr className="text-white">
                    <th className="text-left ">Menu</th>
                    <th className="text-left">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Pizza</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>Burger</td>
                    <td>2</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-around my-5">
              <h1 className="text-white bg-primaryColor px-2 rounded">Table</h1>
              <h1 className="text-white bg-primaryColor px-2 rounded">
                Delivary
              </h1>
              <h1 className="text-white bg-primaryColor px-2 rounded">Bank</h1>
            </div>
            <div>
              <h1 className="text-white bg-red-600 w-fit px-2 rounded">
                Clear
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
