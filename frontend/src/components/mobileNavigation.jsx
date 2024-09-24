import { LayoutGrid, House, Menu, ShoppingBag } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { getCount } from "./hero";
import { useState, useEffect } from 'react';
import Cookies from "js-cookie"
import "../components/mobileNavigation.jsx"
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../ContextApi/loginContext.jsx';
import YourOrdersDetails from './yourDetailsSideBar.jsx';


export function CustomStyle(){
  return style
}

let style = {}


function MobileNavigation() {

  const cart = useSelector((state) => state.addToCart.cart)
  const [count, setCount] = useState(0)
  const [countCheck, setCountCheck] = useState(false)
  const { setShowCategory,isOpen,setIsOpen } = useLogin()

  const { userId } = useParams()
  const getCountFromHero = getCount()
  const navigate = useNavigate()



  const handleAddToCartButtonClick = () => {
    if (cart) {
      navigate(`/${userId}/cartPage`)
    }
  }

  const handleMenuClick = () => {
    setIsOpen(!isOpen)
  }



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


  useEffect(() => {

    const token = Cookies.get("accessToken")

    if (!token) {
      localStorage.removeItem("cart")
    }

  }, [])

    const handleLayoutGrid = () => {
     setShowCategory(prev => !prev); 
     };

    const handleHomeClick = () => {
      if(userId){
        navigate(`/${userId}`)
      }
    }

  


  return (
    <>


      <div className="mobile-bottom-navigation display">

        <button onClick={handleMenuClick} className="action-btn" data-mobile-menu-open-btn="">
          <Menu />
        </button>

        <button
          onClick={handleAddToCartButtonClick}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            position: "relative",
          }} >
          <ShoppingBag />
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

        <button onClick={handleHomeClick} className="action-btn">
          <House />
        </button>

        <button onClick={handleLayoutGrid} className="action-btn" data-mobile-menu-open-btn="">
          <LayoutGrid  />
        </button>


      </div>
    </>
  )
}

export default MobileNavigation


