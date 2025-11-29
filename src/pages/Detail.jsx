import React from "react";
import Tag from "@Atoms/tag/Tag";
import "@styles/detail.css";
import { habitsFromApi } from "@mocks/habitcheck.js";
function Detail() {
    const days = ["월", "화", "수", "목", "금", "토", "일"];

    return (
        <div className="detail-conainer">
            <div className="detail-content">
                <div className="detail-content-header">
                    <Tag type="reaction" />
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
                        {/* 왼쪽 상단 빈칸 */}
                        <div className="habit-name-cell empty"></div>

                        {/* 요일 헤더 */}
                        {days.map((day) => (
                            <div key={day} className="day-cell">
                                {day}
                            </div>
                        ))}

                        {/* 습관 목록 */}
                        {habitsFromApi.map((habit) => (
                            <React.Fragment key={habit.id}>
                                {/* 습관명 */}
                                <div className="habit-name-cell">
                                    {habit.name}
                                </div>

                                {/* 월~일 스티커 */}
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
