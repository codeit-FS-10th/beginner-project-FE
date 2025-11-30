import Tag from "@atoms/tag/Tag";
import "@styles/pages/focus.css";
import { useState } from "react";
import TimerButton from "../components/atoms/button/TimerButton";
import NavButton from "@atoms/button/NavButton";

function Focus() {
    const [focusMinutes, setFocusMinutes] = useState(25);

    const formatTime = (minutes) => {
        const m = String(minutes).padStart(2, "0");
        const s = "00";
        return `${m}:${s}`;
    };

    return (
        <div className="focus-container">
            <div className="focus-content">
                <div className="focus-content-header">
                    <div className="focus-header-title">
                        <h2>연우의 개발공장</h2>
                    </div>
                    <div className="focus-content-button">
                        <NavButton to={"/habit"}>오늘의 습관</NavButton>
                        <NavButton to={"/"}>홈</NavButton>
                    </div>
                </div>

                <div>
                    <p className="focus-total-point">현재 까지 획득한 포인트</p>
                    <Tag type="point" value="30" theme="light" />
                </div>

                <div className="focus-today">
                    <div className="focus-box">
                        <h2>오늘의 집중</h2>
                    </div>
                    <div class="focus-timmer">{formatTime(focusMinutes)}</div>
                    <div class="focus-start-button">
                        <TimerButton size="lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Focus;
