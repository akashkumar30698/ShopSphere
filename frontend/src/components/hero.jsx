import { useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { addToCartOnClick, increment } from "../slices/createSlices.jsx";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";
import { useLogin } from "../ContextApi/loginContext.jsx";

// Helper function to get the total quantity in the cart
export const getCount = () => {
  const getAllCarts = JSON.parse(localStorage.getItem("cart")) || [];

  let totalQuantity = 0;
  for (let i = 0; i < getAllCarts.length; i++) {
    totalQuantity += getAllCarts[i].productQuantity;
  }

  return totalQuantity;
};

function Hero() {
  const { allProducts, setAllProducts } = useLogin();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const cart = useSelector((state) => state.addToCart.cart);

  // Function to fetch all products
  const fetchAllProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_URL}/all-products`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setAllProducts(data.allProduct);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Add to cart functionality
  const handleAddToCart = (productId, productPhoto, productTitle, productPrice) => {
    const token = Cookies.get("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    // Dispatch Redux action to update the cart
    dispatch(addToCartOnClick({
      id: productId,
      title: productTitle,
      image: productPhoto,
      price: productPrice,
      userId: userId,
      productQuantity: 1,
    }));

    dispatch(increment());

    // Update the cart in localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const productIndex = existingCart.findIndex((item) => item.id === productId);

    if (productIndex !== -1) {
      // Update quantity if product already exists
      existingCart[productIndex].productQuantity += 1;
    } else {
      // Add new product to the cart
      existingCart.push({
        id: productId,
        image: productPhoto,
        price: productPrice,
        productQuantity: 1,
        title: productTitle,
        userId: userId,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    getCount();
  };

    useEffect(() => {
      fetchAllProducts();
    }, [setAllProducts]); 

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 heightHF maxWidth">
        {allProducts.length > 0 ? (
          allProducts.map((allProduct) => (
            <div
              key={allProduct._id}
              className="relative flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
            >
              <a className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl" href="#">
                <img className="object-cover" src={allProduct.productPhoto} alt="product image" />
              </a>
              <div className="mt-4 px-5 pb-5">
                <a href="#">
                  <h5 className="text-xl tracking-tight text-slate-900">
                    {allProduct.productTitle}
                  </h5>
                </a>
                <div className="mt-2 mb-5 flex items-center justify-between">
                  <p>
                    <span className="text-3xl font-bold text-slate-900">
                      {allProduct.productPrice}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleAddToCart(allProduct._id, allProduct.productPhoto, allProduct.productTitle, allProduct.productPrice)}
                  className="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No Products Available</p>
        )}
      </div>
    </>
  );
}

export default Hero;
