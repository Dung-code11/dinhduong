import React from "react";

const Input = ({ label, type =" text",name,value,onChange,placeholder})=>(
    <div className = "input-group">
        <label>{label}</label>
        <input
            type={type}
            name = {name}
            value = {value}
            onChange={onChange}
            placeholder={placeholder}
            required />
    </div>
);

export default Input;