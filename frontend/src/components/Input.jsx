import React from "react";
import styles from "../css/LoginPage.module.css"; // CSS module chuẩn

const Input = ({ label, type = "text", name, value = "", onChange, placeholder }) => {
  return (
    <div className={styles["input-group"]}>
      {label && (
        <label htmlFor={name} className={styles["label"]}>
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value ?? ""} // ✅ đảm bảo không bị undefined
        onChange={onChange}
        placeholder={placeholder}
        className={styles["input"]}
      />
    </div>
  );
};

export default Input;
