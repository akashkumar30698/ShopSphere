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

        if (data.status == 'Pending') {
          setIsApproved(false); 
          setIsRejected(false);
          setIsPending(true);
        } 
        else if(data.status == 'Approved'){
           setIsApproved(true)
           setIsPending(false)
           setIsRejected(false)
        }
        else if (data.status == 'Rejected') {
          setIsApproved(false); 
          setIsRejected(true);
          setIsPending(false);
        } 
        else {
          setIsApproved(false);
          setIsPending(true);
          setIsRejected(false);
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

  useEffect(()=>{
    fetchVendorStatus()
  },[isApproved])



  return (
    <div className="vendor-container">
      <VendorNavbar />
      <div className="status-container">
        <div className="status-card">
          <div className="card-header">
            <h2>Vendor Application Status</h2>
          </div>
          <div className="card-content">
            <table className="status-table">
              <tbody>
                <tr>
                  <td className="label">Status</td>
                  <td>
                    {isApproved && (
                      <span className="status-badge approved">
                        <i className="fas fa-check-circle"></i>
                        Approved
                      </span>
                    )}
                    {isRejected && (
                      <span className="status-badge rejected">
                        <i className="fas fa-times-circle"></i>
                        Rejected
                      </span>
                    )}
                    {isPending && (
                      <span className="status-badge pending">
                        <i className="fas fa-clock"></i>
                        Pending Review
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="label">Application ID</td>
                  <td className="value">{userId}</td>
                </tr>
                <tr>
                  <td className="label">Last Updated</td>
                  <td className="value">{new Date().toLocaleDateString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorSell;
