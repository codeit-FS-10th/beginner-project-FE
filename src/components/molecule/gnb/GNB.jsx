import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BaseButton from "@atoms/button/BaseButton";
import "@styles/molecule/gnb.css";
import useMediaQuery from "@hooks/seMediaQuery";

function GNB() {
    const location = useLocation();
    const navigate = useNavigate();

    const path = location.pathname;
    const isHome = path === "/";
    const isDetail = path === "/Detail";

    const showButton = isHome || isDetail;

    const isMax744 = useMediaQuery("(max-width: 744px)");
    const isMax480 = useMediaQuery("(max-width: 480px)");

    let buttonSize = "lg";
    if (isHome) {
        if (isMax480) buttonSize = "xs";
        else if (isMax744) buttonSize = "md";
    }

    const handleLogoClick = () => {
        if (isHome) {
            // 홈이면 검색/정렬 초기화를 위해 새로고침
            navigate(0); // 또는 window.location.reload();
        } else {
            // 홈이 아니면 홈으로 이동
            navigate("/");
        }
    };

    return (
        <header className="gnb-header">
            <nav
                className={`gnb ${isHome ? "gnb--home" : ""} ${
                    isDetail ? "gnb--detail" : ""
                }`.trim()}
            >
                <img
                    className="gnb-logo"
                    src="/img/img_logo.png"
                    alt="logo"
                    onClick={handleLogoClick}
                    style={{ cursor: "pointer" }}
                />

                <div className="gnb-right">
                    {showButton && !(isDetail && isMax744) && (
                        <BaseButton
                            size={buttonSize}
                            onClick={() => navigate("/Study")}
                        >
                            스터디 만들기
                        </BaseButton>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default GNB;
