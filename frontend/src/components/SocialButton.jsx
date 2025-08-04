import React from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";

const SocialButton = ({ type }) => {
    const isGoogle = type === "google";

    return (
    <button className="social-btn">
        {isGoogle ? <FaGoogle className="icon" /> : <FaFacebookF className="icon" />}
        {isGoogle ? "Google" : "Facebook"}
    </button>
    );
};

export default SocialButton;
