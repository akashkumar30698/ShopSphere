import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useLogin } from './loginContext';
import { checkCookie } from '../utils/checkCookie'; // ✅ Ensure function is correctly imported

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { setIsLoggedIn } = useLogin();
    const [refreshToken, setRefreshToken] = useState(null);
    const [adminRefreshToken, setAdminRefreshToken] = useState(null);
    
    const [isGoogleAuth, setIsGoogleAuth] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [adminFormData, setAdminFormData] = useState({
        secretCode: "",
        email: "",
        password: ""
    });

    const [cookieStatus, setCookieStatus] = useState(null); // ✅ Renamed state variable to avoid conflict
    const [googleFormData, setGoogleFormData] = useState({
        googleAuthName: "",
        googleAuthEmail: "",
    });

    useEffect(() => {
        const check = async () => {
            const cookieExists = await checkCookie("accessToken"); // ✅ Now correctly calling function

            if (!cookieExists && refreshToken) {
                const giveAccessToken = async () => {
                    try {
                        const res = await fetch(`${import.meta.env.VITE_APP_URL}/refresh`, {
                            method: 'POST',
                            credentials: 'include',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(
                                isGoogleAuth ? { ...googleFormData, refreshToken } : { ...formData, refreshToken }
                            ),
                        });

                        if (res.ok) {
                            const data = await res.json();

                            console.log("refresh executed");
                            Cookies.set("accessToken", data.accessToken);
                            setIsLoggedIn(true);
                            setCookieStatus(Cookies.get("accessToken")); // ✅ Using new state variable
                        } else {
                            // If refresh token is invalid or expired, remove and log out
                            Cookies.remove("refreshToken");
                            Cookies.remove("accessToken");
                            setIsLoggedIn(false);
                            setRefreshToken(null);
                        }
                    } catch (err) {
                        console.log("Error refreshing token", err);
                        // Handle token refresh failure, log user out
                        Cookies.remove("refreshToken");
                        Cookies.remove("accessToken");
                        setIsLoggedIn(false);
                        setRefreshToken(null);
                    }
                };

                giveAccessToken();
            }
        };

        check();
    }, [refreshToken, isGoogleAuth, googleFormData, formData]);

    return (
        <AuthContext.Provider value={{
            isGoogleAuth,
            formData,
            setRefreshToken,
            setFormData,
            setGoogleFormData,
            setIsGoogleAuth,
            setCookieStatus, // ✅ Updated state variable name
            adminRefreshToken,
            setAdminFormData,
            adminFormData,
            setAdminRefreshToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    return useContext(AuthContext);
};
