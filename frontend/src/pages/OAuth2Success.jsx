import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuth2Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      console.log("token:", token);

      setTimeout(() => navigate("/dashboard"), 0); // hoặc navigate("/") tuỳ bạn
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p>Đang đăng nhập, vui lòng chờ...</p>;
}
