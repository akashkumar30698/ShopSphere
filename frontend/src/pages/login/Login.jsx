import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../../App.css";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useLogin } from "../../ContextApi/loginContext.jsx";
import { useAuthContext } from "../../ContextApi/authProvider.jsx";



function Login() {

  const navigate = useNavigate();

  const [checkExists, setCheckExists] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [checkIsHashed, setIsHashed] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);

  const { isLoggedIn, setIsLoggedIn } = useLogin();
  const [searchParams] = useSearchParams();
  const isHashed = searchParams.get('hashed');
  const location = useLocation();

  const { isGoogleAuth , formData , setRefreshToken , setCheckCookie , setGoogleFormData , setFormData , setIsGoogleAuth } = useAuthContext();

  const handleGoogleSuccess = async (res) => {
    const userDetails = jwtDecode(res.credential);
    const { given_name, email, picture } = userDetails;

    setGoogleFormData({
      googleAuthName: given_name,
      googleAuthEmail: email,
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          given_name: given_name,
          googleEmail: email,
          picture: picture,
          isGoogleAuth: isGoogleAuth,
          isHashedGoogle: checkIsHashed || false,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === 'success') {
          const path = `/${data.params}${isHashed ? `?hashed=${isHashed}` : ''}`;
          navigate(path);

          Cookies.set("accessToken", data.accessToken);
          setIsLoggedIn(true);
          setCheckCookie(Cookies.get("accessToken"));
          setCheckExists(false);
          setInvalidCredentials(false);
        }
      } else if (response.status === 401) {
        setCheckExists(true);
        setIsLoggedIn(false);
      } else if (response.status === 403) {
        setIsLoggedIn(false);
        setCheckExists(false);
        setInvalidCredentials(true);
      }
    } catch (err) {
      console.log("Error at login.jsx", err);
    } finally {
      setIsHashed(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGoogleAuth(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: formData,
          isHashedRegular: checkIsHashed || false,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.message === 'success') {
          const path = `/${data.params}${isHashed ? `?hashed=${isHashed}` : ''}`;
          navigate(path);

          Cookies.set("accessToken", data.accessToken);
          setIsLoggedIn(true);
          setCheckCookie(Cookies.get("accessToken"));
        }
      } else if (response.status === 403 || response.status === 401) {
        setWrongPassword(true);
      }
    } catch (err) {
      console.log("Error logging in", err);
    } finally {
      setIsGoogleAuth(true);
    }
  };

  useEffect(() => {
    if (isHashed) {
      setIsHashed(true);
    }
  }, [isHashed]);

  return (
    <>
<section >
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-white-800 dark:border-gray-700">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
          Login to your account
        </h1>

        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
              Your email
            </label>

            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg dark:bg-white-700 dark:border-gray-600 dark:text-white block w-full p-2.5"
              placeholder="name@company.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg dark:bg-white-700 dark:border-gray-600 dark:text-white block w-full p-2.5"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 bg-gray-50 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-black">
                Remember me
              </label>
            </div>
            <Link to="/forgetPassword" className="text-sm font-medium text-black-600 hover:underline dark:text-black-500">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="w-full text-white color hover:bg-gray-700 rounded-lg p-2.5">
            Sign in
          </button>

        </form>

        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log("Google Login Failed")} />
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Don’t have an account yet?{" "}
          <Link to="/signUp" className="font-medium text-black-600 hover:underline dark:text-black-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>
</section>

    </>
  );
}

export default Login;
