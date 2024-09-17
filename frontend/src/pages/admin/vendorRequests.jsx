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
    <>
      <Admin />
      {isRequestedCheck ? (
        <table>
          <tbody>
            {details.map((detail) => (
              <tr key={detail._id} className="odd:bg-white even:bg-slate-50">
                <td>{detail.gst}</td>
                <td>{detail.name}</td>
                <td>{detail.email}</td>

          
                {detail.status === "Pending" ?  (
                  <>
                    <td>
                      <button
                        className="bg-green-700"
                        onClick={() => handleApproveClick(detail._id)}
                      >
                        Approve
                      </button>
                    </td>
                    <td>
                      <button
                        className="bg-red-700"
                        onClick={() => handleRejectClick(detail._id)}
                      >
                        Reject
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                  <td>{detail.status}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Requests Available</p>
      )}
    </>
  );
}

export default VendorRequests;
