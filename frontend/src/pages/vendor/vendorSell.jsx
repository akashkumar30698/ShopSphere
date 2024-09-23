import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import VendorNavbar from "../../components/VendorNavbar";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { useLogin } from "../../ContextApi/loginContext";

function VendorSell() {

  const { isApproved, setIsApproved } = useLogin();
  const [isPending, setIsPending] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const { userId } = useParams();

  const fetchVendorStatus = async () => {
    try {
      const token = Cookies.get("accessToken");

      if (!token) {
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_APP_URL}/vendorStatus?userId=${userId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();

        console.log(data);

        if (data.initialVendorStatus == 'Pending' && !data.updatedVendorStatus) {
          setIsApproved(false); 
          setIsRejected(false);
          setIsPending(true);
          console.log("1 executed");
        } 
        else if(data.initialVendorStatus == "Approved"){
           setIsApproved(true)
           setIsPending(false)
           setIsRejected(false)
        }
        else if (data.initialVendorStatus == 'Pending' && (data.updatedVendorStatus == 'Approved' || data.initialVendorStatus == 'Approved')) {
          setIsApproved(true); 
          setIsRejected(false);
          setIsPending(false);
          console.log("2 executed");
        } 
        else if (data.initialVendorStatus == 'Pending' && (data.updatedVendorStatus == 'Rejected' || data.initialVendorStatus == 'Rejected')) {
          setIsApproved(false);
          setIsPending(false);
          setIsRejected(true);
          console.log("3 executed");
        }
      }
    } catch (err) {
      console.log("Some error occurred", err);
      setIsApproved(false);
      setIsRejected(false);
      setIsPending(true);
    }
  };

  useEffect(() => {
    const socket = io(import.meta.env.VITE_APP_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    fetchVendorStatus(); 
    
    socket.on("connect", () => {
      console.log("A user connected");
    });

    socket.on("approvalStatus", (data) => {
      const status = data.status;
      console.log(status)
      if (status == 'Approved') {
        setIsApproved(true);
        setIsPending(false);
        setIsRejected(false);
        socket.disconnect();
      } else if (status == 'Rejected') {
        setIsApproved(false);
        setIsPending(false);
        setIsRejected(true);
        socket.disconnect(); 
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <VendorNavbar />
      {isApproved && <p>Approved</p>}
      {isRejected && <p>Rejected</p>}
      {isPending && <p>Pending</p>}
    </>
  );
}

export default VendorSell;
