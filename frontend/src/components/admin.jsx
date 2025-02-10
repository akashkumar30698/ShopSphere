import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLogin } from "../ContextApi/loginContext";
import Cookies from "js-cookie";
import { checkCookie } from "../utils/checkCookie";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

function Admin() {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useLogin();

    const navigation = [
        { name: 'Requests', to: `/${import.meta.env.VITE_ADMIN_ID}/admin/vendorRequests`, current: true },
    ];

    const handleLogoutClick = () => {
        console.log("Logout clicked");
        Cookies.remove("accessToken", { path: "/" });
        setIsLoggedIn(false); // Ensure this updates the context properly
        navigate("/");
    };

    useEffect(() => {
        const checkExist = async () =>{
            const getCookie = await checkCookie("accessToken")
            if (!getCookie) {
                navigate("/");
                return
            }
    
            setIsLoggedIn(true)
        }
         checkExist()      

    }, [navigate]);

    return (
        <>
            <Disclosure as="nav" className="bg-gray-800">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                            </DisclosureButton>
                        </div>

                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex flex-shrink-0 items-center">
                                <img style={{
                                    display: "block", WebkitUserSelect: "none", margin: "auto",
                                    cursor: "zoom-in",
                                    backgroundColor: "rgb(111 97 97 / 0%)", transition: "background-color 300ms"
                                }} src="https://evershop.io/img/logo.png" width="30px" height="30px" />
                            </div>
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.to}
                                            aria-current={item.current ? 'page' : undefined}
                                            className={classNames(
                                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'rounded-md px-3 py-2 text-sm font-medium'
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <Menu as="div" className="relative ml-3">
                                <div>
                                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                        <span className="sr-only">Open user menu</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user text-white">
                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </MenuButton>
                                </div>

                                {isLoggedIn ? (
                                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                        <MenuItem>
                                            <button
                                                onClick={handleLogoutClick}
                                                className="block px-4 py-2 text-sm text-gray-700"
                                            >
                                                Log out
                                            </button>
                                        </MenuItem>
                                    </MenuItems>
                                ) : (
                                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                        <MenuItem>
                                            <span className="block px-4 py-2 text-sm text-gray-700">
                                                Please log in
                                            </span>
                                        </MenuItem>
                                    </MenuItems>
                                )}
                            </Menu>
                        </div>
                    </div>
                </div>

                <DisclosurePanel className="sm:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        {navigation.map((item) => (
                            <DisclosureButton
                                key={item.name}
                                as={Link}
                                to={item.to}
                                aria-current={item.current ? 'page' : undefined}
                                className={classNames(
                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                    'block rounded-md px-3 py-2 text-base font-medium'
                                )}
                            >
                                {item.name}
                            </DisclosureButton>
                        ))}
                    </div>
                </DisclosurePanel>
            </Disclosure>
        </>
    );
}

export default Admin;
