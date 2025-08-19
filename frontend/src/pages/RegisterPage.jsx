import React from "react";
import useForm from "../hooks/useForm";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/test-logo.png";
import logologin from "../assets/health.svg";
import styles from "../css/LoginPage.module.css"; // sử dụng CSS module

const RegisterPage = () => {
  const { values, handleChange } = useForm({
    fullName: "",   // ✅ phải là fullName, không phải fullname
    email: "",
    password: "",
    gender: "",         // ✅ chuẩn
    dob: "",         // ✅ chuẩn (date string, ví dụ: "2001-01-01")
    address: "",
  });
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await register(values);
      if (result === "Đăng ký thành công!") {
        alert("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
        window.location.href = "/login";
      } else {
        alert(result || "Đăng ký thất bại. Vui lòng thử lại.");
        console.error("Lỗi từ API:", result);
      }
    } catch (error) {
      console.error("Đăng ký lỗi:", error);
      alert("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className={styles["login-page"]}>
      <div className={styles["login-left"]}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1>Dinh Dưỡng Sức Khỏe</h1>
        <p>Tham gia để bắt đầu hành trình chăm sóc sức khỏe</p>
      </div>

      <div className={`${styles["login-right"]} ${styles["fade-in-up"]}`}>
        <div className={styles["login-card"]}>
          <img src={logologin} alt="RegisterLogo" className={styles["logologin"]} />
          <h2>Đăng ký tài khoản</h2>
          <p>Hãy điền đầy đủ thông tin để bắt đầu</p>

          <form onSubmit={handleSubmit}>
            <Input label="Họ và tên" name="fullName" value={values.fullName} onChange={handleChange} placeholder="Nhập họ tên đầy đủ" />
            <Input label="Email" type="email" name="email" value={values.email} onChange={handleChange} placeholder="Email cá nhân" />
            <Input label="Mật khẩu" type="password" name="password" value={values.password} onChange={handleChange} placeholder="Nhập mật khẩu" />

            {/* 👇 Nhóm radio chọn giới tính */}
            <div className={styles["input-group"]}>
              <label>Giới tính</label>
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="NAM"
                    checked={values.gender === "NAM"}
                    onChange={handleChange}
                  />
                  Nam
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="NU"
                    checked={values.gender === "NU"}
                    onChange={handleChange}
                  />
                  Nữ
                </label>
              </div>
            </div>


            <Input label="Ngày sinh" type="date" name="dob" value={values.dob} onChange={handleChange} />
            <Input label="Địa chỉ" name="address" value={values.address} onChange={handleChange} placeholder="Nhập địa chỉ liên hệ" />

            <Button type="submit">Đăng Ký</Button>
          </form>

          <p className={styles.signup}>
            Đã có tài khoản? <a href="/login">Đăng nhập</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
