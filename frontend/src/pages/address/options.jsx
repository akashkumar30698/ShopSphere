import { useState } from "react";
import "../../App.css";
import { useLogin } from "../../ContextApi/loginContext";
import { handleBuyProduct } from "./address";
import { useSearchParams,useNavigate, useParams } from "react-router-dom";
   
  

function Options({showOptions,storeAllProductId,allProductId,totalAmount,setShowOptions,handlePayment}) {

     const [initiatePayment,setInitiatePayment] = useState(false)
     const { isAskFriendClick,setIsAskFriendClicked,addressDetails} = useLogin()

     const [searchParams] = useSearchParams();
     const navigate = useNavigate()
     const friendHashed = searchParams.get('hashed'); //query parameters
     const  { userId }= useParams();
   //  const totalAmount = location.state?.totalAmount || 0;
  //   const allProductId = location.state?.cartData || [];


     //Button handlers
     const handleCancelPayment = ()  => {
         setShowOptions(!showOptions)
     }


     const handleInitiatePayment = (e) => {
           setInitiatePayment(!initiatePayment)
           setShowOptions(!showOptions)

           if (friendHashed) {
            handleBuyProduct(userId, totalAmount, storeAllProductId, friendHashed, navigate,addressDetails);
         }
          else {
            handleBuyProduct(userId, totalAmount, allProductId, null, navigate,addressDetails)
         }

     }

     const handleAskFriendForPayment = () => {
        setInitiatePayment(!initiatePayment)
        setShowOptions(!showOptions)

           setIsAskFriendClicked(true)
     }



    return (
        <>
           {showOptions &&
                       <div id="modelConfirm" className="fixed inset-0 z-50 bg-gray-900 bg-opacity-60 flex justify-center items-center">
                         <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                           <div className="flex flex-col items-center space-y-4">
                               <button onClick={handleInitiatePayment} className="w-full py-2 bg-black text-white rounded hover:bg-gray-700 transition duration-300">
                                   Initiate Payment
                               </button>
                               <button onClick={handleAskFriendForPayment} className="w-full py-2 bg-black text-white rounded hover:bg-gray-700 transition duration-300">
                                   Request a friend for Payment
                               </button>
                               <button onClick={handleCancelPayment} className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-400 transition duration-300">
                                   Cancel Payment
                               </button>
                           </div>
                       </div>
                   </div>
            }

        </>
    );
}

export default Options;
