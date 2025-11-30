import React from "react";
import "@styles/atoms/basebutton.css";

const BaseButton = ({ children, type = "default", size = "md", ...props }) => {
    const typeClass = {
        default: "btn--type-default",
        cancel: "btn--type-cancel",
    }[type];
    const sizeClass = {
        xs: "btn--xs",
        sm: "btn--sm",
        md: "btn--md",
        lg: "btn--lg",
        xl: "btn--xl",
        full: "btn--full",
    }[size];

    return (
        <button className={`btn ${typeClass} ${sizeClass}`.trim()}>
            {children}
        </button>
    );
};

export default BaseButton;
