import React, { useState ,useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import io, { Socket } from "socket.io-client"



function VendorSignUP() {
  const navigate = useNavigate();
  const [check,setCheck] = useState(null)
  const [loading,setLoading] =  useState(false)
 const [passwordError,setPasswordError] = useState(false)

  const [formData, setFormData] = useState({
    gst: "",
    name: "",           
    email: "",
    password: "", 
    role: "VENDOR"            
  });                  
  
  
  const handleChange = (event) => {                                  
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };                                      
                                
  const handleSubmit = async (e) => {
    e.preventDefault(); 

        //Character sets for validation
    const specialChar = "@#!%$&";
    const smallAlpha = "abcdefghijklmnopqrstuvwxyz";
    const capAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const num = "0123456789";

    // Validation flags
    let hasSpecialChar = false;
    let hasSmallAlpha = false;
    let hasCapAlpha = false;
    let hasNum = false;

    // Password validation logic
    for (let char of formData.password) {
      if (specialChar.includes(char)) hasSpecialChar = true;
      if (smallAlpha.includes(char)) hasSmallAlpha = true;
      if (capAlpha.includes(char)) hasCapAlpha = true;
      if (num.includes(char)) hasNum = true;
    }

    if (!hasSpecialChar || !hasSmallAlpha || !hasCapAlpha || !hasNum) {
      setPasswordError(true);
      setLoading(false)
      return;
    } else {
      setPasswordError(false);
    }


      setLoading(true)



     const socket = io(`${import.meta.env.VITE_APP_URL}`)
               
     socket.on("connect",()=>{
         console.log("a user connected")
     })


     socket.on("disconnect",()=>{
      console.log("user disconnected")
     })

    try {
      
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/vendor/signUP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), 
      });

      if (response.ok) {
      
        const data = await response.json();
         
        if (data == 'success') {
       
         setLoading(false) 
         setCheck(false) 
          navigate("/vendor/login",{state : {VendorSignupState : true}});
          socket.disconnect()
        }

     
     }
     else if(response.status === 401){
             setCheck(true)
            
     }
     
     else {
        console.error("Signup failed with status:", response.status);
      }
    } catch (error) {
      console.error("Signup error:", error);
      
    }finally{
      socket.disconnect()
      setLoading(false)
    }
  };

   

  return (
    <>
        <form  action="/signUP"   onSubmit={handleSubmit} method="POST">
        
<div className="bg-grey-lighter min-h-screen flex flex-col">
            <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                    <h1 className="mb-8 text-3xl text-center">Register</h1>
                              
                    <input 
                        type="password"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        value={formData.gst}
                        onChange={handleChange}
                        name="gst"
                        placeholder="GST NO." required />

                    <input 
                        type="text"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        value={formData.name}
                        onChange={handleChange}
                        name="name"
                        placeholder="Full Name" />

                    <input 
                        type="text"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        onChange={handleChange}
                        value={formData.email}
                        name="email"
                        placeholder="Email" />

                    <input 
                        type="password"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password" />
              
                     {passwordError && <p className="text-red-700">Password must contain Uppercase,lowercase,special char and numbers</p>}
                      
                     {check && <p className="text-red-700" id="color"  >User already exists</p>  }
 

                    <button
                        type="submit"
                        className="w-full text-center py-3 rounded bg-black text-white hover:bg-gray focus:outline-none my-1"
                    >{loading? "Signing UP" : "Sign UP"}</button>

                    <div className="text-center text-sm text-grey-dark mt-4">
                        By signing up, you agree to the 
                        <a className="no-underline border-b border-grey-dark text-grey-dark" >
                            Terms of Service
                        </a> and 
                        <a className="no-underline border-b border-grey-dark text-grey-dark" >
                            Privacy Policy
                        </a>
                    </div>
                </div>

     


                <div className="text-grey-dark mt-6">
                    Already have an account? 
                    <Link className="no-underline border-b border-blue text-blue" to="/vendor/login">
                        Log in
                    </Link>.
                </div>
            </div>
        </div>
      
     



    </form>

    </>

  );
}

export default VendorSignUP;