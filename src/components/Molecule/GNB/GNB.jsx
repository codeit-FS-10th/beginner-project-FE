import React from "react";
import { Link, useLocation } from "react-router-dom";
import BaseButton from "../../Atoms/button/BaseButton";
import "../../../assets/styles/gnb.css";
import useMediaQuery from "../../hooks/seMediaQuery";

function GNB() {
  const location = useLocation();
  const path = location.pathname;

  const isHome = path === "/";
  const isDetail = path === "/Detail";

  const showButton = isHome || isDetail;

  const isMax744 = useMediaQuery("(max-width: 744px)");
  const isMax375 = useMediaQuery("(max-width: 375px)");

  let buttonSize = "lg";

  if (isHome) {
    if (isMax375) {
      buttonSize = "xs";
    } else if (isMax744) {
      buttonSize = "md";
    } else {
      buttonSize = "lg";
    }
  } else if (isDetail) {
    buttonSize = "lg";
  }

  return (
    <header className="gnb-header">
      <nav
        className={`gnb ${isHome ? "gnb--home" : ""} ${
          isDetail ? "gnb--detail" : ""
        }`.trim()}
      >
        <Link to="/">
          <img className="gnb-logo" src="/img/img_logo.png" alt="logo" />
        </Link>

        <div className="gnb-right">
          {showButton && !(isDetail && isMax744) && (
            <Link to="/Study">
              <BaseButton size={buttonSize}>스터디 만들기</BaseButton>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default GNB;
