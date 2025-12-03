// src/pages/Focus.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import Tag from "@atoms/tag/Tag";
import "@styles/pages/focus.css";
import TimerButton from "../components/atoms/button/TimerButton";
import NavButton from "@atoms/button/NavButton";
import PencilIcon from "@assets/Icons/PencilIcon";

import {
    fetchStudyDetail,
    fetchFocusInfo,
    finishFocus,
} from "@api/service/focusApi";

const PHASE = {
    READY: "ready",
    RUNNING: "running",
    PAUSED: "paused",
    FINISHED: "finished",
};

function Focus() {
    const [searchParams] = useSearchParams();
    const studyId = searchParams.get("id");
    const location = useLocation();
    const navigate = useNavigate();

    // 수정 가능한 분 단위
    const [focusMinutes, setFocusMinutes] = useState(25);

    // 실제 카운트다운 초
    const [remainSeconds, setRemainSeconds] = useState(focusMinutes * 60);

    // ready / running / paused / finished
    const [phase, setPhase] = useState(PHASE.READY);

    // 스터디 정보
    const [studyInfo, setStudyInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 총 포인트
    const [totalPoint, setTotalPoint] = useState(0);

    // 포인트 토스트
    const [lastEarnedPoint, setLastEarnedPoint] = useState(0);
    const [isToastVisible, setIsToastVisible] = useState(false);

    // Pause 토스트
    const [isPauseToastVisible, setIsPauseToastVisible] = useState(false);

    // 수정 모드
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(String(focusMinutes));

    // ---------- 유틸 ----------

    // MM:SS 또는 -MM:SS 포맷
    const formatTime = (seconds) => {
        const abs = Math.abs(seconds);
        const m = String(Math.floor(abs / 60)).padStart(2, "0");
        const s = String(abs % 60).padStart(2, "0");
        return seconds < 0 ? `-${m}:${s}` : `${m}:${s}`;
    };

    // ---------- 비밀번호 체크 + 초기 데이터 로딩 ----------
    const password = location.state?.password ?? "1234"; //임시로
    // const password = location.state?.password;

    // password 없이 직접 URL로 들어오면 비밀번호 페이지로 돌려보내기
    useEffect(() => {
        if (!password) {
            navigate(`/study/${studyId}/password`, { replace: true });
        }
    }, [password, studyId, navigate]);

    // 스터디 정보 + 현재 포인트 로딩
    useEffect(() => {
        if (!studyId || !password) return;

        const load = async () => {
            try {
                setIsLoading(true);
                setError(null);

                //스터디 정보 요청
                const detailRes = await fetchStudyDetail(studyId, password);
                setStudyInfo(detailRes.data);

                //  포커스 정보 요청
                try {
                    const focusRes = await fetchFocusInfo(studyId, password);
                    setTotalPoint(focusRes.data.totalPoint);
                } catch (err) {
                    // 포커스 정보가 아직 없는 경우 포인트 0으로 시작
                    if (err.response?.status === 404) {
                        console.warn(
                            "포커스 정보 없음, totalPoint를 0으로 설정합니다."
                        );
                        setTotalPoint(0);
                    } else {
                        throw err;
                    }
                }
            } catch (err) {
                console.error("Focus 페이지 초기 로딩 실패:", err);
                setError("집중 정보를 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, [studyId, password]);
    // ---------- 타이머 조작 ----------

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

    const handleStop = async () => {
        if (phase !== PHASE.FINISHED) return;

        if (!studyId) {
            console.error("finishFocus 실패: studyId 없음");
            return;
        }
        if (!password) {
            console.error("finishFocus 실패: password 없음");
            return;
        }
        //사용자가 설정한 기본 집중 시간
        const totalSec = focusMinutes * 60;
        //실제로 집중한 시간(초)
        const usedSec = totalSec - Math.max(remainSeconds, 0);
        const timeSec = usedSec > 0 ? usedSec : totalSec;

        try {
            console.log("finishFocus 요청:", {
                studyId,
                password,
                timeSec,
            });

            const res = await finishFocus(studyId, password, timeSec);

            console.log("finishFocus 응답:", res.status, res.data);

            //  Swagger 응답이 { point, totalPoint } 라고 가정
            const { point, totalPoint: newTotal } = res.data;

            setLastEarnedPoint(point ?? 0); // 이번에 얻은 포인트
            setTotalPoint(newTotal ?? 0); // 누적 포인트
            setIsToastVisible(true); // 토스트 표시
        } catch (err) {
            console.error(
                "포인트 적립 실패:",
                err.response?.status,
                err.response?.data ?? err.message
            );
            alert("포인트 적립에 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            // 4) 타이머 상태 초기화
            setPhase(PHASE.READY);
            setRemainSeconds(focusMinutes * 60);
        }
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

    const handleHabitClick = () => {
        if (!studyId) return;

        navigate(`/habit?id=${studyId}`, {
            state: { password },
        });
    };

    const handleHomeClick = () => {
        if (!studyId) return;

        navigate(`/focus?id=${studyId}`, {
            state: { password },
        });
    };

    // ---------- 렌더 ----------

    return (
        <>
            <div className="focus-container">
                <div className="focus-content">
                    {/* Header */}
                    <div className="focus-content-header">
                        <div className="focus-header-title">
                            {isLoading && <h2>로딩 중...</h2>}
                            {error && !isLoading && <h2>에러 발생</h2>}
                            {!isLoading && !error && (
                                <h2>
                                    {studyInfo?.NICKNAME ??
                                        studyInfo?.NAME ??
                                        "오늘의 집중"}
                                </h2>
                            )}
                        </div>
                        <div className="focus-content-button">
                            <NavButton onClick={handleHabitClick}>
                                오늘의 습관
                            </NavButton>
                            <NavButton onClick={handleHomeClick}>홈</NavButton>
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
                            {/*  버튼은 ready에서만 */}
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
