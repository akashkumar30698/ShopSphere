import React, { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { sha256 } from 'crypto-hash';
import Cookies from "js-cookie";
import '../../App.css';
import Options from "./options";
import { useLogin } from "../../ContextApi/loginContext";
import ShareButtons from "./shareButtons";
import Loading from "./loading";



// Export the handleBuyProduct function
export const handleBuyProduct = async (userId, totalAmount, allProductId, isHashed, navigate, addressDetails) => {
    try {

        console.log(userId, totalAmount, allProductId, isHashed, navigate, addressDetails)

        const res = await fetch(`${import.meta.env.VITE_APP_URL}/:userId/checkout?userId=${userId}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId: allProductId,
                productPrice: totalAmount,
                isHashed: isHashed,
                addressDetailsToDB: addressDetails
            }),
        });

        if (res.ok) {
            const data = await res.json();

            if (data.message == 'not-found') {
                console.log(data)
                //  navigate(`/${data.otherFriendId}/hashedError`)
                return
            }

            const options = {
                key: import.meta.env.RAZORPAY_KEY_ID,
                amount: totalAmount,
                currency: "INR",
                name: "Acme Corp",
                description: "Test Transaction",
                image: "https://res.cloudinary.com/dphrayb6o/image/upload/v1724321840/q7sqftusa12xbwxuynkh.png",
                order_id: data.id,
                callback_url: `${import.meta.env.VITE_APP_URL}/:userId/paymentVerification`,
                notes: {
                    address: "Razorpay Corporate Office",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const razor = new Razorpay(options);
            razor.open();
        }
    } catch (error) {
        console.log("Some error occurred", error);
    }
};

let storeAllProductId = []
let storeHash = ""

export function passStoreHashValue() {
    return storeHash
}

export function passAskFriendFalse() {
    return askFriendFalse
}


let askFriendFalse = false


// Main OrderAddress component
function OrderAddress() {
    const location = useLocation();
    // const [storeHashed, setStoreHashed] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [storeHashed, setStoreHashed] = useState("")
    const [showError, setShowError] = useState(false)
    const { showOptions, setShowOptions, setAddressDetails } = useLogin()

    const id = useParams();
    const friendHashed = searchParams.get('hashed'); //query parameters
    const userId = id.userId;
    const totalAmount = location.state?.totalAmount || 0;
    const allProductId = location.state?.cartData || [];


    //Address Details


    const { reRenderOnCrossClick, setReRenderOnCrossClick, checkTrue, loading, setLoading, setCheckTrue, isAskFriendClick, setIsAskFriendClicked } = useLogin()

    const handlePayment = (e) => {
        e.preventDefault();
    };

    const getHashed = async () => {
        try {
            const randomString = `🦄_${Math.random()}`;
            const hashed = await sha256(randomString);
            setStoreHashed(hashed)

        } catch (err) {
            console.log("Some error occurred", err);
        }
    };


    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (!token) {
            //  navigate(`/orderInitiatedByOther?hashed=${storeHashed}`,{state: {userId: userId,totalAmount: totalAmount,allProductId:allProductId}});
        }
    }, []);


    const style = {
        root: {
            background: 'linear-gradient(45deg, rgb(166 37 65) 30%, rgb(255, 142, 83) 90%)',
            borderRadius: 3,
            border: 0,
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            color: 'white',
        },
        copyContainer: {
            border: '1px solid blue',
            background: 'rgb(0,0,0,0.7)',
            display: 'none',
        },
        title: {
            color: 'aquamarine',
            fontStyle: 'italic',
        },
    };


    const passValues = async (userId, totalAmount, allProductId, storeHashed) => {
        try {

            storeAllProductId = allProductId

            const res = await fetch(`${import.meta.env.VITE_APP_URL}/:userId/passValues`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    totalAmount: totalAmount,
                    allProductId: allProductId,
                    storeHashed: storeHashed,
                }),
            });

        }
        catch (err) {
            console.log("Some error occured", err)
        }
    }


    useEffect(() => {
        if (storeHashed) {
            //  storeHash = storeHashed
            //  console.log(storeHashed) 
            // passStoreHashValue()         
            passValues(userId, totalAmount, allProductId, storeHashed);
        }
    }, [storeHashed]);


    useEffect(() => {
        getHashed()
    }, [reRenderOnCrossClick])


    const handleContinuePaymentButton = (e) => {

        e.preventDefault()

        const checkCartData = JSON.parse(localStorage.getItem("cart")) || [];

        // Use FormData to extract form values
        const formData = new FormData(e.target);

        // Extract form data values
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const emailAddress = formData.get('emailAddress');
        const houseNo = formData.get('houseNo');
        const streetNo = formData.get('streetNo');
        const city = formData.get('city');
        const state = formData.get('state');
        const postalCode = formData.get('postalCode');


        setAddressDetails({
            firstName: firstName,
            lastName: lastName,
            emailAddress: emailAddress,
            houseNo: houseNo,
            streetNo: streetNo,
            city: city,
            state: state,
            postalCode: postalCode
        })


        if (checkCartData.length == 0) {
            setShowError(true)
        } else {
            setShowError(false)
            setShowOptions(!showOptions)

        }

    }


    const handleCrossClick = () => {
        setIsAskFriendClicked(false)

        setCheckTrue(false)

        //Generate a new Hash on every Cross click
        setReRenderOnCrossClick(!reRenderOnCrossClick)
    }


    //Clear the share social page on click
    useEffect(() => {
        if (checkTrue) {
            setIsAskFriendClicked(false)
            setLoading(true)
        }
    }, [checkTrue])


    const handleCancelButton = ()  => {

        if(userId){
            navigate(`/${userId}`)
        }
    }




    return (
        <>
            <form onSubmit={handleContinuePaymentButton}>
                <div className="space-y-12  flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="border-b  sm:max-w-md border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    First name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="first-name"
                                        name="firstName"
                                        type="text"
                                        autoComplete="given-name"

                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Last name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="last-name"
                                        name="lastName"
                                        type="text"
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="emailAddress"
                                        type="email"
                                        autoComplete="email"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="house/flat" className="block text-sm font-medium leading-6 text-gray-900">
                                    House No.
                                </label>
                                <div className="mt-2">

                                    <input

                                        name="houseNo"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                                    Street address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="street-address"
                                        name="streetNo"
                                        type="text"
                                        autoComplete="street-address"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2 sm:col-start-1">
                                <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                    City
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        autoComplete="address-level2"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                                    State
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="region"
                                        name="state"
                                        type="text"
                                        autoComplete="address-level1"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                                    ZIP / Postal code
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="postal-code"
                                        name="postalCode"
                                        type="text"
                                        autoComplete="postal-code"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {showError && <p className="text-red-700">No Cart Items find!Please Try Again</p>}


                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button onClick={handleCancelButton} type="button" className="text-sm font-semibold leading-6 text-gray-900">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Continue To Payment
                        </button>


                        {showOptions && <Options showOptions={showOptions} totalAmount={totalAmount} allProductId={allProductId} storeAllProductId={storeAllProductId} setShowOptions={setShowOptions} handlePayment={handlePayment} />}



                        {
                            isAskFriendClick && (<div id="modelConfirm" className="fixed inset-0 z-50 bg-gray-900 bg-opacity-60 flex justify-center items-center">
                                <div className="relative bg-c  rounded-lg shadow-lg p-6 w-full max-w-md">
                                    <div className="flex flex-col color items-center space-y-4">

                                        <div className="makeStyles-container-1"  >
                                            <button
                                                onClick={handleCrossClick}
                                                className="absolute css text-gray-500 hover:text-gray-700">
                                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000" height="10px" width="10px" version="1.1" id="Capa_1" viewBox="0 0 490 490" xmlSpace="preserve">
                                                    <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490   489.292,457.678 277.331,245.004 489.292,32.337 " />
                                                </svg>
                                            </button>
                                            <div className="makeStyles-iconContainer-3">
                                                <ShareButtons
                                                    url={`${import.meta.env.VITE_FRONTEND_URL}/${userId}/orderInitiatedByOther?hashed=${storeHashed}`}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            )}


                        {
                            loading && <Loading />
                        }



                    </div>
                </div>
            </form>
        </>
    );
}

export default OrderAddress;
