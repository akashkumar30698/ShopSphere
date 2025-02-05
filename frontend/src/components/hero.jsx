import { useEffect, useState, useCallback } from "react"
import Cookies from "js-cookie"
import { useDispatch } from "react-redux"
import { addToCartOnClick, increment } from "../slices/createSlices.jsx"
import { useParams, useNavigate } from "react-router-dom"
import { useLogin } from "../ContextApi/loginContext.jsx"
import "../App.css"

// Helper function to get the total quantity in the cart
export const getCount = () => {
  const getAllCarts = JSON.parse(localStorage.getItem("cart") || "[]")
  return getAllCarts.reduce((total, item) => total + (item.productQuantity || 0), 0)
}

const dummyProducts = [
  // Cosmetics
  {
    _id: "201",
    productTitle: "Luxury Lipstick Set",
    productPhoto:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹2,999",
    category: "Cosmetics",
  },
  {
    _id: "202",
    productTitle: "Natural Eyeshadow Palette",
    productPhoto:
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹1,499",
    category: " Cosmetics",
  },
  {
    _id: "203",
    productTitle: "Hydrating Face Cream",
    productPhoto:
      "https://putsimply.co.in/cdn/shop/files/WBg_WD_first_imgs.webp?v=1725855526&width=700",
    productPrice: "₹999",
    category: "Cosmetics",
  },
  {
    _id: "204",
    productTitle: "Volumizing Mascara",
    productPhoto:
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹799",
    category: "Cosmetics",
  },
  {
    _id: "205",
    productTitle: "Skin Brightening Serum",
    productPhoto:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹1,799",
    category: "Cosmetics",
  },
  // Clothes
  {
    _id: "301",
    productTitle: "Classic White T-Shirt",
    productPhoto:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹599",
    category: "Clothes",
  },
  {
    _id: "302",
    productTitle: "Slim Fit Jeans",
    productPhoto:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹1,999",
    category: "Clothes",
  },
  {
    _id: "303",
    productTitle: "Floral Summer Dress",
    productPhoto:
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹1,499",
    category: "Clothes",
  },
  {
    _id: "304",
    productTitle: "Formal Blazer",
    productPhoto:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹3,999",
    category: "Clothes",
  },
  {
    _id: "305",
    productTitle: "Cozy Knit Sweater",
    productPhoto:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹1,799",
    category: "Clothes",
  },
  // Footwear
  {
    _id: "401",
    productTitle: "Running Shoes",
    productPhoto:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹3,499",
    category: "Footwear",
  },
  {
    _id: "402",
    productTitle: "Leather Formal Shoes",
    productPhoto:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹2,999",
    category: "Footwear",
  },
  {
    _id: "403",
    productTitle: "Comfortable Sandals",
    productPhoto: "https://www.bigbasket.com/media/uploads/p/l/40331814_1-hoversole-mens-tan-cork-casual-sandals.jpg",
    productPrice: "₹999",
    category: "Footwear",
  },
  {
    _id: "404",
    productTitle: "Stylish Sneakers",
    productPhoto:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹1,799",
    category: "Footwear",
  },
  {
    _id: "405",
    productTitle: "Ankle Boots",
    productPhoto:
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹2,499",
    category: "Footwear",
  },
  // Jewelry
  {
    _id: "501",
    productTitle: "Diamond Stud Earrings",
    productPhoto:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹9,999",
    category: "Jewelry",
  },
  {
    _id: "502",
    productTitle: "Gold Chain Necklace",
    productPhoto:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹15,999",
    category: "Jewelry",
  },
  {
    _id: "503",
    productTitle: "Silver Charm Bracelet",
    productPhoto:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹3,999",
    category: "Jewelry",
  },
  {
    _id: "504",
    productTitle: "Pearl Drop Earrings",
    productPhoto:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹4,999",
    category: "Jewelry",
  },
  {
    _id: "505",
    productTitle: "Rose Gold Ring",
    productPhoto:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹7,999",
    category: "Jewelry",
  },
  // Perfume
  {
    _id: "601",
    productTitle: "Floral Essence Perfume",
    productPhoto:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹4,999",
    category: "Perfume",
  },
  {
    _id: "602",
    productTitle: "Woody Musk Cologne",
    productPhoto:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹3,999",
    category: "Perfume",
  },
  {
    _id: "603",
    productTitle: "Citrus Burst Fragrance",
    productPhoto:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹2,999",
    category: "Perfume",
  },
  {
    _id: "604",
    productTitle: "Oriental Spice Perfume",
    productPhoto:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹5,499",
    category: "Perfume",
  },
  {
    _id: "605",
    productTitle: "Fresh Aqua Scent",
    productPhoto:
      "https://images.unsplash.com/photo-1617897903246-719242758050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹3,499",
    category: "Perfume",
  },
  // Glasses
  {
    _id: "701",
    productTitle: "Classic Aviator Sunglasses",
    productPhoto:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹2,499",
    category: "Glasses",
  },
  {
    _id: "702",
    productTitle: "Blue Light Blocking Glasses",
    productPhoto:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹1,999",
    category: "Glasses",
  },
  {
    _id: "703",
    productTitle: "Vintage Round Eyeglasses",
    productPhoto: "https://goeye.in/cdn/shop/files/VG005MG5028-3_1800x1800.jpg?v=1722945324",
    productPrice: "₹1,799",
    category: "Glasses",
  },
  {
    _id: "704",
    productTitle: "Sports Wrap Sunglasses",
    productPhoto:
      "https://images.unsplash.com/photo-1625591341337-13dc6e871cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹2,999",
    category: "Glasses",
  },
  {
    _id: "705",
    productTitle: "Cat Eye Reading Glasses",
    productPhoto:
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹1,499",
    category: "Glasses",
  },
  // Bags
  {
    _id: "801",
    productTitle: "Leather Tote Bag",
    productPhoto:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹4,999",
    category: "Bags",
  },
  {
    _id: "802",
    productTitle: "Canvas Backpack",
    productPhoto:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹2,499",
    category: "Bags",
  },
  {
    _id: "803",
    productTitle: "Crossbody Sling Bag",
    productPhoto:
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹1,999",
    category: "Bags",
  },
  {
    _id: "804",
    productTitle: "Travel Duffel Bag",
    productPhoto: "https://m.media-amazon.com/images/I/41Rsjtx3L8L._SY300_SX300_.jpg",
    productPrice: "₹3,499",
    category: "Bags",
  },
  {
    _id: "805",
    productTitle: "Evening Clutch Purse",
    productPhoto:
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    productPrice: "₹2,999",
    category: "Bags",
  },
]

