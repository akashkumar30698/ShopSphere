import "../index.css";
import React, { useEffect } from "react";
import { Link,useNavigate, useParams } from "react-router-dom";
import { useLogin } from "../ContextApi/loginContext.jsx"
import Cookies from "js-cookie"


function VendorNavbar() {

    const { isLoggedIn, setIsLoggedIn } = useLogin()
    const navigate = useNavigate()
    const id= useParams()
    const userId = id.userId 


     const handleLogoutClick = () => {
        setIsLoggedIn(false);
     
        Cookies.remove("accessToken", { path: "/" });
        navigate("/")
    
     }


     useEffect(()=>{
           const getCookie = Cookies.get("accessToken")
           if(getCookie || getCookie != null){
                  setIsLoggedIn(true)
           }

           else if(!getCookie || getCookie == null){

            navigate("/")

           }

       
            
            
     },[isLoggedIn])



    return (
        <nav className="bg-white dark:bg-gray-800 antialiased">
            <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">

                        <ul className="hidden lg:flex items-center justify-start gap-6 md:gap-8 py-3 sm:justify-center">
                            <li>
                                 <Link
                                    to="#"
                                    title=""
                                    className="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                                 >
                                    Home
                                 </Link>
                            </li>
                            <li className="shrink-0">
                                <Link
                                    to={userId? `/${userId}/vendor/Your-Products` : `/vendor/Your-Products`}
                                    title=""
                                    className="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                                >
                                    Your Products
                                </Link>
                            </li>


                            <li className="shrink-0">
                                <Link
                                    to={userId ? `/${userId}/vendor/sell` : `/vendor/sell`}
                                    title=""
                                    className="text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                                >
                                    Sell
                                </Link>
                            </li>

                            <li className="shrink-0">
                                <Link
                                    to={userId? `/${userId}/vendor/approvals` : `/vendor/approvals`}
                                    title=""
                                    className="text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                                >
                                    Approvals
                                </Link>
                            </li>





                        </ul>
                    </div>
                    {isLoggedIn ? (
                        <>
                            <div className="flex items-center lg:space-x-2">

                                 <button id="myCartDropdownButton1" onClick={handleLogoutClick} data-dropdown-toggle="myCartDropdown1" type="button" className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white">

                                    <span className="hidden sm:flex">Logout</span>

                                 </button>

                            </div>
                         </>
                         ) : (
                         <>
                            <div className="flex items-center lg:space-x-2">

                                <button id="myCartDropdownButton1" data-dropdown-toggle="myCartDropdown1" type="button" className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white">
                                    <span className="hidden sm:flex"><Link to="/admin-login">Admin</Link></span>
                                </button>


                                <button id="myCartDropdownButton1" data-dropdown-toggle="myCartDropdown1" type="button" className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white">
                                    <span className="hidden sm:flex"><Link to="/vendor/login">Vendor</Link></span>
                                </button>


                                <button id="myCartDropdownButton1" data-dropdown-toggle="myCartDropdown1" type="button" className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white">
                                    <span className="hidden sm:flex"><Link to="/login">Login</Link></span>
                                </button>

                            </div>
                        </>
                    )}


                </div>
            </div>
        </nav>
    );
}

export default VendorNavbar;
