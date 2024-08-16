import React ,{useEffect,useState} from "react";
import { Link ,useNavigate } from "react-router-dom";
import Cookies from "js-cookie"
import VendorRequests from "../pages/admin/vendorRequests";

function Admin(){
    
     
     const navigate = useNavigate()


     const handleLogoutClick = () => {
        Cookies.remove("accessToken", { path: "/" });
        navigate("/")
        
     }


    useEffect(()=>{
        const getCookie = Cookies.get("accessToken")
    
         if(!getCookie || getCookie == null){
         navigate("/")
        }
         
  },[navigate])





    return (
        <>
        
          <nav className="bg-white dark:bg-gray-800 antialiased">
            <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">

                         <ul className="hidden lg:flex items-center justify-start gap-6 md:gap-8 py-3 sm:justify-center">
                            <li>
                                <Link
                                    to="#"
                                    title="Home"
                                    className="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                                >
                                    Home
                                </Link>
                             </li>
                             <li className="shrink-0">
                                <Link
                                    to={`/${import.meta.env.VITE_ADMIN_ID}/admin/sellers`}
                                    title="Sellers"
                                    className="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                                >
                                  Sellers
                                </Link>
                            </li>


                            <li className="shrink-0">
                                <Link
                                    to={`${import.meta.env.VITE_ADMIN_ID}/admin/products`}
                                    title="Products"
                                    className="text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                                >
                                    Products
                                </Link>
                            </li>
                            <li className="shrink-0">
                                <Link
                                    to={`/${import.meta.env.VITE_ADMIN_ID}/admin/vendorRequests`}
                                    title="Requests"
                                    className="text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                                >
                                    Requests
                                </Link>
                            </li>


                        </ul>
                    </div>

                    <div className="flex items-center lg:space-x-2">




                        <button id="myCartDropdownButton1" data-dropdown-toggle="myCartDropdown1" type="button" onClick={handleLogoutClick} className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white">

                            <span className="hidden sm:flex"><Link to="/">Logout</Link></span>

                        </button>

                    </div>
                </div>
            </div>
        </nav>


        </>
    )
}


export default Admin