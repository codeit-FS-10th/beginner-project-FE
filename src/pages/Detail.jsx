import React from "react";
import Tag from "@atoms/tag/Tag";
import "@styles/pages/detail.css";
import { habitsFromApi } from "@mocks/habitcheck.js";
import Modal from "../components/ui/modal/Modal";
import ReactionAddButton from "../components/atoms/button/ReactionAddButton";

function Detail() {
    const days = ["월", "화", "수", "목", "금", "토", "일"];

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
                        <button className="detail-edit-button">수정하기</button>
                        <span className="divider divider-2">|</span>
                        <button className="detail-delete-button">
                            스터디 삭제하기
                        </button>
                    </div>
                </div>
                <div className="detail-intro">
                    <h2>연우의 개발공장</h2>
                    <div className="detail-intro-button">
                        <button>오늘의 습관</button>
                        <button>오늘의 집중</button>
                    </div>
                </div>
                <div>
                    <h3>소개</h3>
                    <p>asdasd</p>
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
        </div>
    );
}

export default Detail;
