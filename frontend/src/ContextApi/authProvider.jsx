import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useLogin } from './loginContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { setIsLoggedIn } = useLogin()
    const [refreshToken, setRefreshToken] = useState(null);
    const [isGoogleAuth, setIsGoogleAuth] = useState(true);
    const [formData, setFormData] = useState(
        {
            email: "",
            password: "",
        }
    );
    const [adminFormData,setAdminFormData] = useState({
        secretCode: "",
        email: "",
        password: ""
    })
    const [adminRefreshToken,setAdminRefreshToken] = useState(null)
    const [checkCookie,setCheckCookie] = useState(null)
    const [googleFormData, setGoogleFormData] = useState({
        googleAuthName: "",
        googleAuthEmail: "",
    });
  

    useEffect(() => {
        const cookieCheck = Cookies.get("accessToken");

        if (!cookieCheck) {
            const giveAccessToken = async () => {
                try {
                    if (!refreshToken) return;

                    const res = await fetch(`${import.meta.env.VITE_APP_URL}/refresh`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(isGoogleAuth ? {...googleFormData,...refreshToken }: {...formData,...refreshToken}),
                    });

                    if (res.ok) {
                        const data = await res.json();
                          const cookie =  Cookies.get("accessToken", data.accessToken);
                           setCheckCookie(cookie)
                        setIsLoggedIn(true);
                    }
                } catch (err) {
                    console.log("Error refreshing token", err);
                }
            };

            giveAccessToken();
        }
    }, [checkCookie]);

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
