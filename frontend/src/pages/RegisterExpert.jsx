import React, { useState } from "react";
import useForm from "../hooks/useForm";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import styles from "../css/RegisterExpert.module.css";
import 'font-awesome/css/font-awesome.min.css';
import logo from "../assets/logosingle.png"

const RegisterExpertPage = () => {
    const { values, handleChange } = useForm({
        degree: "",
        position: "",
        workplace: "",
        workField: "",
        phone: "",
        status: "CHO_DUYET",
        isExpert: true,
    });

    const [files, setFiles] = useState([]);
    const { registerExpert } = useAuth();

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) =>
                formData.append(key, value)
            );
            files.forEach((file) => formData.append("documents", file));

            const result = await registerExpert(formData);

            if (result?.success) {
                alert("Đăng ký chuyên gia thành công!");
                window.location.href = "/login";
            } else {
                alert(result?.message || "Đăng ký thất bại.");
            }
        } catch (err) {
            console.error(err);
            alert("Đã xảy ra lỗi.");
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <img src={logo} alt="Logo" className={styles.logo} />
                <h2 className={styles.heading}>Đăng ký chuyên gia</h2>
                <div className={styles.formGrid}>
                    <div className={styles.column}>
                        {/* Degree select */}
                        <label className={styles.label}>
                            🎓 Trình độ học vấn <span className={styles.required}>*</span>
                            <select
                                name="degree"
                                value={values.degree}
                                onChange={handleChange}
                                required
                                className={styles.select}
                            >
                                <option value="">-- Chọn trình độ --</option>
                                <option value="Cử nhân">Cử nhân</option>
                                <option value="Thạc sĩ">Thạc sĩ</option>
                                <option value="Tiến sĩ">Tiến sĩ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </label>

                        {/* Position select */}
                        <label className={styles.label}>
                            💼 Nghề nghiệp / Vị trí công tác <span className={styles.required}>*</span>
                            <select
                                name="position"
                                value={values.position}
                                onChange={handleChange}
                                required
                                className={styles.select}
                            >
                                <option value="">-- Chọn vị trí --</option>
                                <option value="Bác sĩ">Bác sĩ</option>
                                <option value="Dược sĩ">Dược sĩ</option>
                                <option value="Chuyên gia dinh dưỡng">Chuyên gia dinh dưỡng</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </label>

                        <label className={styles.label}>
                            🏢 Đơn vị công tác <span className={styles.required}>*</span>
                        <Input
                            name="workplace"
                            placeholder="Nhập tên cơ quan,bệnh viện,..."
                            value={values.workplace}
                            onChange={handleChange}
                            required
                        />
                        </label>

                        {/* WorkField select */}
                        <label className={styles.label}>
                            📋 Lĩnh vực công tác <span className={styles.required}>*</span>
                            <select
                                name="workField"
                                value={values.workField}
                                onChange={handleChange}
                                required
                                className={styles.select}
                            >
                                <option value="">-- Chọn lĩnh vực --</option>
                                <option value="Dinh dưỡng lâm sàng">Dinh dưỡng lâm sàng</option>
                                <option value="Y tế công cộng">Y tế công cộng</option>
                                <option value="Nghiên cứu khoa học">Nghiên cứu khoa học</option>
                                <option value="Giảng dạy">Giảng dạy</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </label>

                        <label className={styles.label}>
                            📞 Số điện thoại <span className={styles.required}>*</span>
                        <Input
                            name="phone"
                            placeholder="VD: 0987654321"
                            value={values.phone}
                            onChange={handleChange}
                            required
                        />
                        </label>
                        <div className={styles.checkboxContainer}>
                            <input type="checkbox" required />
                            <label>Tôi cam kết thông tin là chính xác</label>
                        </div>
                    </div>
                </div>

                <div className={styles.note}>
                    ⚠️ <strong>Lưu ý:</strong> Hồ sơ của bạn sẽ được xem xét và phê duyệt trong thời gian sớm nhất.
                </div>

                <div className={styles["button-container"]}>
                    <button
                        type="button"
                        className={styles["button-back"]}
                        onClick={() => window.history.back()}
                    >
                        <i className="fa fa-arrow-left"></i> Trở lại
                    </button>

                    <button
                        type="submit"
                        className={styles["button-submit"]}
                    >
                        <i className="fa fa-check"></i> Đăng ký
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterExpertPage;
