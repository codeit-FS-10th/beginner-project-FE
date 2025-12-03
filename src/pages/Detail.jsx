import React, { useEffect, useState } from "react";
import {
    fetchStudyPoints,
    updateStudy,
    deleteStudy,
    fetchStudyDetail,
} from "@api/service/studyservice";

import { fetchEmoji } from "@api/service/Emojiservice";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { fetchTodayHabits } from "@api/service/habitservice";
import { addRecentStudy } from "@utils/recentStudy";

import "@styles/pages/detail.css";

import Tag from "@atoms/tag/Tag";
import ModalPwd from "@organism/ModalPwd";
import Sticker from "@molecule/sticker/Sticker";
import NavButton from "@atoms/button/NavButton";
import EmojiGroup from "@molecule/Emoji/EmojiGroup";
import { showErrorToast, showSuccessToast } from "@atoms/toast/Toast";

function Detail() {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null); // edit | delete
    const [isEditing, setIsEditing] = useState(false);

    const [editTitle, setEditTitle] = useState("");
    const [editIntro, setEditIntro] = useState("");

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

    const nickname = study?.NICKNAME ?? "";
    const studyName = study?.NAME ?? "";
    const intro = study?.INTRO ?? "";

    // 🟦 비밀번호 검증 후 실행되는 콜백
    const handleVerified = async (actionType) => {
        if (actionType === "edit") {
            setIsEditing(true);
            setEditTitle(studyName);
            setEditIntro(intro);
        }

        if (actionType === "delete") {
            await handleDelete();
        }
    };

    // 🟥 DELETE 요청 실행
    const handleDelete = async () => {
        try {
            await deleteStudy(studyId);
            showSuccessToast("스터디가 삭제되었습니다.");
            navigate("/");
        } catch (err) {
            showErrorToast("삭제 실패");
        }
    };

    // 🟩 PATCH 수정 실행
    const handleUpdate = async () => {
        try {
            await updateStudy(studyId, {
                name: editTitle,
                nickname: nickname,
                intro: editIntro,
                image: study?.image || "",
            });

            setStudy({
                ...study,
                NAME: editTitle,
                INTRO: editIntro,
            });

            showSuccessToast("수정 완료!");
            setIsEditing(false);
        } catch (err) {
            showErrorToast("수정 실패");
        }
    };

    // 🟦 스터디 디테일 가져오기
    useEffect(() => {
        const loadStudyDetail = async () => {
            try {
                const data = await fetchStudyDetail(studyId);
                setStudy(data);
            } catch (err) {
                console.error("스터디 정보 불러오기 실패", err);
            }
        };
        loadStudyDetail();
    }, [studyId]);

    // 🟦 이모지
    useEffect(() => {
        if (!studyId) return;

        const loadEmoji = async () => {
            try {
                const raw = await fetchEmoji(studyId);
                const arr = Array.isArray(raw) ? raw : raw?.data ?? [];

                const mapped = arr.map((item, index) => ({
                    id: index,
                    emoji: item.UNICODE,
                    count: item.COUNTING ?? 0,
                    me: false,
                }));

                setReactions(mapped);
            } catch {
                setReactions([]);
            }
        };

        loadEmoji();
    }, [studyId]);

    // 🟦 포인트
    useEffect(() => {
        if (!studyId) return;

        const loadPoints = async () => {
            try {
                const data = await fetchStudyPoints(studyId);
                setPoints(data?.totalPoint ?? 0);
            } catch {
                setPointError("포인트 불러오기 실패");
            }
        };

        loadPoints();
    }, [studyId]);

    // 🟦 습관 기록표
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
            } catch {
                setError("습관 데이터 불러오기 실패");
            } finally {
                setLoading(false);
            }
        };

        loadHabits();
    }, [studyId]);

    // 최근 조회 저장
    useEffect(() => {
        if (stateStudy) {
            setStudy(stateStudy);
        }
    }, [stateStudy]);

    useEffect(() => {
        if (study) addRecentStudy(study);
    }, [study]);

    const handleShareClick = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            showSuccessToast("링크 복사가 성공적으로 되었습니다.", {
                toastType: "point",
            });
        } catch (error) {
            showErrorToast("링크 복사에 실패했습니다.");
        }
    };

    return (
        <div className="detail-conainer">
            <div className="detail-content">
                {/* HEADER */}
                <div className="detail-content-header">
                    <div className="detail-content-first">
                        <EmojiGroup
                            reactions={reactions}
                            onEmojiClick={() => {}}
                            onAddEmoji={() => {}}
                        />
                    </div>

                    <div className="detail-buttons">
                        <button
                            onClick={handleShareClick}
                            className="detail-share-button"
                        >
                            공유하기
                        </button>

                        <span className="divider divider-1">|</span>

                        <button
                            onClick={() => {
                                setModalAction("edit");
                                setIsModalOpen(true);
                            }}
                            className="detail-edit-button"
                        >
                            수정하기
                        </button>

                        <span className="divider divider-2">|</span>

                        <button
                            onClick={() => {
                                setModalAction("delete");
                                setIsModalOpen(true);
                            }}
                            className="detail-delete-button"
                        >
                            스터디 삭제하기
                        </button>
                    </div>
                </div>

                {/* TITLE */}
                <div className="detail-title-container">
                    <h2 className="detail-title">
                        {isEditing ? (
                            <input
                                className="edit-title-input"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleUpdate();
                                    }
                                }}
                            />
                        ) : nickname && studyName ? (
                            `${nickname}의 ${studyName}`
                        ) : (
                            "스터디 상세"
                        )}
                    </h2>

                    <div className="detail-intro-button">
                        <NavButton to={"/habit"}>오늘의 습관</NavButton>
                        <NavButton to={"/focus"}>오늘의 집중</NavButton>
                    </div>
                </div>

                {/* INTRO */}
                <div className="detail-intro-box">
                    <h3>소개</h3>

                    {isEditing ? (
                        <textarea
                            className="edit-intro-textarea"
                            value={editIntro}
                            onChange={(e) => setEditIntro(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleUpdate();
                                }
                            }}
                        />
                    ) : intro ? (
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

                {/* HABIT */}
                <div className="detail-habit-history">
                    <h2 className="habit-title">습관 기록표</h2>

                    {error && <p className="habit-error">{error}</p>}

                    {habitData.length === 0 && !loading && (
                        <div className="habit-empty-message">
                            아직 습관이 없어요.
                            <br />
                            오늘의 습관에서 습관을 생성해보세요.
                        </div>
                    )}

                    {habitData.length > 0 && (
                        <div className="habit-grid">
                            <div className="habit-name-cell empty"></div>

                            {days.map((day) => (
                                <div key={day} className="day-cell">
                                    {day}
                                </div>
                            ))}

                            {habitData.map((habit) => (
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

            {/* MODAL */}
            {isModalOpen && (
                <ModalPwd
                    onClose={() => setIsModalOpen(false)}
                    onVerified={handleVerified}
                    actionType={modalAction}
                    studyId={studyId}
                />
            )}
        </div>
    );
}

export default Detail;
