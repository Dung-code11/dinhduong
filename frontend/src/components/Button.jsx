import React from "react";

const Button = ({children, ...props}) =>(
    <Button className="btn" {...props}>
        {children}
    </Button>
);
export default Button;