import React, { useEffect, useState } from "react";
import NavButton from "@atoms/button/NavButton";
import Tag from "@atoms/tag/Tag";
import "@styles/pages/detail.css";
import { habitsFromApi } from "@mocks/habitcheck.js";
import ReactionAddButton from "@atoms/button/ReactionAddButton";
import ModalPwd from "@organism/ModalPwd";
import Sticker from "@molecule/Sticker/Sticker";
import { useSearchParams, useNavigate } from "react-router-dom";

function Detail() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const days = ["월", "화", "수", "목", "금", "토", "일"];

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const studyId = searchParams.get("id"); // 🔥 ?id=1 에서 1 가져옴

    useEffect(() => {
        if (!studyId) return;

        // TODO: 나중에 여기서 studyId로 상세 API 호출하면 됨
        // fetchStudyDetail(studyId) 이런 식으로
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

                    <div className="habit-grid">
                        <div className="habit-name-cell empty"></div>
                        {days.map((day) => (
                            <div key={day} className="day-cell">
                                {day}
                            </div>
                        ))}

                        {habitsFromApi.map((habit) => (
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
                                            <span className="sticker-dot" />
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {isModalOpen && <ModalPwd onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}

export default Detail;
