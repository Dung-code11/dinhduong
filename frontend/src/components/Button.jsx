import React from "react";

const Button = ({ children, ...props }) => (
    <button className="btn" {...props}>
    {children}
    </button>
);

export default Button;
