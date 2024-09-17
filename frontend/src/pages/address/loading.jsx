import { useLogin } from "../../ContextApi/loginContext"
import Timer from "./timer"
import io from "socket.io-client";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../App.css"

function Loading() {

     const {setShowOptions,reRenderOnCrossClick,setReRenderOnCrossClick,checkTrue, loading ,setCheckTrue,setLoading} = useLogin()

     const { userId } = useParams()
     const navigate = useNavigate()

     const handleCancelPayment = () => {
        setLoading(false)
        setReRenderOnCrossClick(!reRenderOnCrossClick)
        setCheckTrue(false)
     }


   useEffect(()=>{

     if(loading){
      setShowOptions(false)
     }

   },[loading])






   useEffect(() => {
    const socket = io(import.meta.env.VITE_APP_URL, {
      withCredentials: true,
      transports: ['websocket'], 
    });


    socket.on("connect",()=>{
      console.log("A user connected")
    })

    socket.on("initiaterUserId",(data)=>{
       console.log(data)
       if(data){
        navigate(`/${userId}/paymentMadeByFriend`,{state: data})


        //Clear out previous pages
        setLoading(false)
        setReRenderOnCrossClick(!reRenderOnCrossClick)
        setCheckTrue(false)
       }
    })
    
    
     socket.on("disconnect",()=>{
      console.log("User disconnected")
     })

    return ()=>{
      socket.disconnect()
    }

  }, []);


    return (
        <>

        {
          loading &&  <div id="loading-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60">

          <div className="flex flex-col items-center space-y-4"  >
              <svg className="animate-spin h-8 w-8 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
              </svg>

              <span className="text-white text-3xl fontt font-bold">Waiting for your Friend to complete payment...</span>
               <Timer/>
              <button onClick={handleCancelPayment} className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Cancel Payment</button>
          </div>

      </div>
        }

        </>
    )
}

export default Loading