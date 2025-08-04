import React, { useEffect, useState } from "react";
import styles from "../css/Sidebar.module.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import logo from "../assets/bg-ladingicons.png";
import dulieuthucpham from "../assets/images/dulieuthucpham.png";

const Sidebar = () => {
    const [expandedMenu, setExpandedMenu] = useState(null);

    const toggleSubmenu = (menuKey) => {
        setExpandedMenu(expandedMenu === menuKey ? null : menuKey);
    };

    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);
    const images = import.meta.glob('../assets/images/*', { eager: true, import: 'default' });
    const getImage = (name) => images[`../assets/images/${name}`];
    return (
        <section id="sidebar-section">
            <aside className={styles.sidebar}>
                <header className={styles["sidebar-header"]}>
                    <a href="#home" className={styles.logoWrapper}>
                        <img src={logo} alt="Logo" className={styles.logoImage} />
                    </a>
                </header>

                <nav className={styles["main-nav"]}>
                    <ul>
                        <li className={styles["nav-item"]}>
                            <a href="#dashboard" className={styles["nav-link"]}>
                                <img src={getImage('trangchu.svg')} alt="Dashboard Icon" className={styles["nav-icon"]} />
                                <span className={styles["nav-label"]}>Trang Chủ</span>
                            </a>
                        </li>
                        <li className={styles["nav-item"]}>
                            <a href="#dashboard" className={styles["nav-link"]}>
                                <img src={getImage('pheduyet.svg')} alt="approved Icon" className={styles["nav-icon"]} />
                                <span className={styles["nav-label"]}>Phê Duyệt</span>
                            </a>
                        </li>

                        {/* Dữ liệu thực phẩm */}
                        <li className={styles["nav-item"]}>
                            <button className={styles.expandBtn} onClick={() => toggleSubmenu("du-lieu")}>
                                <img src={dulieuthucpham} alt="Icon" className={styles["nav-icon"]} />
                                Dữ liệu thực phẩm {expandedMenu === "du-lieu" ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            {expandedMenu === "du-lieu" && (
                                <ul className={styles.nacList}>
                                    <li className={styles["nav-link"]}>
                                        <img src={getImage('nguyenlieu.svg')} alt="Icon" className={styles["nav-icon"]} />
                                        <a href="#nguyen-lieu">Nguyên liệu</a></li>
                                    <li className={styles["nav-link"]}>
                                        <img src={getImage('monan.svg')} alt="Icon" className={styles["nav-icon"]} />
                                        <a href="#mon-an">Món ăn</a></li>
                                    <li className={styles["nav-link"]}>
                                        <img src={getImage('thucdon.svg')} alt="Icon" className={styles["nav-icon"]} />
                                        <a href="#bua-an">Bữa ăn</a></li>
                                    <li className={styles["nav-link"]}>
                                        <img src={getImage('menu.png')} alt="Icon" className={styles["nav-icon"]} />
                                        <a href="#thuc-don">Thực đơn</a></li>
                                </ul>
                            )}
                        </li>
                        {/* Quản lý bệnh nhân */}
                        <li className={styles["nav-item"]}>
                            <button className={styles.expandBtn} onClick={() => toggleSubmenu("benh-nhan")}>
                                <img src={getImage('hosobenhnhan.png')} alt="Icon" className={styles["nav-icon"]} />
                                Bệnh nhân {expandedMenu === "benh-nhan" ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            {expandedMenu === "benh-nhan" && (
                                <ul className={styles.nacList}>
                                    <li className={styles["nav-link"]}>
                                        <img src={getImage('benhnhan.png')} alt="Icon" className={styles["nav-icon"]} />
                                        <a href="#benh-nhan">Hồ sơ bệnh nhân</a></li>
                                    <li className={styles["nav-link"]}>
                                        <img src={getImage('nhombenh.svg')} alt="Icon" className={styles["nav-icon"]} />
                                        <a href="#nhom-benh">Nhóm bệnh</a></li>
                                </ul>
                            )}
                        </li>

                        {/* Hệ số & chuyển đổi */}
                        <li className={styles["nav-item"]}>
                            <button className={styles.expandBtn} onClick={() => toggleSubmenu("he-so")}>
                                <img src={getImage('chuyendoi.svg')} alt="Logout Icon" className={styles["nav-icon"]} />
                                Hệ số & chuyển đổi {expandedMenu === "he-so" ? <FaChevronUp /> : <FaChevronDown />}</button>
                            {expandedMenu === "he-so" && (
                                <ul className={styles.nacList}>
                                    <li className={styles["nav-link"]}>
                                        <img src={getImage('heso.svg')} alt="Icon" className={styles["nav-icon"]} />
                                        <a href="#song-chin">Sống chín & thải bỏ</a></li>
                                    <li className={styles["nav-link"]}>
                                        <img src={getImage('tinhtoan.svg')} alt="Logout Icon" className={styles["nav-icon"]} />
                                        <a href="#tinh-toan">Tính toán</a></li>
                                </ul>
                            )}
                        </li>

                        {/* Tra cứu & Gợi ý */}
                        <li className={styles["nav-item"]}>
                            <button className={styles.expandBtn} onClick={() => toggleSubmenu("tra-cuu")}>
                                <img src={getImage('timkiem.svg')} alt="Logout Icon" className={styles["nav-icon"]} />
                                Tra cứu & Gợi ý {expandedMenu === "tra-cuu" ? <FaChevronUp /> : <FaChevronDown />}
                                </button>
                            {expandedMenu === "tra-cuu" && (
                                <ul className={styles.nacList}>
                                    <li className={styles["nav-link"]}>
                                        <img src={getImage('goiy.svg')} alt="Logout Icon" className={styles["nav-icon"]} />
                                        <a href="#tra-cuu">Tra cứu</a></li>
                                    <li className={styles["nav-link"]}>
                                        <img src={getImage('chatbot.png')} alt="Logout Icon" className={styles["nav-icon"]} />
                                        <a href="#goi-y-ai">
                                            Gợi ý AI
                                        </a></li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>

                <div className={styles["promo-banner"]}>
                    <div className={styles["promo-images"]}>
                        <img src="images/3a0bd71665a59d099d1ea773f80e7b9cd646e001.png" alt="Lettuce illustration" className={styles["promo-img-lettuce"]} />
                        <img src="images/5bf03e9a1d7870b2d4781968483cd14855602761.png" alt="Carrot illustration" className={styles["promo-img-carrot"]} />
                    </div>
                    <p className={styles["promo-text"]}>Start your health journey with a <strong>FREE 1-month</strong> access to Nutrigo!</p>
                    <a href="#claim" className={styles["promo-button"]}>Claim Now!</a>
                </div>

                <a href="#logout" className={styles["logout-button"]}>
                    <img src={getImage('logout.svg')} alt="Logout Icon" className={styles["nav-icon"]} />
                    <span className={styles["nav-label"]}>Logout</span>
                </a>
            </aside>
        </section>
    );
};

export default Sidebar;