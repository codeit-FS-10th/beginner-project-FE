import React from "react";
import { Link } from "react-router-dom";
import { ArrowIcon } from "../../../assets/Icons";
import "../../../assets/styles/navButton.css";

const NavButton = ({ children, to }) => {
  return (
    <Link to={to} className="nav-btn">
      <span> {children}</span>

      <ArrowIcon />
    </Link>
  );
};

export default NavButton;
