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

    const register = async (values) => {
        try {
            const response = await axios.post("http://localhost:8080/api/auth/register", {
                fullName: values.fullName,
                dob: values.dob,
                gender: values.gender,       // đổi sex → gender
                address: values.address,
                email: values.email,
                password: values.password,
            });

            console.log("Đăng ký thành công:", response.data);
            return response.data;
        } catch (error) {
            console.error("Đăng ký lỗi:", error.response?.data || error.message);
            throw error;
        }
    };


    return (
        <AuthContext.Provider value={{ user, token, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
