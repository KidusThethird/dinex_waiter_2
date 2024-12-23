"use client";
import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  setAccessToken,
  getAccessToken,
  clearAccessToken,
} from "../../lib/tokenManager";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
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

export default function NavBar() {
  const pathname = usePathname(); // Get the current route
  const [profile, setProfile] = useState<Profile | null>(null); // State for profile data
  const [error, setError] = useState<string | null>(null);
  const setTokenLogout = () => {
    setAccessToken("0");
    window.location.href = "/";
  };

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

  // Hide the NavBar if the current route is "/login"
  if (pathname === "/") {
    return null;
  }

  return (
    <div className="w-full fixed px-5 top-0 bg-primaryColor">
      <div className="text-white py-2 flex justify-between w-full">
        <div className="flex space-x-14">
          <a href="/order">ORDER</a>
          <a href="/my_orders">MY ORDERS</a>

          <a
            className=" bg-white text-primaryColor px-2 py-1 rounded"
            href="/profile"
          >
            {profile?.firstName} {profile?.lastName}
          </a>
        </div>
        <div className="text-white">
          <button onClick={() => setTokenLogout()}>Log Out</button>
          {/* <Popover>
            <PopoverTrigger>
              <Menu />
            </PopoverTrigger>
            <PopoverContent>
             
            </PopoverContent>
          </Popover> */}
        </div>
      </div>
    </div>
  );
}
