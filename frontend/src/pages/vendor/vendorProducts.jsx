import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import VendorNavbar from "../../components/VendorNavbar";

function VendorProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const token = Cookies.get("accessToken");

            if (!token) {
                return;
            }


            const res = await fetch(`${import.meta.env.VITE_APP_URL}/:userId/vendor/Your-Products?userId=${userId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("productData", JSON.stringify(data.products));
                setProducts(data.products);

            }

        } catch (err) {
            console.log("Some error occurred", err);
        } finally {
            setLoading(false);
        }
    };



    const handleDeleteClick = async (productId) =>{
        try{
             const token = Cookies.get("accessToken")

            if(!token){
                 return
            }




             const res = await fetch(`${import.meta.env.VITE_APP_URL}/:userId/vendor/Your-Products?productId=${productId}`,{
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
             })
             if(res.ok){
                  const data = await res.json()
                  if(data == 'success'){
                    setProducts((prevProducts) => 
                        prevProducts.filter((product) => product._id !== productId)
                    );

                  }
             }

        }
        catch(err){
            console.log("some error occured deleting the product",err)
        }
    }

   
    


    useEffect(() => {
      fetchProducts()
    }, []);

    return (
        <>
            <VendorNavbar />
            {loading && <div>Loading...</div>}
            {
                products.length > 0 ? (
                    products.map((product) => (
                        <div key={product._id} className="relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
                            <a className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl" href="#">
                                <img className="object-cover" src={product.productPhoto} alt="product image" />
                                
                            </a>
                            <div className="mt-4 px-5 pb-5">
                                <a href="#">
                                    <h5 className="text-xl tracking-tight text-slate-900">{product.productTitle}</h5>
                                </a>
                                <div className="mt-2 mb-5 flex items-center justify-between">
                                    <p>
                                        <span className="text-3xl font-bold text-slate-900">{product.productPrice}</span>
                                    </p>
                                    <button onClick={()=> handleDeleteClick(product._id)} className="text-red-500 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" id="delete"><path fill="#000" d="M15 3a1 1 0 0 1 1 1h2a1 1 0 1 1 0 2H6a1 1 0 0 1 0-2h2a1 1 0 0 1 1-1h6Z"></path><path fill="#000" fillRule="evenodd" d="M6 7h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7Zm3.5 2a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5Zm5 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5Z" clipRule="evenodd"></path></svg></button>  
                                </div>
                                <a href="#" className="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
                                    See Details
                                </a> 
                            </div>
                        </div> 
                    ))
                ) : (
                    <p>No products found</p>
                )
            }
        </>
    );
}

export default VendorProducts;
