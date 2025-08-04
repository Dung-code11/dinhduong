import React from "react";
import styles from "../css/LandingPage.module.css";
import logo from "../assets/bg-ladingicons.png";

function LandingPage() {
  return (
    <div className={styles.landingPage}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={logo} alt="Logo" />
        </div>

        <nav className={styles.nav}>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#product">Product</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className={styles.authButtons}>
          <a href="/register" className={styles.signup}>Sign up</a>
          <a href="/login" className={styles.signin}>Sign in</a>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.heroText}>
          <h1>
            <span>Phân tích khẩu phần ăn và vi chất</span> chuẩn y khoa
          </h1>
          <p>
            Từ năng lượng đến vi chất như sắt, canxi, vitamin…,
            hệ thống giúp bạn phân tích khẩu phần ăn, theo dõi sức khỏe và đưa ra quyết định chính xác hơn trong điều trị dinh dưỡng.
          </p>
          <button className={styles.ctaButton}>Tìm hiểu thêm</button>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
