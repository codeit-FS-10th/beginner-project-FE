import React from "react";
import BaseButton from "../../Atoms/button/BaseButton/BaseButton";
import { Link } from "react-router-dom";
import "./gnb.css";

const GNB = ({ size = "md" }) => {
  const gnbClass = {
    sm: "gnb--sm",
    md: "gnb--lg",
    lg: "gnb--lg",
  }[size];

  const logoClass = {
    sm: "logo--sm",
    md: "logo--lg",
    lg: "logo--lg",
  }[size];

  const btnSize = {
    sm: "xs",
    md: "md",
    lg: "lg",
  }[size];

  return (
    <nav className={`gnb ${gnbClass}`}>
      <Link to="/">
        <img className={logoClass} src="/Icons/img_logo.png" alt="logo" />
      </Link>
      <Link to="/">
        <BaseButton size={btnSize}>스터디 만들기</BaseButton>
      </Link>
    </nav>
  );
};

export default GNB;
