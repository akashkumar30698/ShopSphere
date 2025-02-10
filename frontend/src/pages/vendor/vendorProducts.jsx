import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import VendorNavbar from "../../components/VendorNavbar";
import { checkCookie } from "../../utils/checkCookie";

function VendorProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const token = await checkCookie("accessToken")

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
             const token = await checkCookie("accessToken")

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
        <div className="min-h-screen bg-gray-100">
          <VendorNavbar />
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Your Products</h1>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Product Image
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Product Title
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Product Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img
                              src={product.productPhoto || "/placeholder.svg"}
                              alt="product"
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.productTitle}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${product.productPrice.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDeleteClick(product._id)}
                              className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg p-6 text-center">
                <p className="text-gray-500">No products found</p>
              </div>
            )}
          </div>
        </div>
      )
}

export default VendorProducts;
