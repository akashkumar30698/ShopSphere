import { useParams,Link,useNavigate,useSearchParams} from "react-router-dom"
import { useEffect } from "react"
import { checkCookie } from "../utils/checkCookie";



export  async function passPaymentMadeByUserId(token,currentUserId){
      try{
        const res = await fetch(
            `${import.meta.env.VITE_APP_URL}/:userId/passCurrentUserId?passCurrentUserId=${currentUserId}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
               },
            }
          );

          if(res.ok){
            const data = await res.json()
            console.log(data)    
          }
     
      }catch(err){
        console.log("Some error occured",err)
      }
}
   
function PaymentMadeByOther() {
    const params = useParams()
    const navigate = useNavigate()
    const currentUserId = params?.userId
    const [searchParams] = useSearchParams();
   // const isHashed = searchParams.get('hashed');
    const isHashed = searchParams.get('hashed')
    const userId = searchParams.get('initiaterUserId')



    const handleHomePageClick = async () => {
            navigate(`/${currentUserId}`)

            const token = await checkCookie("accessToken")
            if(!token){
              console.log("no cookie found")
              return
            }
            passPaymentMadeByUserId(token,currentUserId)
    }


    useEffect(()=>{  
      if(!isHashed){
        navigate(`/${currentUserId}/selfHashedError`)
      }
    },[])


    return (
        <>

            <div className="bg-gray-100 h-screen">
                <div className="bg-white p-6  md:mx-auto">
                    <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
                        <path fill="currentColor"
                            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
                        </path>
                    </svg>
                    <div className="text-center">
                        <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Done!</h3>
                        <p className="text-gray-600 my-2">Thank you for completing your secure online payment.</p>
                        <p> You have successfully made payment for friend ${userId} </p>
                        <div className="py-10 text-center">
                            <button onClick={handleHomePageClick}>
                            <Link to={currentUserId ? `/${currentUserId}/` : "/"} className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3">
                                GO BACK TO HOMEPAGE
                            </Link>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentMadeByOther