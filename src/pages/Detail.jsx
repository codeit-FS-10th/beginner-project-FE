import React, { useEffect, useState } from "react";
import { fetchStudyPoints } from "@api/service/studyservice";
import { fetchEmoji } from "@api/service/Emojiservice";
import { useLocation, useSearchParams } from "react-router-dom";
import { fetchTodayHabits } from "@api/service/habitservice";
import { addRecentStudy } from "@utils/recentStudy";

import "@styles/pages/detail.css";

import Tag from "@atoms/tag/Tag";
import ModalPwd from "@organism/ModalPwd";
import Sticker from "@molecule/sticker/Sticker";
import NavButton from "@atoms/button/NavButton";
// import EmojiGroup from "../components/molecule/Emoji/EmojiGroup";

function Detail() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reactions, setReactions] = useState([]);

    const days = ["월", "화", "수", "목", "금", "토", "일"];

    const [searchParams] = useSearchParams();
    const studyId = searchParams.get("id");

    const location = useLocation();
    const stateStudy = location.state?.study;

    const [study, setStudy] = useState(null);

    const [habitData, setHabitData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [points, setPoints] = useState(0);
    const [pointError, setPointError] = useState(null);
    const [pointLoading, setPointLoading] = useState(false);

    const nickname = study?.NICKNAME || "";
    const studyName = study?.NAME || "";
    const intro = study?.INTRO || "";

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

    const handleEmojiClick = (emoji) => {
        setReactions((prev) =>
            prev.map((item) =>
                item.emoji === emoji
                    ? { ...item, count: item.count + 1, me: true }
                    : item
            )
        );
    };

    const handleAddEmoji = (emoji) => {
        setReactions((prev) => [
            ...prev,
            {
                id: Date.now(),
                emoji,
                count: 1,
                me: true,
            },
        ]);
    };

    useEffect(() => {
        if (!studyId) return;

        const loadEmoji = async () => {
            try {
                const raw = await fetchEmoji(studyId);
                console.log("이모지 응답 raw:", raw);

                const arr = Array.isArray(raw) ? raw : raw?.data ?? [];

                const mapped = arr.map((item, index) => ({
                    id: index,
                    emoji: item.UNICODE,
                    count: item.COUNTING ?? 0,
                    me: false,
                }));

                setReactions(mapped);
            } catch (err) {
                console.error("이모지 불러오기 실패:", err);
                setReactions([]);
            }
        };

        loadEmoji();
    }, [studyId]);

    useEffect(() => {
        if (!studyId) return;

        const loadPoints = async () => {
            try {
                setPointLoading(true);
                const data = await fetchStudyPoints(studyId);

                const pointValue = data?.totalPoint ?? 0;

                setPoints(pointValue);
            } catch (err) {
                console.error(err);
                setPointError("포인트를 불러오는 데 실패했습니다.");
            } finally {
                setPointLoading(false);
            }
        };

        loadPoints();
    }, [studyId]);

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
                    <div className="detail-content-first">
                        {/* <EmojiGroup
                            reactions={reactions}
                            onEmojiClick={handleEmojiClick}
                            onAddEmoji={handleAddEmoji}
                        /> */}
                    </div>
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

                <div className="detail-title-container">
                    <h2 className="detail-title">
                        {nickname && studyName
                            ? `${nickname}의 ${studyName}`
                            : "스터디 상세"}
                    </h2>
                    <div className="detail-intro-button">
                        <NavButton to={"/Habit"}>오늘의 습관</NavButton>
                        <NavButton to={"/Focus"}>오늘의 집중</NavButton>
                    </div>
                </div>

                <div className="detail-intro-box">
                    <h3>소개</h3>

                    {intro ? (
                        <p className="detail-intro">{intro}</p>
                    ) : (
                        <p className="detail-intro-empty">
                            소개가 아직 등록되지 않았어요.
                        </p>
                    )}

                    <p className="detail-point-title">현재까지 획득한 포인트</p>

                    {pointError && <p className="point-error">{pointError}</p>}

                    <Tag type="point" value={points} theme="light" />
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
