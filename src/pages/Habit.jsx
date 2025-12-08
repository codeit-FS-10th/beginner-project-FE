import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    fetchTodayHabits,
    toggleHabitCheck,
    fetchStudyDetail,
} from "@api/service/habitservice";
import ModalHabitList from "@organism/ModalHabitList";
import { getToken } from "@utils/tokenStorage";
import "@styles/pages/habit.css";
import Chip from "@atoms/chip/Chip";
import NavButton from "@atoms/button/NavButton";

function Habit() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "공부의 숲 오늘의 습관";
    }, []);

    const studyId = searchParams.get("id");
    const [token, setToken] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    // 현재 시간
    const [time, setTime] = useState("");
    // 오늘의 습관 리스트
    const [habits, setHabits] = useState([]);
    // 모달 열림/닫힘
    const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
    // 스터디 정보
    const [studyInfo, setStudyInfo] = useState(null);

    /** 현재 시간 업데이트 */
    const formatDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        let hour = now.getHours();
        const minute = String(now.getMinutes()).padStart(2, "0");
        const ampm = hour < 12 ? "오전" : "오후";

        if (hour === 0) hour = 12;
        else if (hour > 12) hour -= 12;

        return `${year}-${month}-${day} ${ampm} ${hour}:${minute}`;
    };

    /** 1초마다 현재 시간 변경 */
    useEffect(() => {
        setTime(formatDateTime());
        const timer = setInterval(() => setTime(formatDateTime()), 1000);
        return () => clearInterval(timer);
    }, []);

    /** 오늘의 습관 불러오기 */
    const loadHabits = async () => {
        if (!studyId) {
            if (process.env.NODE_ENV === "development") {
                console.warn(
                    "studyId가 없습니다. 오늘의 습관을 불러오지 않습니다."
                );
            }
            return;
        }

        try {
            const data = await fetchTodayHabits(studyId);

            const list = (data.habits ?? []).map((habit) => ({
                id: habit.HABIT_ID,
                name: habit.NAME,
                isDone: habit.isDone,
            }));

            setHabits(list);
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error(
                    "오늘의 습관 조회 실패:",
                    error?.response || error
                );
            }
        }
    };
    /** 스터디 상세 정보 불러오기 */
    const loadStudyDetail = async () => {
        if (!studyId) return;

        try {
            const data = await fetchStudyDetail(studyId);

            setStudyInfo({
                nickname: data.NICKNAME ?? data.nickname,
                name: data.NAME ?? data.name,
            });
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error(
                    "스터디 상세조회 실패:",
                    error?.response || error
                );
            }
        }
    };

    /** 마운트 시 토큰 확인 */
    useEffect(() => {
        if (!studyId) return;

        // sessionStorage에서 토큰 확인
        const storedToken = getToken(studyId);
        if (storedToken) {
            setToken(storedToken);
            setIsVerified(true);
        }
    }, [studyId]);

    /** 토큰이 설정되면 데이터 로드 */
    useEffect(() => {
        if (isVerified && token && studyId) {
            loadHabits();
            loadStudyDetail();
        }
    }, [isVerified, token, studyId]);

    /** 습관 체크/해제 토글 */
    const handleHabitClick = async (habitId) => {
        const target = habits.find((h) => h.id === habitId);

        if (!target) {
            if (process.env.NODE_ENV === "development") {
                console.warn("해당 habitId를 가진 습관을 찾지 못함:", habitId);
            }
            return;
        }

        const newDone = !target.isDone;

        // UI 먼저 토글
        setHabits((prev) => {
            const updated = prev.map((habit) =>
                habit.id === habitId ? { ...habit, isDone: newDone } : habit
            );

            return updated;
        });

        // API 호출
        try {
            const res = await toggleHabitCheck(studyId, habitId, newDone);
        } catch (e) {
            if (process.env.NODE_ENV === "development") {
                console.error("체크 실패:", e?.response || e);
            }
        }
    };

    /** 이동 버튼 */
    const handleDetailClick = () => navigate(`/detail?id=${studyId}`);
    const handleFocusClick = () => navigate(`/focus?id=${studyId}`);

    // 토큰이 없으면 권한 없음 페이지 표시
    if (!isVerified || !token) {
        return (
            <div className="habit-container">
                <div className="habit-content">
                    <div className="habit-content-header">
                        <div className="habit-header-title">
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
        <div className="habit-container">
            <div className="habit-content">
                <div className="habit-content-header">
                    <div className="habit-header-title">
                        <h2>
                            {studyInfo
                                ? `${studyInfo.nickname}의 ${studyInfo.name}`
                                : "스터디 이름 로딩 중..."}
                        </h2>
                    </div>

                    <div className="habit-content-button">
                        <NavButton onClick={handleFocusClick}>
                            오늘의 집중
                        </NavButton>
                        <NavButton onClick={handleDetailClick}>
                            스터디 홈
                        </NavButton>
                    </div>
                </div>

                <div className="habit-time-title">
                    <p className="habit-now-time">현재 시간</p>
                    <div className="habit-time-box">
                        <p>{time}</p>
                    </div>
                </div>

                {/* 오늘의 습관 리스트 */}
                <div className="habit-today">
                    <div className="habit-box">
                        <div className="habit-title-row">
                            <h2>오늘의 습관</h2>

                            <button
                                type="button"
                                className="habit-edit-button"
                                onClick={() => setIsHabitModalOpen(true)}
                            >
                                목록 수정
                            </button>
                        </div>

                        <div className="habit-chip-list">
                            {habits.length === 0 ? (
                                <div className="habit-empty">
                                    <p>아직 습관이 없어요</p>
                                    <p>목록 수정을 눌러 습관을 생성해보세요</p>
                                </div>
                            ) : (
                                habits.map((habit) => (
                                    <Chip
                                        key={habit.id}
                                        onClick={() =>
                                            handleHabitClick(habit.id)
                                        }
                                        variant={
                                            habit.isDone ? "active" : "default"
                                        }
                                    >
                                        {habit.name}
                                    </Chip>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 모달 렌더 */}
            {isHabitModalOpen && (
                <ModalHabitList
                    onClose={() => setIsHabitModalOpen(false)}
                    onSubmit={loadHabits}
                />
            )}
        </div>
    );
}

export default Habit;
