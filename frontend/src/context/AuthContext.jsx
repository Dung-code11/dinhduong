// src/context/AuthContext.js

import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = async (username, password) => {
        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                username,
                password,
            });

            const token = response.data.token;
            setToken(token);
            localStorage.setItem("token", token);
            setUser({ username }); // giả định backend không trả thông tin user

            navigate("/dashboard");
            return true;
        } catch (error) {
            console.error("Đăng nhập thất bại:", error.response?.data || error.message);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        navigate("/login");
    };

    const register = async (data) => {
    try {
        const response = await axios.post("http://localhost:8080/api/auth/register", data);

        // Trường hợp thành công
        return {
            success: true,
            message: response.data?.message || "Đăng ký thành công",
        };
    } catch (error) {
        console.error("Đăng ký lỗi:", error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Lỗi đăng ký",
        };
    }
};

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
