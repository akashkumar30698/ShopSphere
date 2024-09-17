import { Link,useNavigate } from "react-router-dom"
import React,{useEffect, useState} from "react"
import "../../App.css"
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie"
import { useLogin } from "../../ContextApi/loginContext.jsx"
import { useAuthContext } from "../../ContextApi/authProvider.jsx";
import { useSearchParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";

function Login() {

  const navigate = useNavigate()
  const [checkExists,setCheckExists] = useState(false)
  const [invalidCredentials,setInvalidCredentials] = useState(false)
  const [checkIsHashed,setIsHashed] = useState(false)
  const [wrongPassword,setWrongPassword] = useState(false)

   const { isLoggedIn,setIsLoggedIn } = useLogin()
   const [searchParams] = useSearchParams();
   const isHashed = searchParams.get('hashed');
   const location = useLocation()
 

     const {isGoogleAuth,formData, setRefreshToken,setCheckCookie,setGoogleFormData,setFormData ,setIsGoogleAuth} = useAuthContext()
     
     const handleGoogleClick = () => {

     }

     const handleSuccess = async (res) => {
        const userDetails = jwtDecode(res.credential)
        const {given_name, email ,picture} = userDetails

         setGoogleFormData({
            googleAuthName:given_name,
            googleAuthEmail: email
         })

        try{        
            const res = await fetch(`${import.meta.env.VITE_APP_URL}/login`, {
                method: 'POST',
                credentials:'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    given_name: given_name,
                    googleEmail: email,
                    picture: picture,
                    isGoogleAuth: isGoogleAuth,
                    isHashedGoogle: checkIsHashed || false
                }),
              });
  
           if(res.ok){
            const data = await res.json()

            if(data.message == 'success'){

                   if(isHashed){
                    navigate(`/${data.params}?hashed=${isHashed}`)
                    console.log("hashed executed")
                   }
                   else{
                    navigate(`/${data.params}`)
                   }

                const cookie = Cookies.get("accessToken",data.accessToken)

                setRefreshToken(data.refreshToken)
                setCheckCookie(cookie)
                setIsLoggedIn(true)
                setCheckExists(false)
                setInvalidCredentials(false)

            }
          
           }else if(res.status === 401){
            setCheckExists(true)
            setIsLoggedIn(false)
            setInvalidCredentials(false)
           }
           else if(res.status === 403){
            setIsLoggedIn(false)
            setCheckExists(false)
            setInvalidCredentials(true)
           }

        }catch(err){
            console.log("Error at login.jsx",err)
        }finally{
            setIsHashed(false)
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
                    credentials:'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        formData: formData,
                        isHashedRegular: checkIsHashed || false
                    }),
                  });  
                  
                    if(res.ok){
                        const data = await res.json()

                        if(data.message == 'success'){

                            setWrongPassword(false)

                             if(isHashed){
                              navigate(`/${data.params}?hashed=${isHashed}`)
                             }else{
                                navigate(`/${data.params}`)
                             }

                               const cookie = Cookies.get("accessToken",data.accessToken)
                        

                               setRefreshToken(data.refreshToken)
                               setIsLoggedIn(true)
                               setCheckCookie(cookie)
                   
                        }
                        else{
                            setIsLoggedIn(false)
                        }
                    }
                    else if(res.status === 403 || res.status === 401){
                        setWrongPassword(true)
                    }

            }
            catch(err){
                console.log("Error logging in",err)
            }finally{
             setIsGoogleAuth(true)
            }
     }


     useEffect(()=>{
           if(isHashed){
            setIsHashed(true)
           }
     },[])





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
                                {wrongPassword && <p className="text-red-700">Invalid Email or Password</p>}

                                 {invalidCredentials && <p className="text-red-700">User Already Exists</p>}
                                 {checkExists && <p className="text-red-700">User Already Exists</p>}


                                 <GoogleLogin
                                    onSuccess={handleSuccess}
                                    onError={handleError}
                                    onClick={handleGoogleClick}
                                />


                           
                                <button type="submit" className="w-full black text-white bg-black-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet? <Link to={isHashed ? `/signUP?hashed=${isHashed}` : `/signUP`} className="font-medium text-black-600 text hover:underline dark:text-black-500">Sign UP</Link>
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