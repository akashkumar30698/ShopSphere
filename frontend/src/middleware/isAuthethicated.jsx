import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import { handleBuyProduct } from "../pages/address/address.jsx"
import { checkCookie } from "../utils/checkCookie.js";


// Function to get latest values from the server
export const getLatestValues = async (token,isHashed,userId,navigate) => {
    try {
        if (!token) {
            return;
        }
        const res = await fetch(`${import.meta.env.VITE_APP_URL}/:userId/getPassValues?otherUserId=${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
             const data = await res.json();

             console.log("getLatestValues called",navigate)
             handleBuyProduct(data.otherUserId,data.passTotalAmount,data.passAllProductId,isHashed,navigate)
        } else {
            console.log("Failed to fetch data");
        }
    } catch (err) {
        console.log("Some error occurred", err);
    }
};


// Component to check authentication and fetch values
function IsAuthenticated() {
    const [isNotAuthenticated, setIsNotAuthenticated] = useState(true);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isHashed = searchParams.get('hashed');
    const { userId } = useParams()
    console.log(userId)

    useEffect(() => {

        const check = async () =>{
            const token = await checkCookie("accessToken")

            if (!token) {
                setIsNotAuthenticated(true);
            } else {
                setIsNotAuthenticated(false);
                getLatestValues(token,isHashed,userId,navigate);  
            }
        }
         check()
        
    }, []);


    const handleLoginPage = () => {
        if(!isHashed){
            navigate(`/login`)
        }
        navigate(`/login?hashed=${isHashed}`);
    };


    return (
        <>
            {isNotAuthenticated && (
                <>
                    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                        <div className="text-center">
                            <p className="text-base font-semibold text-indigo-600">404</p>
                            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                Not Authenticated
                            </h1>
                            <p className="mt-6 text-base leading-7 text-gray-600">
                                You are not authenticated. Login to proceed further.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <button
                                    onClick={handleLoginPage}
                                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Go to Login Page
                                </button>
                            </div>
                        </div>
                    </main>
                </>
            )}
        </>
    );
}

export default IsAuthenticated;
