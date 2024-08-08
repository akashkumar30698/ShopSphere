import "../index.css";
import React from "react";
import { Link } from "react-router-dom";




function Navbar() {
    return (
        <nav className="bg-white dark:bg-gray-800 antialiased">
            <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <div className="shrink-0">
                            <Link to="#" title="" className="">
                                <img
                                    className="block w-auto h-8 dark:hidden"
                                    src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/logo-full.svg"
                                    alt="Logo"
                                />
                                <img
                                    className="hidden w-auto h-8 dark:block"
                                    src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/logo-full-dark.svg"
                                    alt="Logo Dark"
                                />
                            </Link>
                        </div>

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
                                    to="/vendor"
                                    title=""
                                    className="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                                >
                                    Best Sellers
                                </Link>
                            </li>


                            <li className="shrink-0">
                                <Link
                                    to="#"
                                    title=""
                                    className="text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                                >
                                    Sell
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="flex items-center lg:space-x-2">


                        <button id="myCartDropdownButton1" data-dropdown-toggle="myCartDropdown1" type="button" className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white">

                            <span className="hidden sm:flex"><Link to="/vendor">Vendor</Link></span>

                        </button>


                        <button id="myCartDropdownButton1" data-dropdown-toggle="myCartDropdown1" type="button" className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white">

                            <span className="hidden sm:flex"><Link to="/login">Login</Link></span>

                        </button>

                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
