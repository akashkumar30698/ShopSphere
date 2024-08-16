import { useNavigate } from "react-router-dom"
import React,{useState} from "react"
import "../../App.css"
import { useAuthContext } from "../../ContextApi/authProvider"
import Cookies from "js-cookie"



function AdminLogin() {

  const {setAdminFormData,adminFormData,setAdminRefreshToken} = useAuthContext()
  const [checkValidAuth,setCheckValidAuth] = useState(false)
  const [loading,setLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleChange = (e)=>{
       setAdminFormData({...adminFormData,[e.target.name]: e.target.value})
  }





         const handleSubmit =  async (e) =>{
            e.preventDefault()

                setLoading(true)

            try{
                const res = await fetch(`${import.meta.env.VITE_APP_URL}/admin-login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(adminFormData),
                  });  
                  
                    if(res.ok){
                        const data = await res.json()
                        if(data.message == 'success'){
                               
                               navigate(`/${import.meta.env.VITE_ADMIN_ID}/admin`)
                               
                               setCheckValidAuth(false)
                               setLoading(false)
                               setAdminRefreshToken(data.refreshToken)
                               Cookies.set("accessToken",data.accessToken)
                        }
                        else if(data == 'failure'){
                
                               setCheckValidAuth(true)
                               setLoading(false)
                        }
                    }

            }
            catch(err){
                console.log("Error logging in",err)
            }finally{
                setLoading(false)
            }
     }




    return (
        <>
            <section className="">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-white-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
                                Admin Login
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="/admin-login" onSubmit={handleSubmit}>

                            <div>
                                    <label htmlFor="secretCode" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">Enter Secret Code</label>
                                    <input type="password" name="secretCode"  value={adminFormData.secretCode} onChange={handleChange} className="bg-white-50 border border-gray-300 text-black-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                </div>




                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">Your email</label>
                                    <input type="email" name="email" id="email" value={adminFormData.email} onChange={handleChange} className="bg-white-50 border border-gray-300 text-black-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                                </div>





                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">Password</label>
                                    <input type="password" name="password"  id="password" value={adminFormData.password} onChange={handleChange} placeholder="••••••••" className="bg-white-50 text border border-gray-300 text-black-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                </div>

                               
                                {checkValidAuth && <p className="text-red-700">Invalid credientials! Please Check Before Trying Again </p>}


                                <button type="submit" className="w-full black text-white bg-black-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{loading? "Logging In" : "Admin Login"}</button>
    
                            </form>
                        </div>
                    </div>
                </div>
            </section>


        </>
    )
}

export default AdminLogin