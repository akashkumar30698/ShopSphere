import { useParams, useNavigate } from "react-router-dom"
import { useLogin } from "../ContextApi/loginContext"
import Cookies from "js-cookie"
import { Link } from "react-router-dom"
import "../App.css"
import { useState } from "react"

function YourOrdersDetails() {

    const { userId } = useParams()
    const navigate = useNavigate()
    const { isLoggedIn, setIsLoggedIn, isOpen, setIsOpen } = useLogin()

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleHomeClick = () => {
        navigate(`/${userId}`)
    }

    const handleLogoutClick = () => {
        setIsLoggedIn(false);

        Cookies.remove("accessToken", { path: "/" });

        localStorage.removeItem("cart")

        navigate("/")
    }


    return (
        <>
            <div className={`fixed top-0 left-0 h-full transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} bg-gray-800 text-white w-64 z-50`}>
                <div className="p-4 flex justify-between items-center w-full">

                    <img style={{
                        display: "block", WebkitUserSelect: "none",
                        cursor: "zoom-in",
                        backgroundColor: "rgb(111 97 97 / 0%)", transition: "background-color 300ms"
                    }} src="https://evershop.io/img/logo.png" width="37px" height="42px" />

                    <button onClick={toggleSidebar} className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#FFFFFF" height="20px" width="20px" version="1.1" id="Capa_1" viewBox="0 0 490 490" xmlSpace="preserve">
                            <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490   489.292,457.678 277.331,245.004 489.292,32.337 " />
                        </svg>

                    </button>
                </div>
                <nav className="flex flex-col p-4 bg-gray-800 text-white min-h-screen w-64">
                    <Link to={userId ? `/${userId}` : `/`} className="py-2 px-4 hover:bg-gray-700 rounded">Home</Link>

                    {isLoggedIn ? (
                        <>
                            <button onClick={handleLogoutClick} className="py-2 px-4 hover:bg-gray-700 rounded mb-2 w-full text-left"
                            >
                                Log Out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="py-2 px-4 hover:bg-gray-700 rounded">Login</Link>
                            <Link to="/admin" className="py-2 px-4 hover:bg-gray-700 rounded">Admin</Link>
                            <Link to="/vendor/login" className="py-2 px-4 hover:bg-gray-700 rounded">Vendor Login</Link>

                        </>
                    )

                    }
                </nav>
            </div>


        </>
    )
}


export default YourOrdersDetails


/*


<div className="py-16 text-center">
<button type="button" className="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-gray-800 border border-gray-800 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-950 focus:outline-none focus:bg-gray-900 dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-200 dark:focus:bg-neutral-200" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-offcanvas-example" aria-label="Toggle navigation" data-hs-overlay="#hs-offcanvas-example">
    Open
</button>
</div>



<div id="hs-offcanvas-example" className="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform  fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto  [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-800 dark:border-neutral-700 showSideBar" role="dialog" tabIndex="-1" aria-label="Sidebar">
<div className="px-6">
    <a className="flex-none font-semibold text-xl text-black focus:outline-none focus:opacity-80 dark:text-white" href="#" aria-label="Brand">
        <svg height="60px" width="60px" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 120 36">
            <defs>
                <style>
                    {`.cls-1{fill:#FFFFFF;}`}
                </style>
            </defs>
            <path className="cls-1" d="M27.42,23.39l.28,1.28-3,6.26H18L30.83,5.07,43.65,30.93H37l-2.92-6,.21-1.49-3.44-7.89Zm-2.53-1.64h12l.39,4.48H24.47Z" />
            <path className="cls-1" d="M55.52,19a2,2,0,0,0-1.79-.77,3,3,0,0,0-1.46.35,2.37,2.37,0,0,0-1,1A3.29,3.29,0,0,0,51,21.2v9.73H45.67v-16H51v2.4a5.13,5.13,0,0,1,1.89-2.05,5.59,5.59,0,0,1,3-.73,5.39,5.39,0,0,1,4.35,1.6,6.73,6.73,0,0,1,1.35,4.48V30.93H56.06V21.2A3.77,3.77,0,0,0,55.52,19Z" />
            <path className="cls-1" d="M65.89,18.17a8.06,8.06,0,0,1,3.27-2.92,11,11,0,0,1,9.36,0,8.19,8.19,0,0,1,3.27,2.92A8,8,0,0,1,83,22.59,7.94,7.94,0,0,1,81.79,27a8,8,0,0,1-3.27,2.92,11,11,0,0,1-9.36,0A7.92,7.92,0,0,1,65.89,27a8,8,0,0,1-1.18-4.37A8.11,8.11,0,0,1,65.89,18.17Zm4.73,6.55A3.8,3.8,0,0,0,72,26.1a3.88,3.88,0,0,0,3.74,0,3.65,3.65,0,0,0,1.35-1.38,4.2,4.2,0,0,0,.51-2.13,4.31,4.31,0,0,0-.51-2.16A3.61,3.61,0,0,0,75.71,19a3.68,3.68,0,0,0-5.09,1.39,4.22,4.22,0,0,0-.53,2.16A4.1,4.1,0,0,0,70.62,24.72Z" />
            <path className="cls-1" d="M96,19a2,2,0,0,0-1.79-.77,3,3,0,0,0-1.46.35,2.43,2.43,0,0,0-1,1,3.41,3.41,0,0,0-.35,1.6v9.73H86.11v-16h5.28v2.4a5.23,5.23,0,0,1,1.9-2.05,5.59,5.59,0,0,1,3-.73,5.37,5.37,0,0,1,4.34,1.6A6.68,6.68,0,0,1,102,20.64V30.93H96.5V21.2A3.77,3.77,0,0,0,96,19Z" />
        </svg>

    </a>
</div>
<nav className="hs-accordion-group p-6 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
    <ul className="space-y-1.5">
        <li className="hs-accordion" id="home-accordion">
            <button onClick={handleHomeClick} type="button" className="hs-accordion-toggle hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hs-accordion-active:text-white dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" aria-expanded="true" aria-controls="users-accordion">
                Home
            </button>
        </li>

        {
            isLoggedIn ? (
                <>
                    <li className="hs-accordion" id="users-accordion">
                        <button onClick={handleLogoutClick} type="button" className="hs-accordion-toggle hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hs-accordion-active:text-white dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" aria-expanded="true" aria-controls="users-accordion">
                            Log Out
                        </button>
                    </li>
                </>
            ) : (
                <>
                 <li className="hs-accordion" id="users-accordion">
                        <Link to="/login" className="hs-accordion-toggle hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hs-accordion-active:text-white dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300">
                            Login
                        </Link>
                    </li>

                    <li className="hs-accordion" id="users-accordion">
                        <Link to="/admin-login"  className="hs-accordion-toggle hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hs-accordion-active:text-white dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300">
                         Admin
                        </Link>
                    </li>

                    <li className="hs-accordion" id="users-accordion">
                        <Link to="/vendor/login" className="hs-accordion-toggle hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hs-accordion-active:text-white dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" >
                            Vendor Login
                        </Link>
                    </li>


                </>
            )
        }



    </ul>
</nav>
</div>


*/