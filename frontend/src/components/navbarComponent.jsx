import { SearchIcon, UserIcon, HeartIcon, ShoppingBagIcon } from "lucide-react";
import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import Cookies from "js-cookie"
import "../App.css"
import { getUserId } from "./Navbar";
import { useLogin } from "../ContextApi/loginContext";
import { getCount } from "./hero";
import { useSelector } from "react-redux";


function NavbarComponent() {

  const [showDropDown, setShowDropDown] = useState(false)
  const [count, setCount] = useState(0)
  const [countCheck, setCountCheck] = useState(false)
  const cart = useSelector((state) => state.addToCart.cart) //This will show the initialState that you defined in createSlices.jsx
  // const count = useSelector((state) => state.addToCart.count)
  const { userId } = useParams()

  const getCountFromHero = getCount()
  const navigate = useNavigate()

  const { isLoggedIn, setIsLoggedIn ,setAllProducts } = useLogin()

  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  // Sample data list
  const items = ['Clothes', 'Footwear', 'Jewelry', 'Perfume', 'Cosmetics', 'Glasses', 'Bags'];

  // Function to handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value) {
      const filteredSuggestions = items.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Function to handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion); 
    setSuggestions([]); 
  };



  const updateProductsOnSearchClick  = async (input) => {

         try{
          const res = await fetch(`${import.meta.env.VITE_APP_URL}/updateProducts`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
          });  
          
            if(res.ok){
                const data = await res.json()
                setAllProducts(data) 
            }

         }catch(err){
          console.log("Some error occured",err)
         }
  }


  const handleSearchBarClick = () => {
        updateProductsOnSearchClick(input)
        setInput('')
  }


  const handleShowDropDown = () => {
    setShowDropDown(!showDropDown)
  }



  const handleLogoutClick = () => {
    setIsLoggedIn(false);

    Cookies.remove("accessToken", { path: "/" });

    localStorage.removeItem("cart")

    navigate("/")
  }


  useEffect(() => {
    const getCookie = Cookies.get("accessToken")
    if (getCookie || getCookie != null) {

      getUserId(getCookie, navigate)
      setIsLoggedIn(true)
    }
    else if (!getCookie || getCookie == null) {
      navigate("/")
    }

  }, [isLoggedIn])

  useEffect(() => {
    const token = Cookies.get("accessToken")
    setCount(getCountFromHero)
    if (!token) {
      return
    }
  }, [getCountFromHero])


  useEffect(() => {
    if (count === 0) {
      setCountCheck(false)
    }
    else if (count > 0) {
      setCountCheck(true)
    }
  }, [count])



  const handleAddToCartButtonClick = () => {
    if (cart) {
      if (userId) {
        navigate(`/${userId}/cartPage`)
      }
      else {
        navigate(`/cartPage`)
      }
    }
  }

  useEffect(() => {

    const token = Cookies.get("accessToken")

    if (!token) {
      localStorage.removeItem("cart")
    }

  }, [])


  const handleYourOrdersButtonClick = () => {
    navigate(`/${userId}/yourOrders`)
  }



  return (

    <>

      <header
        style={{
          maxWidth: "100%",
          boxSizing: "border-box",
          fontFamily: "Poppins, sans-serif",
        }} >
        <div
          style={{
            borderBottom: "1px solid rgb(237, 237, 237)",
            padding: "25px 0",
            backgroundColor: "rgb(255, 255, 255)",
            color: "rgb(0, 0, 0)",
            fontSize: "17px",
          }} >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 15px",
            }} >


            <Link
              to={userId ? `/${userId}` : `/`}
              style={{
                textDecoration: "none",
              }} >

              <img style={{
                display: "block", WebkitUserSelect: "none", margin: "auto",
                cursor: "zoom-in",
                backgroundColor: "rgb(111 97 97 / 0%)", transition: "background-color 300ms"
              }} src="https://evershop.io/img/logo.png" width="37px" height="42px" />

            </Link>

            <div
              style={{
                position: "relative",
                flexGrow: 1,
                margin: "0 20px",
              }} >

              <input
                type="search"
                value={input}
                onChange={handleInputChange}
                name="search"
                placeholder="Enter your product name..."
                style={{
                  width: "100%",
                  fontSize: "14.875px",
                  color: "rgb(69, 69, 69)",
                  border: "1px solid rgb(237, 237, 237)",
                  borderRadius: "10px",
                  padding: "10px 50px 10px 15px",
                }} />
              <button

                 onClick={handleSearchBarClick}
                 style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }} >
                <SearchIcon
                  size={18}
                  color="rgb(69, 69, 69)" />
              </button>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <ul className="absolute left-0 w-full bg-white border rounded shadow mt-1 max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div
              className="desktop"
              style={{
                alignItems: "center",
                gap: "15px",
              }} >


              {
                showDropDown && (
                  <div
                    className="hs-dropdown"
                    style={{
                      position: "absolute",
                      top: "6rem", // Adjust according to the height of the Navbar
                      backgroundColor: "white",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                      padding: "10px",
                      zIndex: 1000,
                    }}
                  >
                    {isLoggedIn ? (

                      <>
                        <div className="flex flex-col space-y-2">
                          <button onClick={handleYourOrdersButtonClick} className="dropdown-item px-4 py-2 font-size  text-black rounded-md">
                            Your Orders
                          </button>
                          <button onClick={handleLogoutClick} className="dropdown-item px-4 py-2  font-size text-black rounded-md">
                            Logout
                          </button>
                        </div>
                      </>


                    ) : (
                      <>
                        <div className="login-fix">
                          <Link to="/login" className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-black-700 ">
                            Login
                          </Link>
                          <Link to="/admin-login" className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-black-700 ">
                            Admin
                          </Link>
                          <Link to="/vendor/login" className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-black-700">
                            Vendor Login
                          </Link>

                        </div>

                      </>
                    )}
                  </div>
                )
              }

              <button
                onClick={handleShowDropDown}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                }} >

                <UserIcon
                  size={35}
                  color="rgb(69, 69, 69)" />
              </button>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                }} >

              </button>
              <button

                onClick={handleAddToCartButtonClick}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                }} >
                <ShoppingBagIcon
                  size={35}
                  color="rgb(69, 69, 69)" />
                <span
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-3px",
                    backgroundColor: "rgb(255, 102, 102)",
                    color: "rgb(255, 255, 255)",
                    fontSize: "12px",
                    fontWeight: 500,
                    lineHeight: "12px",
                    borderRadius: "20px",
                    padding: "2px 4px",
                  }} >
                  {count}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>


      {/* Mobile Navigation */}



    </>
  );
}

export default NavbarComponent


