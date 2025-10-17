import { createContext, useContext, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const register = async (name, email, password) => {
        const res = await API.post("/auth/register", { name, email, password });
        return res.data;
    };

    const login = async (email, password) => {
        const res = await API.post("/auth/login", { email, password });
        localStorage.setItem("accessToken", res.data.token);
        setUser({ _id: res.data._id, name: res.data.name, email: res.data.email });
    };

    const logout = async () => {
        await API.post("/auth/logout");
        localStorage.removeItem("accessToken");
        setUser(null);
    };

    const refreshToken = async () => {
        try {
            const res = await API.post("/auth/refresh");
            localStorage.setItem("accessToken", res.data.token);
            return res.data.token;
        } catch {
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
