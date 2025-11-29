import React from "react";
import "@styles/chip.css";

const Chip = ({ children, variant = "default", ...props }) => {
    const className = `chip chip-state--${variant}`.trim();
    return <div className={className}>{children}</div>;
};

export default Chip;
