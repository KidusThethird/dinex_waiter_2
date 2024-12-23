'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '@/apiConfig';
import { toast } from "sonner"
import { setAccessToken, getAccessToken, clearAccessToken } from "../lib/tokenManager";
import Image from "next/image";
import { SquareUserRound } from 'lucide-react';
import Login_Dialog from '@/components/custom_components/login_credential';




export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [accessToken, setAccessToken] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [data, setData] = useState([]);

  //const accessToken = getAccessToken();


  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setErrorMessage(null); // Clear previous errors

    try {
      const response = await axios.post(`${apiUrl}/login_waiter/login`, {
        email,
        password,
      });

      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
       // setAccessToken(responseData.accessToken);

        console.log('Access Token:', response.data.accessToken);
        toast("Login Successful.")
window.location.href = "/home";
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } catch (error) {
      console.log("Error from catch: "+error)
      setErrorMessage( 'Log in failed. Try again with correct credentials.');
    }
  };


  useEffect(() => {
    // Function to fetch data
    const fetchWaiters = async () => {
      try {
        const response = await fetch('http://localhost:5000/waiters');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result); // Update state with the fetched data
      } catch (error) {
        console.error('Error fetching waiters:', error);
      }
    };

    fetchWaiters(); // Call the fetch function
  }, []);

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">



      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">



      <div className="flex items-center m-4">
            <Image
              src="/logo/logo3.png" // Path relative to the public directory
              alt="Company Logo"
              width={150} // Adjust width
              height={150} // Adjust height
              className=" rounded mx-auto" // Optional styling
            />
          </div>

        <h2 className="text-xl font-semibold text-primaryColor text-center">Login</h2>

<div className='grid grid-cols-4 gap-2 my-4'>
        {data.map((waiter: any) => {
  return <div key={waiter.id} className='border-2 p-2 rounded'>

    <div>
      <SquareUserRound size={20} className='text-white mx-auto bg-primaryColor w-fit rounded-lg'/>
      <h1 className='text-center text-sm'>{waiter.firstName} {waiter.lastName.slice(0, 2)}</h1>
      <div className='mx-auto  w-fit'>
      <Login_Dialog id={waiter.id} firstName={waiter.firstName} lastName={waiter.lastName} email={waiter.email}/>
    </div></div>
  </div>;
})}</div>

        {/* <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primaryColor hover:bg-primaryColor-light text-white py-2 px-4 rounded focus:outline-none"
          >
            Login
          </button>
        </form> */}

        {errorMessage && (
          <div className="mt-4 text-center text-sm text-red-500">
            {errorMessage}
          </div>
        )}

        {/* {accessToken && (
          <div className="mt-4 text-center text-sm text-green-500">
            Successfully logged in! Access token: {accessToken}
          </div>
        )} */}
      </div>
    </div>
  );
}
