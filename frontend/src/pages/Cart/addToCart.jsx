import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";

let grabUpdatedCart = []


export const exportPlusClick = (productId) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  const updatedCart = cart.map((item) => {

    if (item.id === productId ) {
  
      return {
        ...item,
        productQuantity: item.productQuantity + 1,
      };
    }

    return item;
  });

   grabUpdatedCart = updatedCart

  // Update the cart in localStorage (stringify it to JSON)
  localStorage.setItem("cart", JSON.stringify(updatedCart))
}




function CartPage() {
  const [storeCartData, setStoreCartData] = useState([]);
  const { userId } = useParams(); 
  const [totalAmount, setTotalAmount] = useState(0);
  const [error ,setError] = useState(false)
 // const [grabUpdatedCart,setGrabUpdatedCart] = useState([])

  const navigate = useNavigate()


  /*
  const updateStoreCarts = async () => {
    try {
      const token = Cookies.get("accessToken");

      if (!token) {
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_APP_URL}/${userId}/cartPage`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {

        const data = await res.json();

           let storeTotalAmount = 0;

             for(let i = 0; i < data.length;i++){
                  const totalCartAmount  =  Number(data[i].productPrice.replace("₹","")) * data[i].productQuantity
                   storeTotalAmount += totalCartAmount
                   console.log(data[i].productQuantity)
             }

             setTotalAmount(storeTotalAmount)       
             setStoreCartData(data)       
      }
    } catch (err) {
      console.log("Some error occurred", err);
    }
  };

*/



  const handleMinusClick = (productId) => {
    const cartMinus = JSON.parse(localStorage.getItem("cart")) || [];
  
    const updatedCartItem = cartMinus.map((item) => {
      if (item.id === productId && item.productQuantity > 0) {
   
        return {
          ...item,
          productQuantity: item.productQuantity - 1,
        };
      }
       
      return item;
    });
  
    // Update the cart in localStorage (stringify it to JSON)
    localStorage.setItem("cart", JSON.stringify(updatedCartItem));

    setStoreCartData(updatedCartItem)
    cartTotalAmount()
  }

  const handlePlusClick = (productId) => {
 
      exportPlusClick(productId)
    //Immediately update the UI
    setStoreCartData(grabUpdatedCart)
    cartTotalAmount()

  };
  

  const cartTotalAmount = () => {
    const allCartData = JSON.parse(localStorage.getItem("cart")) || [];
    let cartTotalAmount = 0;

     for(let i = 0; i < allCartData.length;i++){
           const replacedPrice = allCartData[i].price.replace("₹","")
              cartTotalAmount += Number(replacedPrice) * allCartData[i].productQuantity
     }

     setTotalAmount(cartTotalAmount) 
  }

  
  const handlePlaceOrder = () => {
     if(totalAmount == 0){
      console.log(totalAmount)
       setError(true)
       return
     }

     setError(false)

    navigate(`/${userId}/address`,{state: {totalAmount:totalAmount,cartData: storeCartData}})
  }


  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    if(cartData){
      setStoreCartData(cartData)
    }
    cartTotalAmount()

  }, [userId]);


  const handleHomePageClick = () => {
    navigate(`/${userId}/`)
  }


  
  return (
    <>
      {storeCartData.length > 0 ? (
        <>
          <div className="w-full max-w-7xl px-4 md:px-5 lg:px-6 mx-auto">
            <h2 className="title font-manrope font-bold text-4xl leading-10 mb-8 text-center text-black">
              Shopping Cart
            </h2>
            <div className="hidden lg:grid grid-cols-2 py-6">
              <div className="font-normal text-xl leading-8 text-gray-500">Product</div>
              <p className="font-normal text-xl leading-8 text-gray-500 flex items-center justify-between">
           
                <span className="w-full max-w-[260px] text-center">Quantity</span>
                <span className="w-full max-w-[200px] text-center">Total</span>
              </p>
            </div>
            {storeCartData.map((cart) => (
              <div key={cart.id} className="grid grid-cols-1 lg:grid-cols-2 min-[550px]:gap-6 border-t border-gray-200 py-6">
                <div className="flex items-center flex-col min-[550px]:flex-row gap-3 min-[550px]:gap-6 w-full max-xl:justify-center max-xl:max-w-xl max-xl:mx-auto">
                  <div className="img-box">
                    <img
                      src={cart.image}
                      alt="Product image"
                      className="xl:w-[140px] rounded-xl"
                    />
                  </div>
                  <div className="pro-data w-full max-w-sm">
                    <h5 className="font-semibold text-xl leading-8 text-black max-[550px]:text-center">
                      {cart.title}
                    </h5>
                    <p className="font-normal text-lg leading-8 text-gray-500 my-2 min-[550px]:my-3 max-[550px]:text-center">
                 
                    </p>
                  
                  </div>
                </div>
                <div className="flex items-center flex-col min-[550px]:flex-row w-full max-xl:max-w-xl max-xl:mx-auto gap-2">

                  <div className="flex items-center w-full mx-auto justify-center">
                    <button className="group rounded-l-full px-6 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-300 hover:bg-gray-50" onClick={()=> handleMinusClick(cart.id)}>
                      <svg className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path d="M16.5 11H5.5" stroke="" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                    <input
                      type="text"
                      className="border-y border-gray-200 outline-none text-gray-900 font-semibold text-lg w-full max-w-[118px] min-w-[80px] placeholder:text-gray-900 py-[15px] text-center bg-transparent"
                      
                      value={cart.productQuantity}
                      onChange={(e) => {
                        // Update quantity handler here
                      }}
                    />
                    <button className="group rounded-r-full px-6 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-300 hover:bg-gray-50" onClick={() => handlePlusClick(cart.id)}>
                      <svg className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path d="M11 5.5V16.5M16.5 11H5.5" stroke="" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  <h6 id="TotalPrice" className="text-indigo-600 font-manrope font-bold text-2xl leading-9 w-full max-w-[176px] text-center" >
                    {  
                      Number(cart.price.replace("₹","")) * cart.productQuantity
                    }
                  </h6>
                </div>
              </div>

              
            ))}
            <div className="bg-gray-50 rounded-xl p-6 w-full mb-8 max-lg:max-w-xl max-lg:mx-auto">
              <div className="flex items-center justify-between w-full py-6">
                <p className="font-manrope font-medium text-2xl leading-9 text-gray-900">Total</p>
                <h6 className="font-manrope font-medium text-2xl leading-9 text-indigo-500">{totalAmount}</h6>
              </div>
            </div>

             {
              error && <div className="text-red-700">Amount cannot be empty</div>
             }


            <div className="flex items-center flex-col sm:flex-row justify-center gap-3 mt-8">
              <button onClick={handleHomePageClick} className="rounded-full py-4 w-full max-w-[280px] flex items-center bg-indigo-50 justify-center transition-all duration-500 hover:bg-indigo-100">
                <span className="px-2 font-semibold text-lg leading-8 text-indigo-600">Go To HomePage</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M8.25324 5.49609L13.7535 10.9963L8.25 16.4998" stroke="#4F46E5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={handlePlaceOrder} className="rounded-full w-full max-w-[280px] py-4 text-center justify-center items-center bg-indigo-600 font-semibold text-lg text-white flex transition-all duration-500 hover:bg-indigo-700">
                Place Order
                <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 23 22" fill="none">
                  <path d="M8.75324 5.49609L14.2535 10.9963L8.75 16.4998" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      )}
    </>
  );
}

export default CartPage;
