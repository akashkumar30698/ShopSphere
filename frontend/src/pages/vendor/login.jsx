import { Link, useNavigate, useSearchParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../../App.css";
import { useLogin } from "../../ContextApi/loginContext";
import Cookies from "js-cookie";
import RequestStatus from "../../requestStatus/requestStatus";
import { useAuthContext } from "../../ContextApi/authProvider";
import { checkCookie } from "../../utils/checkCookie";

function VendorLogin() {
  const navigate = useNavigate();
  const { setFormData, setCheckCookie, setRefreshToken, formData } = useAuthContext();
  const [invalidCredentials, setInvalidCredentials] = useState(false)
  const [isRequested, setIsRequested] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false)
  const [sendRequestToAdmin, setSendRequestToAdmin] = useState(false);


  const { isLoggedIn, setIsLoggedIn } = useLogin();



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_APP_URL}/vendor/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();

        if (data.message === "vendor") {
          navigate(`/${data.params}/vendor/Your-Products`);

          Cookies.set("accessToken", data.accessToken);

          setRefreshToken(data.refreshToken);
          setIsLoggedIn(true);

          const token = await checkCookie("accessToken")

          if (!token) {
            console.log("no token found")
            return
          }
          setCheckCookie(token);

          setIsRequested(true);
          setWrongPassword(false);
          setInvalidCredentials(false)

          setSendRequestToAdmin(true);
        }
      } else if (res.status === 403) {
        setWrongPassword(true);
        setInvalidCredentials(false)
        resetForm();

      } else if (res.status === 401) {
        setInvalidCredentials(true);
        setWrongPassword(false)
        console.log("res")
        resetForm();
      } else {
        console.log("An unexpected error occurred");
      }
    } catch (err) {
      resetForm();
      console.log("Error logging in: ", err);
    }
  };


  const resetForm = () => {
    setIsLoggedIn(false);
    setIsRequested(false);
    setSendRequestToAdmin(false);
  };




  return (
    <>
      <section className="">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-white-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
                Login in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-white-50 border border-gray-300 text-black-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="bg-white-50 text border border-gray-300 text-black-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>

                {wrongPassword && <p className="text-red-700">Invalid Email or Password</p>}

                {
                  invalidCredentials && <div className="text-red-700" >Invaild credentials</div>
                }

                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-black-500 dark:text-black-300">
                        Remember me
                      </label>
                    </div>
                  </div>
                  <Link to="/vendor/forgetPassword" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                    Forgot password?
                  </Link>
                </div>


                <button
                  type="submit"
                  className="w-full black text-white bg-black-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link to="/vendor/signUP" className="font-medium text-black-600 text hover:underline dark:text-black-500">
                    Register
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Others */}
      <RequestStatus isRequested={isRequested} />


    </>
  );
}

export default VendorLogin;
