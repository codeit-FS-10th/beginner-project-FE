import { useEffect, useState } from "react";
import Tag from "@atoms/tag/Tag";
import "@styles/pages/focus.css";
import TimerButton from "../components/atoms/button/TimerButton";
import NavButton from "@atoms/button/NavButton";
import PencilIcon from "@assets/Icons/PencilIcon";

const PHASE = {
    READY: "ready",
    RUNNING: "running",
    PAUSED: "paused",
    FINISHED: "finished",
};

function Focus() {
    // 수정 가능한 분 단위
    const [focusMinutes, setFocusMinutes] = useState(25);

    // 실제 카운트다운 초
    const [remainSeconds, setRemainSeconds] = useState(focusMinutes * 60);

    // ready / running / paused / finished
    const [phase, setPhase] = useState(PHASE.READY);

    // 총 포인트
    const [totalPoint, setTotalPoint] = useState(30);

    // 포인트 토스트
    const [lastEarnedPoint, setLastEarnedPoint] = useState(0);
    const [isToastVisible, setIsToastVisible] = useState(false);

    // Pause 토스트
    const [isPauseToastVisible, setIsPauseToastVisible] = useState(false);

    // 수정 모드
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(String(focusMinutes));

    // MM:SS 또는 -MM:SS 포맷
    const formatTime = (seconds) => {
        const abs = Math.abs(seconds);
        const m = String(Math.floor(abs / 60)).padStart(2, "0");
        const s = String(abs % 60).padStart(2, "0");
        return seconds < 0 ? `-${m}:${s}` : `${m}:${s}`;
    };

    // Start: ready 또는 paused에서 running으로
    const handleStart = () => {
        if (
            (phase === PHASE.READY || phase === PHASE.PAUSED) &&
            remainSeconds > 0
        ) {
            setPhase(PHASE.RUNNING);
        }
    };

    // Pause
    const handlePause = () => {
        if (phase === PHASE.RUNNING) {
            setPhase(PHASE.PAUSED);
            setIsPauseToastVisible(true);
        }
    };

    // Restart
    const handleRestart = () => {
        setPhase(PHASE.READY);
        setRemainSeconds(focusMinutes * 60);
    };

    //  Stop → 포인트 계산 → Toast → ready 리셋
    const handleStop = () => {
        if (phase !== PHASE.FINISHED) return;

        // remainSeconds는 음수 (예: -25, -40 ...)
        const overtimeSeconds = Math.abs(remainSeconds);

        // 기본 포인트 3점
        const basePoint = 3;
        // 추가 포인트: 10초당 1점
        const extraPoint = Math.floor(overtimeSeconds / 10);
        const earned = basePoint + extraPoint;

        setLastEarnedPoint(earned);
        setTotalPoint((prev) => prev + earned);
        setIsToastVisible(true);

        // ready로 리셋
        setPhase(PHASE.READY);
        setRemainSeconds(focusMinutes * 60);
    };

    // 카운트다운: running + finished 상태에서 초 흐르기
    useEffect(() => {
        const isTicking = phase === PHASE.RUNNING || phase === PHASE.FINISHED;
        if (!isTicking) return;

        const id = setInterval(() => {
            setRemainSeconds((prev) => {
                const next = prev - 1;

                // running → finished 전환 시점
                if (prev > 0 && next <= 0) {
                    setPhase(PHASE.FINISHED);
                }

                return next; // finished에서는 계속 마이너스로
            });
        }, 1000);

        return () => clearInterval(id);
    }, [phase]);

    // 10초 이하 빨간색(running + paused)
    const isDangerTime =
        (phase === PHASE.RUNNING || phase === PHASE.PAUSED) &&
        remainSeconds <= 10 &&
        remainSeconds > 0;

    const timerClassName = [
        "focus-timmer",
        isDangerTime && "focus-timmer--danger",
        phase === PHASE.FINISHED && "focus-timmer--finished",
    ]
        .filter(Boolean)
        .join(" ");

    // 포인트 Toast 자동 숨김
    useEffect(() => {
        if (!isToastVisible) return;
        const id = setTimeout(() => setIsToastVisible(false), 3000);
        return () => clearTimeout(id);
    }, [isToastVisible]);

    // Pause Toast 자동 숨김
    useEffect(() => {
        if (!isPauseToastVisible) return;
        const id = setTimeout(() => setIsPauseToastVisible(false), 3000);
        return () => clearTimeout(id);
    }, [isPauseToastVisible]);

    return (
        <>
            <div className="focus-container">
                <div className="focus-content">
                    {/* Header */}
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
                        <p className="focus-total-point">
                            현재 까지 획득한 포인트
                        </p>
                        <Tag type="point" value={totalPoint} theme="light" />
                    </div>

                    {/* 타이머 박스 */}
                    <div className="focus-today">
                        <div className="focus-box">
                            <h2>오늘의 집중</h2>
                        </div>

                        {/* 타이머 수정 & 표시 */}
                        <div className="focus-timmer-wrap">
                            {/* ✏ 버튼은 ready에서만 */}
                            {phase === PHASE.READY && !isEditing && (
                                <button
                                    type="button"
                                    className="focus-timer-edit-btn"
                                    onClick={() => {
                                        setEditValue(String(focusMinutes));
                                        setIsEditing(true);
                                    }}
                                >
                                    <PencilIcon />
                                </button>
                            )}

                            {/* 타이머 숫자 */}
                            <div className={timerClassName}>
                                {formatTime(remainSeconds)}
                            </div>

                            {/* 시간 수정 input (ready + editing) */}
                            {phase === PHASE.READY && isEditing && (
                                <div className="focus-timer-edit-input">
                                    <input
                                        type="number"
                                        min={1}
                                        value={editValue}
                                        onChange={(e) =>
                                            setEditValue(e.target.value)
                                        }
                                    />
                                    <span>:00</span>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const num = Number(editValue);
                                            if (
                                                !Number.isFinite(num) ||
                                                num <= 0
                                            ) {
                                                alert("1분 이상 입력해주세요.");
                                                return;
                                            }

                                            setFocusMinutes(num);
                                            setRemainSeconds(num * 60);
                                            setIsEditing(false);
                                        }}
                                    >
                                        확인
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditValue(String(focusMinutes));
                                        }}
                                    >
                                        취소
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 버튼 영역 */}
                        <div className="focus-start-button">
                            {phase === PHASE.FINISHED ? (
                                // finished는 Stop만
                                <TimerButton
                                    variant="stop"
                                    size="lg"
                                    status="active"
                                    onClick={handleStop}
                                />
                            ) : (
                                <>
                                    {/* Pause 버튼 */}
                                    {(phase === PHASE.RUNNING ||
                                        phase === PHASE.PAUSED) && (
                                        <TimerButton
                                            variant="pause"
                                            size="sm"
                                            status={
                                                phase === PHASE.RUNNING
                                                    ? "active"
                                                    : "inactive"
                                            }
                                            onClick={handlePause}
                                        />
                                    )}

                                    {/* Start 버튼 */}
                                    <TimerButton
                                        variant="start"
                                        size="lg"
                                        status={
                                            phase === PHASE.READY ||
                                            phase === PHASE.PAUSED
                                                ? "active"
                                                : "inactive"
                                        }
                                        onClick={handleStart}
                                    />

                                    {/* Restart 버튼 */}
                                    {(phase === PHASE.RUNNING ||
                                        phase === PHASE.PAUSED) && (
                                        <TimerButton
                                            variant="restart"
                                            size="sm"
                                            status="active"
                                            onClick={handleRestart}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 포인트 Toast: 카드 밖, 아래쪽 */}
            {isToastVisible && (
                <div className="focus-toast-wrap">
                    <div className="focus-toast">
                        🎉 {lastEarnedPoint}포인트를 획득했습니다!
                    </div>
                </div>
            )}

            {/* Pause Toast: 카드 밖, 아래쪽 */}
            {isPauseToastVisible && (
                <div className="focus-toast-wrap">
                    <div className="focus-toast-pause">
                        🚨 집중이 중단되었습니다.
                    </div>
                </div>
            )}
        </>
    );
}

export default Focus;
