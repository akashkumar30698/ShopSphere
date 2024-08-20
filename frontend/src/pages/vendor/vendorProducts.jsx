import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import Cookies from "js-cookie"
import VendorNavbar from "../../components/VendorNavbar";


function VendorProducts(){

    const [products,setProducts] = useState([])
    const {userId} = useParams()

    const fetchProducts = async () => {

        try{
           const token = Cookies.get("accessToken")

            if(!token){
                return;
            }


            const res = await fetch(`${import.meta.env.VITE_APP_URL}/:userId/vendor/Your-Products?userId=${userId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if(res.ok){
               const data = await res.json()
               setProducts(data.products)
            }

        }
        catch(err){
            console.log("Some error occured",err)
        }
    }

    useEffect(()=>{
       fetchProducts()
    },[])





    return (
        <>
        <VendorNavbar/>
        {
           
        }
        </>
    )
}


export default VendorProducts