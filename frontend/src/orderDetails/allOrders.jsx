import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css"
import { useNavigate } from "react-router-dom";


function AllOrders() {

    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(false)
    const navigate = useNavigate()

    const { userId } = useParams()
    const [orderType, setOrderType] = useState("All orders");

    const handleChange = (e) => {
      setOrderType(e.target.value);
    };


    const fetchOrders = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_URL}/:userId/yourOrders?userId=${userId}`,
                {
                    method: 'GET'
                }
            );

            if (response.ok) {
                const data = await response.json();
                setOrders(data)
                setError(false)
            }
            else if (response.status == 404) {
                setError(true)
            }

        } catch (error) {
            console.error("Failed to fetch order data:", error);
        }
    };

    const handleGoToHomePage = () => {
        navigate(`/${userId}`)
    }

    // Fetch the orders data from backend
    useEffect(() => {
        fetchOrders();
    }, []);

    // Show a loading state while data is being fetched
    if (error) {
        return (
            <>
                <div className="flexy">
                    <div>No Orders Found</div>
                    <button onClick={handleGoToHomePage} className=" px-6 py-3 text-white bg-red-700 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                        Go Back To HomePage
                    </button>
                </div>

            </>
        )
    }
    else if (!orders.length) {
        return <div>Loading order details...</div>;
    }


    return (
        <>
                <div className="bg-black min-h-screen">
                <section className="bg-black py-8 antialiased  md:py-16">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <div className="mx-auto max-w-5xl">
                        <div className="gap-4 sm:flex sm:items-center sm:justify-between">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">My orders</h2>

                            <div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
                                <div>
                                    <label htmlFor="order-type" className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white">Select order type</label>
                                    <select
                                        id="order-type"
                                        className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                        value={orderType}  // Make this a controlled component
                                        onChange={handleChange} // Handle selection change
                                    >
                                        <option value="All orders">All orders</option>
                                        <option value="pre-order">Pre-order</option>
                                        <option value="transit">In transit</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <span className="inline-block text-gray-500 dark:text-gray-400"> from </span>

                                <div>
                                    <label htmlFor="duration" className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white">Select duration</label>
                                    <select id="duration" onChange={handleChange} value={orderType} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500">
                                        <option value="this week">this week</option>
                                        <option value="this month">this month</option>
                                        <option value="last 3 months">the last 3 months</option>
                                        <option value="lats 6 months">the last 6 months</option>
                                        <option value="this year">this year</option>
                                    </select>
                                </div>
                            </div>
                        </div>


                        {/* DYNAMIC Components */}

                        <div>
                            {orders.map((order, index) => (
                                <div key={index} className="flex flex-wrap items-center gap-y-4 py-6">
                                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Order ID:</dt>
                                        <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                            <a href="#" className="hover:underline">{order.userOrderId}</a>
                                        </dd>
                                    </dl>

                                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Date:</dt>
                                        <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">  {new Date(order.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </dd>
                                    </dl>

                                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Price:</dt>
                                        <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white"> ₹{order.productTotalAmount}</dd>
                                    </dl>

                                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Status:</dt>
                                        <dd className={`me-2 mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${order.status === 'Confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                            'bg-yellow-100 text-yellow-800 dark:bg-green-900 dark:text-yellow-300'
                                            }`}>
                                            <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" />
                                            </svg>                                            
                                            Confirmed
                                        </dd>
                                    </dl>

                                    <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                                        <button type="button" className="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 lg:w-auto">Cancel order</button>

                                        <a href="#" className="w-full inline-flex justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto">
                                            View details
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>




                    </div>
                </div>
            </section>
                    </div>

       
        </>
    )
}


export default AllOrders


/*
*/



