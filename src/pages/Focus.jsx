// src/pages/Focus.jsx
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import Tag from "@atoms/tag/Tag";
import "@styles/pages/focus.css";
import TimerButton from "../components/atoms/button/TimerButton";
import NavButton from "@atoms/button/NavButton";
import PencilIcon from "@assets/Icons/PencilIcon";
import { getToken } from "@utils/tokenStorage";
import { showErrorToast, showSuccessToast } from "@atoms/toast/Toast";

import {
    fetchStudyDetail,
    finishFocus,
} from "@api/service/focusApi";
import { fetchStudyPoints } from "@api/service/studyservice";

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
    const [editMinute, setEditMinute] = useState(String(focusMinutes));
    const [editSecond, setEditSecond] = useState("00");
    const minuteInputRef = useRef(null);
    const secondInputRef = useRef(null);
    const blurTimeoutRef = useRef(null);

    // ---------- 유틸 ----------

    // MM:SS 또는 -MM:SS 포맷 (필요하면 다른 곳에서 사용)
    const formatTime = (seconds) => {
        const abs = Math.abs(seconds);
        const m = String(Math.floor(abs / 60)).padStart(2, "0");
        const s = String(abs % 60).padStart(2, "0");
        return seconds < 0 ? `-${m}:${s}` : `${m}:${s}`;
    };

    // MM, SS 분리
    const getTimeParts = (seconds) => {
        const abs = Math.abs(seconds);
        const m = String(Math.floor(abs / 60)).padStart(2, "0");
        const s = String(abs % 60).padStart(2, "0");
        return { m, s };
    };

    // 타이머 편집 시작 (버튼 클릭 시)
    const startEditTimer = (e) => {
        const { m, s } = getTimeParts(remainSeconds);
        setEditMinute(m);
        setEditSecond(s);

        // 클릭 위치를 먼저 저장 (span이 아직 존재하는 시점)
        const clickX = e.clientX;
        const minuteSpan = e.currentTarget.querySelector(".focus-timmer-min");
        const secondSpan = e.currentTarget.querySelector(".focus-timmer-sec");
        const colonSpan = e.currentTarget.querySelector(".focus-timmer-colon");

        let shouldFocusMinute = true;

        if (minuteSpan && secondSpan && colonSpan) {
            const colonRect = colonSpan.getBoundingClientRect();
            // 클릭 위치가 분 영역인지 초 영역인지 판단
            if (clickX < colonRect.left) {
                // 분 클릭
                shouldFocusMinute = true;
            } else if (clickX > colonRect.right) {
                // 초 클릭
                shouldFocusMinute = false;
            }
        }

        setIsEditing(true);

        // input이 렌더링된 후 포커스 설정
        setTimeout(() => {
            if (shouldFocusMinute) {
                minuteInputRef.current?.focus();
                // 클릭 위치에 맞춰 커서 위치 설정
                if (minuteInputRef.current) {
                    const input = minuteInputRef.current;
                    const inputRect = input.getBoundingClientRect();
                    const relativeX = clickX - inputRect.left;
                    // 클릭 위치에 맞춰 커서 위치 설정 (대략적인 계산)
                    const charWidth = inputRect.width / 2; // 2자리 숫자
                    const cursorPos = Math.min(
                        2,
                        Math.max(0, Math.round(relativeX / charWidth))
                    );
                    setTimeout(() => {
                        input.setSelectionRange(cursorPos, cursorPos);
                    }, 0);
                }
            } else {
                secondInputRef.current?.focus();
                // 클릭 위치에 맞춰 커서 위치 설정
                if (secondInputRef.current) {
                    const input = secondInputRef.current;
                    const inputRect = input.getBoundingClientRect();
                    const relativeX = clickX - inputRect.left;
                    const charWidth = inputRect.width / 2; // 2자리 숫자
                    const cursorPos = Math.min(
                        2,
                        Math.max(0, Math.round(relativeX / charWidth))
                    );
                    setTimeout(() => {
                        input.setSelectionRange(cursorPos, cursorPos);
                    }, 0);
                }
            }
        }, 0);
    };

    // 타이머 편집 완료 (blur 시 확정)
    const confirmEditTimer = () => {
        // 기존 타이머가 있으면 취소
        if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
        }

        // 짧은 지연 후에 확인 (다른 input으로 포커스 이동 여부 확인)
        blurTimeoutRef.current = setTimeout(() => {
            // 두 input 모두 포커스가 없을 때만 확인
            const minuteFocused =
                document.activeElement === minuteInputRef.current;
            const secondFocused =
                document.activeElement === secondInputRef.current;

            if (minuteFocused || secondFocused) {
                // 아직 하나의 input에 포커스가 있으면 아무것도 하지 않음
                return;
            }

            const numMinute = Number(editMinute);
            const numSecond = Number(editSecond);

            if (
                !Number.isFinite(numMinute) ||
                numMinute < 0 ||
                !Number.isFinite(numSecond) ||
                numSecond < 0
            ) {
                showErrorToast("유효한 숫자를 입력해주세요.");
                setEditMinute(String(focusMinutes));
                setEditSecond("00");
                setIsEditing(false);
                return;
            }

            const totalSeconds = numMinute * 60 + numSecond;

            if (numMinute > 60 || numSecond >= 60) {
                showErrorToast("분은 60까지만, 초는 59까지만 입력 가능합니다.");
                setEditMinute(String(focusMinutes));
                setEditSecond("00");
            } else {
                setFocusMinutes(numMinute);
                setRemainSeconds(totalSeconds);
                showSuccessToast("시간이 정상적으로 수정되었습니다.", {
                    toastType: "point",
                });
            }

            setIsEditing(false);
        }, 150);
    };

    // ---------- 비밀번호 체크 + 초기 데이터 로딩 ----------
    const [token, setToken] = useState(null);
    const [isVerified, setIsVerified] = useState(false);

    // token 확인
    useEffect(() => {
        if (!studyId) return;

        // sessionStorage에서 토큰 확인
        const storedToken = getToken(studyId);
        if (storedToken) {
            setToken(storedToken);
            setIsVerified(true);
        }
    }, [studyId]);

    // 스터디 정보 + 현재 포인트 로딩
    useEffect(() => {
        if (!studyId || !token || !isVerified) return;

        const load = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // 스터디 정보 요청
                const detailRes = await fetchStudyDetail(studyId);
                console.log("스터디 상세조회:", detailRes);

                const data = detailRes.data ?? detailRes;

                // Habit 페이지와 동일하게 정규화
                setStudyInfo({
                    nickname: data.NICKNAME ?? data.nickname,
                    name: data.NAME ?? data.name,
                });

                // 포인트 정보 요청
                try {
                    const pointsRes = await fetchStudyPoints(studyId);
                    setTotalPoint(pointsRes.totalPoint ?? 0);
                } catch (err) {
                    if (err.response?.status === 404) {
                        console.warn(
                            "포인트 정보 없음, totalPoint를 0으로 설정합니다."
                        );
                        setTotalPoint(0);
                    } else {
                        console.warn("포인트 조회 실패:", err);
                        setTotalPoint(0);
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
    }, [studyId, token, isVerified]);

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

    // Stop (집중 완료 → 포인트 적립)
    const handleStop = async () => {
        if (phase !== PHASE.FINISHED) return;

        if (!studyId) {
            console.error("finishFocus 실패: studyId 없음");
            return;
        }
        if (!token) {
            console.error("finishFocus 실패: token 없음");
            return;
        }

        // 사용자가 설정한 기본 집중 시간
        const totalSec = focusMinutes * 60;
        // 실제 집중한 시간(초)
        const usedSec = totalSec - Math.max(remainSeconds, 0);
        const timeSec = usedSec > 0 ? usedSec : totalSec;

        try {
            console.log("finishFocus 요청:", {
                studyId,
                timeSec,
            });

            const res = await finishFocus(studyId, timeSec);

            console.log("finishFocus 응답:", res.status, res.data);

            // Swagger 응답이 { point, totalPoint } 라고 가정
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
            // 타이머 상태 초기화
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

    // 현재 시간 분/초 (UI용)
    const { m: minuteStr, s: secondStr } = getTimeParts(remainSeconds);
    const isNegative = remainSeconds < 0;

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

        navigate(`/habit?id=${studyId}`);
    };

    const handleHomeClick = () => {
        if (!studyId) return;

        navigate(`/detail?id=${studyId}`);
    };

    // ---------- 렌더 ----------

    // 토큰이 없으면 권한 없음 페이지 표시
    if (!isVerified || !token) {
        return (
            <div className="focus-container">
                <div className="focus-content">
                    <div className="focus-content-header">
                        <div className="focus-header-title">
                            <h2>권한이 없습니다</h2>
                        </div>
                    </div>
                    <div style={{ padding: "2rem", textAlign: "center" }}>
                        <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                            이 페이지에 접근할 권한이 없습니다.
                        </p>
                        <p
                            style={{
                                fontSize: "1rem",
                                color: "#666",
                                marginBottom: "2rem",
                            }}
                        >
                            스터디 홈에서 비밀번호를 입력한 후 접근해주세요.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="focus-container">
                <div className="focus-content">
                    {/* Header */}
                    <div className="focus-content-header">
                        <div className="focus-header-title">
                            <h2>
                                {studyInfo
                                    ? `${studyInfo.nickname}의 ${studyInfo.name}`
                                    : "스터디 이름 로딩 중..."}
                            </h2>
                        </div>
                        <div className="focus-content-button">
                            <NavButton onClick={handleHabitClick}>
                                오늘의 습관
                            </NavButton>
                            <NavButton onClick={handleHomeClick}>
                                스터디 홈
                            </NavButton>
                        </div>
                    </div>

                    <div>
                        <p className="focus-total-point">
                            현재 까지 획득한 포인트
                        </p>
                        <Tag
                            type="point"
                            size="lg"
                            value={totalPoint}
                            theme="light"
                            variant="detail"
                        />
                    </div>

                    {/* 타이머 박스 */}
                    <div className="focus-today">
                        <div className="focus-box">
                            <h2>오늘의 집중</h2>
                        </div>

                        {/* 타이머 수정 & 표시 */}
                        <div className="focus-timmer-wrap">
                            {/* 타이머 숫자 */}
                            <div
                                className={timerClassName}
                                onClick={
                                    !isEditing ? startEditTimer : undefined
                                }
                            >
                                {/* 음수일 때 - 표시 (혹시 모를 확장용) */}
                                {isNegative && (
                                    <span className="focus-timmer-sign">-</span>
                                )}

                                {phase === PHASE.READY && isEditing ? (
                                    <>
                                        {/* 분: 편집 중에는 input으로, UI는 그대로 */}
                                        <input
                                            ref={minuteInputRef}
                                            type="number"
                                            className="focus-timmer-input"
                                            min={0}
                                            max={60}
                                            maxLength={2}
                                            value={editMinute}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (
                                                    value.length > 2 ||
                                                    parseInt(value) > 60 ||
                                                    parseInt(value) < 0
                                                )
                                                    return;
                                                setEditMinute(value);
                                            }}
                                            onBlur={confirmEditTimer}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    e.currentTarget.blur();
                                                }
                                                if (e.key === "Escape") {
                                                    e.preventDefault();
                                                    setIsEditing(false);
                                                    setEditMinute(
                                                        String(focusMinutes)
                                                    );
                                                    setEditSecond("00");
                                                }
                                            }}
                                        />
                                        <span className="focus-timmer-colon">
                                            :
                                        </span>
                                        <input
                                            ref={secondInputRef}
                                            type="number"
                                            className="focus-timmer-input focus-timmer-input-sec"
                                            min={0}
                                            max={59}
                                            maxLength={2}
                                            value={editSecond}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (
                                                    value.length > 2 ||
                                                    parseInt(value) > 59 ||
                                                    parseInt(value) < 0
                                                )
                                                    return;
                                                setEditSecond(value);
                                            }}
                                            onBlur={confirmEditTimer}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    e.currentTarget.blur();
                                                }
                                                if (e.key === "Escape") {
                                                    e.preventDefault();
                                                    setIsEditing(false);
                                                    setEditMinute(
                                                        String(focusMinutes)
                                                    );
                                                    setEditSecond("00");
                                                }
                                            }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {/* 평소에는 span으로 렌더링 */}
                                        <span className="focus-timmer-min">
                                            {minuteStr}
                                        </span>
                                        <span className="focus-timmer-colon">
                                            :
                                        </span>
                                        <span className="focus-timmer-sec">
                                            {secondStr}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 버튼 영역 */}
                        <div className="timer-button-box">
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
