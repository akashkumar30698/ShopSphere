import { Link,useNavigate } from "react-router-dom"
import React,{useState} from "react"
import "../../App.css"
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";



function Login() {
   const [formData,setFormData] = useState({
    email: "",
    password: "",
   })
  const [isGoogleAuth,setIsGoogleAuth] = useState(true)
  const navigate = useNavigate()





    const handleSuccess = async (res) => {
     
        const userDetails = jwtDecode(res.credential)
        const {given_name, email ,picture} = userDetails


        try{
             

            const res = await fetch(`${import.meta.env.VITE_APP_URL}/signUP`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    given_name: given_name,
                    googleEmail: email,
                    picture: picture,
                    isGoogleAuth: isGoogleAuth
                }),
              });

        
           if(res.ok){

            const data = await res.json()

            if(data == 'success'){
                navigate("/")
            }
           }



        }catch(err){
            console.log("Error at login.jsx",err)
        }finally{
            setIsGoogleAuth(false)
        }
      };
    

      const handleError = (err) => {
       console.log("Error logging in:",err)
      }

     const handleChange = (e) => {
           setFormData({...formData,[e.target.name]: e.target.value })
     }









     const handleSubmit =  async (e) =>{
            e.preventDefault()

        setIsGoogleAuth(false)


  
            try{
                const res = await fetch(`${import.meta.env.VITE_APP_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                  });  
                  
                    if(res.ok){
                        const data = await res.json()
                        if(data == 'success'){
                               navigate("/")
                        }
                    }



            }
            catch(err){
                console.log("Error logging in",err)
            }
     }


    








    return (
        <>
            <section className="">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-white-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
                                Login in to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="/login" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">Your email</label>
                                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="bg-white-50 border border-gray-300 text-black-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">Password</label>
                                    <input type="password" name="password"  id="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="bg-white-50 text border border-gray-300 text-black-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                </div>


                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="remember" className="text-black-500 dark:text-black-300">Remember me</label>
                                        </div>
                                    </div>
                                    <Link to="/ForgetPassword" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</Link>
                                </div>


                                <GoogleLogin
                                    onSuccess={handleSuccess}
                                    onError={handleError}
                                />




                                <button type="submit" className="w-full black text-white bg-black-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet? <Link to="/signUP" className="font-medium text-black-600 text hover:underline dark:text-black-500">Sign UP</Link>
                                </p>

                            </form>
                        </div>
                    </div>
                </div>
            </section>


        </>
    )
}

export default Login