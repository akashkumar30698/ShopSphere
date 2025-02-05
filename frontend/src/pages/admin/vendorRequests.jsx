import React, { useEffect, useState } from "react";
import Admin from "../../components/admin";
import Cookies from "js-cookie";
import io from "socket.io-client";

function VendorRequests() {
  const [isRequestedCheck, setIsRequestedCheck] = useState(false);
  const [details, setDetails] = useState([]);
  
  


  useEffect(() => {
    fetchVendorDetails();
    const socket = io(import.meta.env.VITE_APP_URL, {
      withCredentials: true,
      transports: ['websocket'], 
    });


    socket.on("connect",()=>{
      console.log("A user connected")
    })

    socket.on("message",(data)=>{
      console.log(data)
      setDetails((prevDetails)=>{
          return [...prevDetails,data]
      })
    })
    
    
     socket.on("disconnect",()=>{
      console.log("User disconnected")
     })

    return ()=>{
      socket.disconnect()
    }

  }, []);


  

  const fetchVendorDetails = async () => {
    const token = Cookies.get("accessToken");

    if (!token) {
      return null;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_APP_URL}/getVendors`, {
        method: "GET",
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setDetails(data.getVendors);
        setIsRequestedCheck(data.getVendors.length > 0);
      } else {
        console.log("Failed to fetch vendors");
        setIsRequestedCheck(false);
      }
    } catch (err) {
      console.log("Some error occurred", err);
    }
  };


  const updateVendorStatus = async (id, status) => {

          //Send the status to vendor
          const socket = io(`${import.meta.env.VITE_APP_URL}`)

    try {
      const token = Cookies.get("accessToken");
  
      if (!token) {
        return;
      } 
               
      socket.on("connect",()=>{
          console.log("a user connected")
      })
 
      socket.on("disconnect",()=>{
       console.log("user disconnected")
      })

      
      const res = await fetch(`${import.meta.env.VITE_APP_URL}/updateVendorStatus/?id=${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
  
      if (res.ok) {
        
        const updateVendor = await res.json()
         setDetails((prevDetails) =>
          prevDetails.map((detail) =>
            detail._id === id ? { ...detail, status } : detail
          )
         );

         socket.disconnect()   
         
      } else {
        console.log("Failed to update vendor status");
      }
    } catch (err) {
      console.log("Some error occurred", err);
    }finally{
      socket.disconnect()
    }
  };
  

  const handleApproveClick = (id) => {
    updateVendorStatus(id, "Approved");
  };

  
  const handleRejectClick = (id) => {
    
    updateVendorStatus(id, "Rejected");
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Admin />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Vendor Requests</h1>
          {isRequestedCheck ? (
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      GST
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {details.map((detail) => (
                    <tr key={detail._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{detail.gst}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{detail.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{detail.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            detail.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : detail.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {detail.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {detail.status === "Pending" && (
                          <div className="flex space-x-2">
                            <button
                              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                              onClick={() => handleApproveClick(detail._id)}
                            >
                              Approve
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                              onClick={() => handleRejectClick(detail._id)}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No Requests Available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default VendorRequests;
