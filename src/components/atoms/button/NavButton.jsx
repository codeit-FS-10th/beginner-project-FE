import React from "react";
import { ArrowIcon } from "../../../assets/Icons";
import "@styles/atoms/navButton.css";

const NavButton = ({ children, onClick }) => {
    return (
        <button type="button" className="nav-btn" onClick={onClick}>
            <span>{children}</span>
            <ArrowIcon />
        </button>
    );
};

export default NavButton;
