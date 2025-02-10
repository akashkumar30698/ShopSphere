import { useEffect } from "react"
import { getLatestValues } from "./isAuthethicated"
import Cookies from "js-cookie"
import { useSearchParams } from "react-router-dom";
import { checkCookie } from "../utils/checkCookie";

function Hashed(){

    const [searchParams] = useSearchParams();
    const isHashed = searchParams.get('hashed');

   useEffect(()=>{

    const check = async () =>{
        const token = await checkCookie("accessToken")

        if(!token){
            return
        }
    
        getLatestValues(token,isHashed)
    }

    check()


   },[])


    return (
        <>
        </>
    )
}

export default Hashed