function Hero() {

  const { products ,setProducts } = useLogin()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const { userId } = useParams()

  // Function to fetch all products
  const fetchAllProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${import.meta.env.VITE_APP_URL}/all-products`, {
        method: "GET",
      })

      if (!res.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await res.json()
      console.log("data :",data)
      setProducts(data.allProduct.length > 0 ? data.allProduct : dummyProducts)
    } catch (err) {
      console.error("Error fetching products:", err)
      setProducts(dummyProducts) // Fallback to dummy products in case of error

    }finally {
      setLoading(false)
    }
  }

  // Add to cart functionality
  const handleAddToCart = useCallback(
    (productId, productPhoto, productTitle, productPrice) => {
      const token = Cookies.get("accessToken")

      if (!token) {
        navigate("/login")
        return
      }

      // Dispatch Redux action to update the cart
      dispatch(
        addToCartOnClick({
          id: productId,
          title: productTitle,
          image: productPhoto,
          price: productPrice,
          userId: userId,
          productQuantity: 1,
        }),
      )

      dispatch(increment())

      // Update the cart in localStorage
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
      const productIndex = existingCart.findIndex((item) => item.id === productId)

      if (productIndex !== -1) {
        // Update quantity if product already exists
        existingCart[productIndex].productQuantity = (existingCart[productIndex].productQuantity || 0) + 1
      } else {
        // Add new product to the cart
        existingCart.push({
          id: productId,
          image: productPhoto,
          price: productPrice,
          productQuantity: 1,
          title: productTitle,
          userId: userId,
        })
      }

      localStorage.setItem("cart", JSON.stringify(existingCart))
      getCount()
    },
    [dispatch, navigate, userId],
  )

  useEffect(() => {
    fetchAllProducts()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array(8)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
              ))
          : products.length > 0
          ? products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={product.productPhoto || "/placeholder.svg"}
                    alt={product.productTitle}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.productTitle}
                  </h3>
                  <p className="text-2xl font-bold text-indigo-600 mb-4">{product.productPrice}</p>
                  <button
                    onClick={() =>
                      handleAddToCart(product._id, product.productPhoto, product.productTitle, product.productPrice)
                    }
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          : (
            <div className="col-span-full text-center text-gray-500 py-8">
              <p className="text-xl">No Products Available</p>
            </div>
          )}
      </div>
    </div>
  )

}

export default Hero

