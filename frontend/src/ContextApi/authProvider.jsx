import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useLogin } from './loginContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { setIsLoggedIn } = useLogin();
    const [refreshToken, setRefreshToken] = useState(() => Cookies.get("refreshToken") || null);
    const [adminRefreshToken, setAdminRefreshToken] = useState(() => Cookies.get("adminRefreshToken") || null);

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
    const [checkCookie, setCheckCookie] = useState(null);
    const [googleFormData, setGoogleFormData] = useState({
        googleAuthName: "",
        googleAuthEmail: "",
    });

    useEffect(() => {
        const cookieCheck = Cookies.get("accessToken");

        if (!cookieCheck && refreshToken) {
            const giveAccessToken = async () => {
                try {
                    const res = await fetch(`${import.meta.env.VITE_APP_URL}/refresh`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(isGoogleAuth ? { ...googleFormData, refreshToken } : { ...formData, refreshToken }),
                    });

                    if (res.ok) {
                        const data = await res.json();
                        
                        console.log("refresh executed")
                        Cookies.set("accessToken", data.accessToken);
                        setIsLoggedIn(true);
                        setCheckCookie(Cookies.get("accessToken"));
                    } else {
                        // If the refresh token is invalid or expired, remove it and log out
                        Cookies.remove("refreshToken");
                        Cookies.remove("accessToken");
                        setIsLoggedIn(false);
                        setRefreshToken(null);
                    }
                } catch (err) {
                    console.log("Error refreshing token", err);
                    // Handle token refresh failure, perhaps log the user out
                    Cookies.remove("refreshToken");
                    Cookies.remove("accessToken");
                    setIsLoggedIn(false);
                    setRefreshToken(null);
                }
            };

            giveAccessToken();
        }
    }, [refreshToken, isGoogleAuth, googleFormData, formData]);

    return (
        <AuthContext.Provider value={{
            isGoogleAuth,
            formData,
            setRefreshToken,
            setFormData,
            setGoogleFormData,
            setIsGoogleAuth,
            setCheckCookie,
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
