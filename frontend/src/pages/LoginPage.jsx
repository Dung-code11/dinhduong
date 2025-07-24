import React from "react";
import useForm from "../hooks/useForm";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/react.svg";
import '../css/LoginPage.css';

const LoginPage = () => {
    const { values, handleChange } = useForm({
    email: '',
    password: ''
    });

    const {login} = useAuth();

    const handleSubmit = (e) =>{
        e.preventDefault();
        const success = login(values.email,values.password);
        if(success){
            console.log('Login Successfull');
            alert("Đăng Nhập Thành Công");
        } else{
            console.log('Login Failed');
            alert("Đăng Nhập Thất Bại");
        }
    };
    return (
        <div className="login-page">
            <header className="header">
                <img src={ logo } alt="Logo" className="logo" />
                <h1>Quản Lý Dinh Dưỡng</h1>
            </header>
            <div className="login-card">
                <h2>WELCOME BACK</h2>
                <form onSubmit={handleSubmit}>
                    <Input
                    label="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    type="email"
                    />
                    <Input
                    label="Password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    placeholder="Password"
                    type="password"
                    />
                    <Button type="submit">Đăng Nhập</Button>
                    </form>
                    <p><a href="#">Forgot your password?</a></p>
                    <p>Not a member? <a href="#">Đăng Ký</a></p>
            </div>
        </div>
    );
};
export default LoginPage;