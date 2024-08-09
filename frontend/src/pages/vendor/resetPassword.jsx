import { useState } from 'react'
import {  useNavigate,useLocation } from "react-router-dom";

function VendorResetPassword(){
    const navigate = useNavigate()
    const[check,setCheck] = useState(false)
    const [loading,setLoading] = useState(false)
    const[checkAuthenEmailReset,setCheckAuthenEmailReset] = useState(false)
    const [passwordError,setPasswordError] = useState(false)
    const [resetData,setResetData] = useState({
        email : "",
        password : "",
        confirmPassword : ""
    })
    const location = useLocation()
    const  { otpState }  = location.state || {}

    const handleChange = (e) =>{
        setResetData({...resetData,[e.target.name] : e.target.value})
    }


    const handleSubmit = async (e) =>{
        e.preventDefault()

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
    for (let char of resetData.password) {
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


        try{
            const response = await fetch(`${import.meta.env.VITE_APP_URL}/vendor/resetPassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resetData),
              });
    
             if(response.ok){
                const data = await response.json()
                
                if(data == 'success'){
                    if(otpState == true){
                        setCheck(false)
                        navigate("/login")
                        setCheckAuthenEmailReset(false)
                    }

                   else if(otpState == null || otpState == false){
                           setCheckAuthenEmailReset(false)
                   }





                }else if(data == 'failure'){
                    setCheck(true)
                    setResetData({
                        email : "",
                        password : "",
                        confirmPassword : ""
                    })

                }
               
            }
    
        }
        catch(err){
            console.log("Some error occured at resetPassword.jsx",err)
        }finally{
            setLoading(false)
        }
    }


    return (
        <>
        <section className="bg-gray-50 dark:bg-white-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
     
      <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-white-800 dark:border-gray-700 sm:p-8">
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
              Change Password
          </h2>
          <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit}>
              <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" onChange={handleChange} value={resetData.email} required/>
              </div>
              <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">New Password</label>
                  <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} value={resetData.password} required/>
                  {passwordError && <p className='text-red-700'>Password must contain lowercase,uppercase,special char and numbers</p>}
              </div>
              <div>
                  <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Confirm password</label>
                  <input type="password" name="confirmPassword" id="confirmPassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} value={resetData.confirmPassword} required/>
              </div>
         {check && <p className='text-red-700'>Invalid Credentials! Try Again</p>}


         {checkAuthenEmailReset && <p className='text-red-700'>UNAUTHORIZED! Kindly validate OTP first </p>}
      
              <button type="submit" className="w-full text-white bg-primary-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-black">{loading? "Resetting" : "Reset Password"}</button>
          </form>
      </div>
  </div>
</section>
        </>
    )
}

export default VendorResetPassword