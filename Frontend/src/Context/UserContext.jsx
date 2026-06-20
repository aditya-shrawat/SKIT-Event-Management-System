import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { createContext } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const BackendURL = import.meta.env.VITE_backendURL;
                const response = await axios.get(`${BackendURL}/user/me`, {
                    withCredentials: true
                });
                setUser(response.data);
                console.log("User fetched successfully", response.data);
            } catch (error) {
                setUser(null);
                if (error.response?.status !== 401) {
                    console.error("User fetch error", error);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchUserInfo();
    }, []);

    const authAxios = (config) => {
        return axios({ ...config, withCredentials: true });
    };

    const logout = async () => {
        const BackendURL = import.meta.env.VITE_backendURL;
        await axios.post(`${BackendURL}/user/logout`, {}, { withCredentials: true });
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, authAxios, logout }}>
            {children}
        </UserContext.Provider>
    )
};

export const useUser = () => useContext(UserContext);