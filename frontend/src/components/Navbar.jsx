import "../index.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../ContextApi/loginContext.jsx"
import Cookies from "js-cookie"
import Hero from "./hero.jsx"
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { getLatestValues } from "../middleware/isAuthethicated.jsx";
import { getCount } from "./hero.jsx";
import NavbarComponent from "./navbarComponent.jsx";
import Banner from "./banner.jsx";
import Footer from "./footer.jsx";
import Category from "./category.jsx";
import MobileNavigation from "./mobileNavigation.jsx";
import "../App.css"
import YourOrdersDetails from "./yourDetailsSideBar.jsx";


export async function getUserId(token, navigate) {
  try {
    if (!token) {
      return;
    }
    const res = await fetch(`${import.meta.env.VITE_APP_URL}/getUserId`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json()
      navigate(`/${data.id}`)
    }
    else if(res.status === 501){
      navigate(`/invalidToken`)
  }

  }
  catch (err) {
    console.log("some error occured ", err)
  }
}




function Navbar() {

  const { isLoggedIn, setIsLoggedIn ,showCategory,yourOrderDetails} = useLogin()
  const navigate = useNavigate()

  //    name      initialState name
  const cart = useSelector((state) => state.addToCart.cart) //This will show the initialState that you defined in createSlices.jsx
  // const count = useSelector((state) => state.addToCart.count)
  const params = useParams()
  const userId = params.userId
  const [searchParams] = useSearchParams();
  const isHashed = searchParams.get('hashed');
 

  useEffect(() => {
    const token = Cookies.get("accessToken")
    if (isHashed) {
      getLatestValues(token, isHashed, userId, navigate)
    }

  }, [])



  /*
  const storeAllCarts = async () => {
    try {
 
      const res = await fetch(
        `${import.meta.env.VITE_APP_URL}/:userId/cartPage?userId=${userId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cart),
        }
      );
 
      if (res.ok) {
        const data = await res.json();
        console.log(data)
        setCartData(data)
        return data
       
      }
    } catch (err) {
      console.log("Some error occurred", err);
    }
  };
 
  */


  const style = {
    responsive: {
      display: "flex",
      position: "fixed",
      height: "100%",
      transition: "0.5s ease",
      top: 0,
      bottom: 0,
      maxWidth: "320px",
      width:"100%",
      zIndex: 1000
    }

  }


  return (
    <>

      {showCategory && <Category style={style.responsive} />} {/* Conditionally rendering Category */}

      <NavbarComponent />



      <Banner />

      <div className="flex height">
         <div className="w-1/4  responsive">
          <Category />
         </div>

         <div className="widthHF overflowing flexy">
          <Hero  />
         </div>
      </div>



      <MobileNavigation />


      <YourOrdersDetails/> 

      <Footer />


    </>


  );
}

export default Navbar;
