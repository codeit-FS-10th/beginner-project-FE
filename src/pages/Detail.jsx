import React, { useEffect, useState } from "react";
import NavButton from "@atoms/button/NavButton";
import Tag from "@atoms/tag/Tag";
import "@styles/pages/detail.css";
import ReactionAddButton from "@atoms/button/ReactionAddButton";
import ModalPwd from "@organism/ModalPwd";
import Sticker from "@molecule/Sticker/Sticker";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { fetchTodayHabits } from "@api/service/habitservice";
import { addRecentStudy } from "@utils/recentStudy";

function Detail() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const days = ["월", "화", "수", "목", "금", "토", "일"];

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const studyId = searchParams.get("id");
    const location = useLocation();
    const stateStudy = location.state?.study;

    const [study, setStudy] = useState(null);

    const [habitData, setHabitData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const normalizeHabits = (rawHabits) =>
        rawHabits.map((habit) => ({
            id: habit.HABIT_ID,
            name: habit.NAME,
            월: habit.MON ? 1 : 0,
            화: habit.TUE ? 1 : 0,
            수: habit.WED ? 1 : 0,
            목: habit.THU ? 1 : 0,
            금: habit.FRI ? 1 : 0,
            토: habit.SAT ? 1 : 0,
            일: habit.SUN ? 1 : 0,
        }));

    useEffect(() => {
        if (!studyId) return;

        const loadHabits = async () => {
            try {
                setLoading(true);
                const data = await fetchTodayHabits(studyId);
                setHabitData(normalizeHabits(data));
            } catch (err) {
                console.error(err);
                setError("습관 데이터를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        loadHabits();
    }, [studyId]);

    const handleHabitClick = () => {
        if (!studyId) return;

        navigate(`/habit?id=${studyId}`, {
            // state: { password },
        });
    };

    const handleFocusClick = () => {
        if (!studyId) return;

        navigate(`/focus?id=${studyId}`, {
            // state: { password },
        });
    };

    const habits = habitData;

    useEffect(() => {
        if (stateStudy) {
            setStudy(stateStudy);
        }
    }, [stateStudy]);

    useEffect(() => {
        if (!study) return;
        addRecentStudy(study);
    }, [study]);

    return (
        <div className="detail-conainer">
            <div className="detail-content">
                <div className="detail-content-header">
                    <Tag type="reaction" />
                    <ReactionAddButton />
                    <div className="detail-buttons">
                        <button className="detail-share-button">
                            공유하기
                        </button>
                        <span className="divider divider-1">|</span>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="detail-edit-button"
                        >
                            수정하기
                        </button>
                        <span className="divider divider-2">|</span>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="detail-delete-button"
                        >
                            스터디 삭제하기
                        </button>
                    </div>
                </div>

                <div className="detail-intro">
                    <h2>연우의 개발공장</h2>
                    <div className="detail-intro-button">
                        <NavButton onClick={handleHabitClick}>
                            오늘의 습관
                        </NavButton>
                        <NavButton onClick={handleFocusClick}>
                            오늘의 집중
                        </NavButton>
                    </div>
                </div>

                <div>
                    <h3>소개</h3>
                    <p>현재까지 획득한 포인트</p>
                    <Tag type="point" value="30" theme="light" />
                </div>

                <div className="detail-habit-history">
                    <h2 className="habit-title">습관 기록표</h2>

                    {error && <p className="habit-error">{error}</p>}

                    {habits.length === 0 && !loading && (
                        <div className="habit-empty-message">
                            아직 습관이 없어요.
                            <br />
                            오늘의 습관에서 습관을 생성해보세요.
                        </div>
                    )}
                    {habits.length > 0 && (
                        <div className="habit-grid">
                            <div className="habit-name-cell empty"></div>
                            {days.map((day) => (
                                <div key={day} className="day-cell">
                                    {day}
                                </div>
                            ))}

                            {habits.map((habit) => (
                                <React.Fragment key={habit.id}>
                                    <div className="habit-name-cell">
                                        {habit.name}
                                    </div>

                                    {days.map((day) => {
                                        const done = habit[day] === 1;
                                        return (
                                            <div
                                                key={day}
                                                className={`sticker-cell ${
                                                    done ? "done" : "empty"
                                                }`}
                                            >
                                                <Sticker active={done} />
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && <ModalPwd onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}

export default Detail;
