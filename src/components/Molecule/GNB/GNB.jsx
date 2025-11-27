import React from "react";
import BaseButton from "../../Atoms/button/BaseButton/BaseButton";
import { Link, useLocation } from "react-router-dom";
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

  const location = useLocation();
  const hideButtonPath = ["/studydetail", "/todayhabit", "/todayfocus"];
  const hideButton = hideButtonPath.includes(location.pathname);

  return (
    <nav className={`gnb ${gnbClass}`}>
      <Link to="/">
        <img className={logoClass} src="/Icons/img_logo.png" alt="logo" />
      </Link>
      {!hideButton && (
        <Link to="/">
          <BaseButton size={btnSize}>스터디 만들기</BaseButton>
        </Link>
      )}
    </nav>
  );
};

export default GNB;
