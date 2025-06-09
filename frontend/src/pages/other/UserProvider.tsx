import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { BACKEND_URL } from "../../config";
import { useNavigate } from "react-router-dom";

interface User {
    _id: string,
    name: string,
    email: string,
    imageUrl: string
}

type UserContextType = {
    user: User | null
    login: () => Promise<void>
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null)

interface UserProviderProps {
    children: React.ReactNode;
}

const UserProvider = ({children}: UserProviderProps) => {
    const [user, setUser] = useState<User | null>(null)
    const navigate = useNavigate()

    const login = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/auth/me`, {
                withCredentials: true
            });

            console.log(res)
            setUser(res.data.user)
        } catch (err) {
            console.error("Failed to fetch user", err)
        }
    }

    const logout = async () => {
        try {
            await axios.post(`${BACKEND_URL}/auth/logout`, {}, {
                withCredentials: true
            })
            setUser(null)
            navigate('/')
        } catch (err) {
            console.error("Failed to logout", err)
        }
    }

    useEffect(() => {
        login()
    }, [])

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};