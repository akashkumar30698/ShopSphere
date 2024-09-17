import { useEffect } from "react"
import { getLatestValues } from "./isAuthethicated"
import Cookies from "js-cookie"
import { useSearchParams } from "react-router-dom";

function Hashed(){

    const [searchParams] = useSearchParams();
    const isHashed = searchParams.get('hashed');

   useEffect(()=>{
    const token = Cookies.get("accessToken")

    if(!token){
        return
    }

    getLatestValues(token,isHashed)

   },[])


    return (
        <>
        </>
    )
}

export default Hashed