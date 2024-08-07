import './navbar.css'
import { useNavigate } from "react-router-dom";
import { useState } from 'react'


function ForgetPassword() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [check,setCheck] = useState(false)
    const [email, setEmail] = useState({
        email: ""
    })


    const handleChange = (e) => {
        setEmail({ ...email, [e.target.name]: e.target.value });
    }




    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch(`${import.meta.env.VITE_APP_URL}/forgetPassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(email),
            });

            if (response.ok) {
                const data = await response.json()

       
              
                
                    if(data == 'success'){
                        setCheck(false)
                        setEmail({
                            email : ""
                       })
                                        
                      navigate("/validateOTP")
            

                    }
                    else if(data == 'Invalid'){
                        setCheck(true)
                    }

             
            }

        } catch (err) {
            console.log("Error posting data to the backend at forgetPassword.jsx : 12", err)
        } finally {
            setLoading(false)
        }


    }




    return (
        <>
            <section className="bg-white-50 dark:bg-white-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

                    <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-white-800 dark:border-gray-700 sm:p-8">

                        <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-black-900 md:text-2xl dark:text-black">
                            Forget Password
                        </h2>

                        <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" method='POST' onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">Your email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" onChange={handleChange} required />
                            </div>

{check && <p className='text-red-700'>Please Enter a valid Email</p>}

                            <button type="submit" className="flex w-full justify-center rounded-md bg-black text-white px-3 py-1.5 text-sm font-semibold leading-6  shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">{loading ? "Sending..." : "Send OTP"}</button>

                        </form>
                    </div>
                </div>
            </section>
        </>

    )
}


export default ForgetPassword