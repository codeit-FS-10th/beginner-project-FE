import React, { useEffect, useState } from "react";
import { deleteStudy, fetchStudyDetail } from "@api/service/studyservice";

import { postEmoji } from "@api/service/Emojiservice";

import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { fetchWeekHabits } from "@api/service/habitservice";
import { addRecentStudy } from "@utils/recentStudy";

import "@styles/pages/detail.css";

import Tag from "@atoms/tag/Tag";
import ModalPwd from "@organism/ModalPwd";
import Sticker from "@molecule/sticker/Sticker";
import NavButton from "@atoms/button/NavButton";
import { showErrorToast, showSuccessToast } from "@atoms/toast/Toast";
import EmojiBar from "@molecule/emoji/EmojiBar";

function Detail() {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null); // edit | delete

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

    const [reactions, setReactions] = useState([]); // 이모지 리스트
    const [emojiError, setEmojiError] = useState(null); // 에러 메시지

    const nickname = study?.NICKNAME ?? "";
    const studyName = study?.NAME ?? "";
    const intro = study?.INTRO ?? "";

    const handleVerified = async (actionType) => {
        if (actionType === "edit") {
            // 비밀번호 확인 후 수정 페이지로 이동 (기존 Study.jsx를 수정 모드로 사용)
            // Study 페이지는 location.state 또는 query param으로 edit 모드를 인식합니다.
            navigate(`/study`, {
                state: { mode: "edit", studyId: studyId, study },
            });
            return;
        }

        if (actionType === "delete") {
            await handleDelete();
        }
    };

    const handleDelete = async () => {
        try {
            await deleteStudy(studyId);
            showSuccessToast("스터디가 정상적으로 삭제 되었습니다.", {
                toastType: "point",
            });
            navigate("/");
        } catch (err) {
            showErrorToast("삭제 실패");
        }
    };

    // CODE를 이모지로 변환하는 함수
    const codeToEmoji = (code) => {
        if (!code) return "";
        try {
            // "1f600" 형식을 "1F600"으로 변환 후 코드 포인트로 변환
            const codePoint = parseInt(code.toUpperCase(), 16);
            return String.fromCodePoint(codePoint);
        } catch (err) {
            console.error("이모지 변환 실패:", code, err);
            return "";
        }
    };

    const loadEmoji = async () => {
        if (!studyId) return;

        try {
            setEmojiError(null);

            const data = await fetchStudyDetail(studyId);
            const raw = Array.isArray(data.emojis) ? data.emojis : [];

            const normalized = raw.map((item) => {
                const code = (item.code || "").toLowerCase();
                const emoji = codeToEmoji(code);

                return {
                    id: code,
                    code: code,
                    emoji: emoji,
                    count: item.counting || 0,
                    me: false,
                };
            });

            setReactions(normalized);
        } catch (err) {
            console.error("이모지 불러오기 실패", err);
            setEmojiError("이모지 불러오기 실패");
            setReactions([]);
        }
    };

    const handleEmojiAction = async (emojiData) => {
        if (!studyId) return;

        try {
            let code;
            if (typeof emojiData === "object" && emojiData.code) {
                code = emojiData.code.toLowerCase();
            } else if (typeof emojiData === "string") {
                code = emojiData.toLowerCase();
            } else {
                console.error("잘못된 이모지 데이터:", emojiData);
                return;
            }

            const emojiChar = codeToEmoji(code);

            await postEmoji(studyId, { code, emoji: emojiChar });

            await loadEmoji();
        } catch (err) {
            console.error("이모지 업데이트 실패", err);
        }
    };

    useEffect(() => {
        loadEmoji();
    }, []);

    useEffect(() => {
        const loadStudyDetail = async () => {
            try {
                const data = await fetchStudyDetail(studyId);
                setStudy(data);

                // 응답에 totalPoint 포함되어 있음
                setPoints(data?.totalPoint ?? 0);

                // 응답에 emojis 포함되어 있으므로 처리
                const raw = Array.isArray(data.emojis) ? data.emojis : [];
                const normalized = raw.map((item) => {
                    const code = (item.code || "").toLowerCase();
                    const emoji = codeToEmoji(code);

                    return {
                        id: code,
                        code: code,
                        emoji: emoji,
                        count: item.counting || 0,
                        me: false,
                    };
                });
                setReactions(normalized);
            } catch (err) {
                console.error("스터디 정보 불러오기 실패", err);
            }
        };
        loadStudyDetail();
    }, [studyId]);

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

                const data = await fetchWeekHabits(studyId);
                setHabitData(normalizeHabits(data));
            } catch {
                setError("습관 데이터 불러오기 실패");
            } finally {
                setLoading(false);
            }
        };

        loadHabits();
    }, [studyId]);

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
    /** 이동 버튼 */
    const handleHabitClick = () => navigate(`/habit?id=${studyId}`);
    const handleFocusClick = () => navigate(`/focus?id=${studyId}`);

    return (
        <div className="detail-conainer">
            <div className="detail-content">
                <div className="detail-content-header">
                    <div className="detail-content-first">
                        <EmojiBar
                            reactions={reactions}
                            onEmojiClick={handleEmojiAction} // 기존 이모지 클릭
                            onAddEmoji={handleEmojiAction} // 새 이모지 선택
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
                        {nickname && studyName
                            ? `${nickname}의 ${studyName}`
                            : "스터디 상세"}
                    </h2>

                    <div className="detail-intro-button">
                        <NavButton onClick={handleHabitClick}>
                            오늘의 습관
                        </NavButton>
                        <NavButton onClick={handleFocusClick}>
                            오늘의 집중
                        </NavButton>
                    </div>
                </div>

                {/* INTRO */}
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
                    <Tag
                        type="point"
                        size="lg"
                        value={points}
                        theme="light"
                        variant="detail"
                    />
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
