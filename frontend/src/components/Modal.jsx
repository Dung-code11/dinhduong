import React from "react";
import styles from "../css/Modal.module.css";

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;