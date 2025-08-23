import React from "react";
import useForm from "../hooks/useForm";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/test-logo.png";
import logologin from "../assets/health.svg";
import styles from "../css/LoginPage.module.css"; // CSS Module
// import { useGoogleLogin } from "@react-oauth/google";
// import axios from "axios";

const LoginPage = () => {
  const { values, handleChange } = useForm({ username: "", password: "" });
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(values.username, values.password);
    if (success) {
      alert("Đăng Nhập Thành Công");
    } else {
      alert("Đăng Nhập Thất Bại");
    }
  };
  // const handleGoogleSuccess = async (credentialResponse) => {
  //   try {
  //     // token từ Google
  //     const googleToken = credentialResponse.credential;

  //     // Gửi token lên backend để verify và tạo JWT
  //     const res = await axios.post("http://localhost:8080/api/auth/google-success", {
  //       token: googleToken,
  //     });

  //     const jwt = res.data.token;
  //     localStorage.setItem("token", jwt);

  //     console.log("Đăng nhập Google thành công!", res.data);
  //     window.location.href = "/dashboard";
  //   } catch (err) {
  //     console.error("Lỗi đăng nhập Google:", err);
  //   }
  // };
  // const handleGoogleError = () => {
  //   console.error("Google Login thất bại");
  // };
  // const logingoogle = useGoogleLogin({
  //   onSuccess: handleGoogleSuccess,
  //   onError: handleGoogleError,
  // });
  return (
    <div className={styles["login-page"]}>
      <div className={styles["login-left"]}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1>Dinh Dưỡng Sức Khỏe</h1>
        <p>Nâng cao sức khỏe, cải thiện cuộc sống</p>
      </div>

      <div className={`${styles["login-right"]} ${styles["fade-in-up"]}`}>
        <div className={styles["login-card"]}>
          <img src={logologin} alt="Logologin" className={styles["logologin"]} />
          <h2>Chào mừng trở lại</h2>
          <p>Đăng nhập để tiếp tục hành trình sức khỏe của bạn</p>

          <form onSubmit={handleSubmit}>
            <Input
              label="Tên đăng nhập"
              type="text"
              name="username"
              value={values.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
            />
            <Input
              label="Mật khẩu"
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
            />

            <div className={styles["form-footer"]}>
              <label>
                <input type="checkbox" /> Ghi nhớ đăng nhập
              </label>
              <a href="#">Quên mật khẩu?</a>
            </div>

            <Button type="submit">Đăng Nhập</Button>
          </form>

          <div className={styles["divider"]}>Hoặc đăng nhập với</div>
          <div className={styles["social-login"]}>

            <button
              className={`${styles["social-btn"]} ${styles["google"]}`}
              onClick={() => {
                window.location.href = "http://localhost:8080/oauth2/authorization/google";
              }}
            >
              G
            </button>
            <button
              className={`${styles["social-btn"]} ${styles["facebook"]}`}
              onClick={() => {
                window.location.href = "http://localhost:8080/oauth2/authorization/facebook";
              }}
            >
              f
            </button>

          </div>

          <p className={styles["signup"]}>
            Bạn chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
          </p>
          <p className={styles["copyright"]}>
            © 2025 Nutricare Pro – Bản quyền thuộc về hệ thống phân tích dinh dưỡng.
            Bảo lưu mọi quyền.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
