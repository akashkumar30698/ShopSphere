import React, { useEffect, useRef, useState } from "react"
import Cookies from "js-cookie"
import VendorNavbar from "../../components/VendorNavbar"
import { useParams } from "react-router-dom";
import { useLogin } from "../../ContextApi/loginContext";
import "../../App.css"


function VendorProductDetail() {

     const { isApproved } = useLogin()

    const [loading, setLoading] = useState(false)
    const [fileError, setFileError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        productPhoto: "",
        productTitle: "",
        productDescription: "",
        productPrice: "₹" + 0,
        category: "",
    })
    const [priceError, setPriceError] = useState(false)
    const [invalidPrice, setInvalidPrice] = useState(false)
    const [emptyPrice, setEmptyPrice] = useState(false)
    const [showApproveError,setShowApproveError] = useState(false)

    const fileRef = useRef(null)
    const { userId } = useParams()


    const handleChange = (e) => {
        const { name, value, files } = e.target;

        let updatedValue = value;

        // Validate using regex for a valid number (allowing decimals)
        const priceRegex = /^\d+(\.\d{0,2})?$/;

        if (name === "productPrice") {
            // Validate using regex for a valid number (allowing decimals)
            const priceRegex = /^\d+(\.\d{0,2})?$/;

            // Remove ₹ symbol for validation
            const priceWithoutSymbol = updatedValue.replace("₹", "");

            if (priceWithoutSymbol === "" || priceRegex.test(priceWithoutSymbol)) {

                updatedValue = "₹" + priceWithoutSymbol;
                setPriceError(false);
            }
            else {
                setEmptyPrice(false)
                setInvalidPrice(false)
                setPriceError(true);
                return;
            }
        }

        if (name === "productPhoto") {
            const file = files[0];
            if (file) {
                const validImageTypes = ['image/jpeg', 'image/png'];
                if (validImageTypes.includes(file.type)) {
                    setFormData({ ...formData, [name]: file });
                    setFileError(false);
                } else {
                    setFileError(true);
                    setFormData({ ...formData, [name]: "" });
                    if (fileRef.current) {
                        fileRef.current.value = "";
                    }
                }
            }
        } else {
            setFormData({ ...formData, [name]: updatedValue });
        }
    }

    //ResetForm
    const resetForm = () => {
        setFormData({
            productTitle: "",
            productDescription: "",
            productPrice: "₹" + 0
        })

        if (fileRef.current) {
            fileRef.current.value = ""
        }
    }


    useEffect(()=> {
        if(isApproved){
            setShowApproveError(false)
         }
         else if(isApproved == false || isApproved == null){
             setShowApproveError(true)
         } 
    },[isApproved])


    const handleVendorSubmit = async (e) => {
        e.preventDefault()

        console.log(isApproved)

        if(isApproved){
           setShowApproveError(false)
        }
        else if(isApproved == false || isApproved == null){
            setShowApproveError(true)
            return
        }


        const token = Cookies.get("accessToken")

        if (!token) {
            return;
        }

        setLoading(true)

        const valueWithoutRupee = formData.productPrice.replace("₹", "")
        const refreshedValue = parseInt(valueWithoutRupee)


        // Check for negative numbers
        if (refreshedValue <= 0 || refreshedValue > 1000000) {
            setEmptyPrice(false)
            setInvalidPrice(true)
            setPriceError(false);

            setTimeout(() => {
                setLoading(false)
            }, 1000)

            return;
        } else if (isNaN(refreshedValue)) {
            setPriceError(false)
            setInvalidPrice(false)
            setEmptyPrice(true)


            setTimeout(() => {
                setLoading(false)
            }, 1000)

            return
        }


        //Convert back to String
        const productPriceValue = refreshedValue.toString()

        setPriceError(false)
        setInvalidPrice(false)
        setEmptyPrice(false)


        const formDataToSend = new FormData();
        formDataToSend.append('productPhoto', formData.productPhoto);
        formDataToSend.append('productTitle', formData.productTitle);
        formDataToSend.append('productDescription', formData.productDescription);
        formDataToSend.append('productPrice', productPriceValue)
        formDataToSend.append('category', formData.category)

        try {
            const res = await fetch(`${import.meta.env.VITE_APP_URL}/:userId/vendor/sell?userId=${userId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formDataToSend,
            });

            if (res.ok) {
                const data = await res.json()

                if (data) {
                    setSuccess(true)

                    resetForm()
                    setTimeout(() => {
                        setSuccess(false)
                    }, 2000)

                }


            }
        }
        catch (err) {
            console.log("Some error occured", err)
        }
        finally {
            setLoading(false)
        }
    }



    return (
        <>

            <VendorNavbar />
            {success && (
                <div className="p-4 mb-4 mt text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                    <span className="font-medium">Success!</span> Your Product has been Added.
                </div>
            )}
            <form onSubmit={handleVendorSubmit} className="mg-t max-w-lg mx-auto" encType="multipart/form-data">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black" htmlFor="user_avatar">Upload Product Photo</label>
                <input
                    className="block w-full text-sm text-black-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-black-400 focus:outline-none dark:bg-white-700 dark:border-gray-600"
                    aria-describedby="user_avatar_help"
                    id="user_avatar"
                    type="file"
                    name="productPhoto"
                    ref={fileRef}
                    onChange={handleChange}
                    required
                />

                {fileError && (
                    <div className="text-red-700" role="alert">
                        <span className="font-medium">Error !</span> Only JPEG and PNG images are allowed
                    </div>
                )}


                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Product Title</label>
                <input
                    id="title"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handleChange}
                    value={formData.productTitle}
                    name="productTitle"
                    required
                />

                <label htmlFor="body" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Product Description</label>
                <textarea
                    id="body"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handleChange}
                    value={formData.productDescription}
                    name="productDescription"
                    required
                />


                <label htmlFor="productPrice" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Product Price</label>

                <input
                    id="productPrice"
                    rows="4"

                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handleChange}
                    value={formData.productPrice}
                    name="productPrice"
                    required
                />

                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black ">Category</label>



                <select
                    id="category"
                    name="category"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2"
                    onChange={handleChange}
                    value={formData.category}
                    required
                >
                    <option value="" disabled >Select Category</option>
                    <option value="Clothes">Clothes</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Perfume">Perfume</option>
                    <option value="Cosmetics">Cosmetics</option>
                    <option value="Glasses">Glasses</option>
                    <option value="Bags">Bags</option>
                </select>


                {priceError && (
                    <div className="text-red-700" role="alert">
                        Price should be number
                    </div>
                )}


                {invalidPrice && (
                    <div className="text-red-700" role="alert">
                        Invalid Price! Price cannot be greater than 10 Lakhs or less than zero
                    </div>
                )}

                {emptyPrice && (
                    <div className="text-red-700" role="alert">
                        Price cannot be empty or zero
                    </div>
                )}

                {
                    showApproveError && <div className="text-red-700">Cannot add product as you are not approved yet</div>
                }


                <button
                    className="mg-t mt align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                    type="submit"
                >
                    {loading ? "Adding..." : "Add Product"}
                </button>
            </form>


        </>
    )
}


export default VendorProductDetail