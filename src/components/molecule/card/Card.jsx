import React from "react";
import Tag from "@atoms/tag/Tag";
import "@styles/molecule/Card.css";
import { useNavigate } from "react-router-dom";
import { mockBackgrounds } from "@mocks/studyBackgrounds";

const WHITE_TEXT_BACKGROUNDS = [
    "mouse_tablet",
    "tablet_bottle",
    "leaf",
    "diamond",
];

const isWhiteTextBackground = (code) => {
    if (!code) return false;
    return WHITE_TEXT_BACKGROUNDS.includes(code);
};

const Card = ({ size = "lg", theme = "dark", studyData = [] }) => {
    const navigate = useNavigate();

    const sizeClass = {
        sm: "card--sm",
        lg: "card--lg",
    }[size];

    const themeClass = {
        dark: "card--dark",
        light: "card--light",
    }[theme];

    // 이제는 "배경 전용 div"에만 style을 줄 거라 그대로 둬도 되고, 배경 div에만 사용함
    const getBackgroundStyle = (background) => {
        if (!background) return {};

        if (background.type === "color") {
            return {
                backgroundColor: background.value,
            };
        }

        if (background.type === "image") {
            return {
                backgroundImage: `url(${background.value})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            };
        }

        return {};
    };

    const getFontColorClass = (imageCode) => {
        return isWhiteTextBackground(imageCode) ? "card--text-light" : "";
    };

    const changeTagTheme = (imageCode) => {
        return isWhiteTextBackground(imageCode) ? "dark" : "light";
    };

    const safeStudyData = Array.isArray(studyData) ? studyData : [];

    return (
        <>
            {safeStudyData.map((item) => {
                const {
                    STUDY_ID,
                    NAME,
                    NICKNAME,
                    point,
                    day,
                    INTRO,
                    IMAGE,
                    background,
                    reactionData,
                } = item;

                const studyId = STUDY_ID;
                const title = NAME ?? "";
                const author = NICKNAME ?? "";
                const safePoint = point ?? 0;
                const safeDay = day ?? 0;
                const safeGoal = INTRO ?? "";

                // IMAGE(code) → 실제 이미지 파일 매핑
                let bg = null;

                if (IMAGE) {
                    const found = mockBackgrounds.find(
                        (bgItem) => bgItem.code === IMAGE
                    );
                    if (found) {
                        bg = { type: "image", value: found.image };
                    }
                }

                if (!bg) {
                    bg = background ?? null;
                }

                const reactions = Array.isArray(reactionData)
                    ? reactionData
                    : [];

                const handleClick = () => {
                    if (!studyId) return;
                    navigate(`/detail?id=${studyId}`, {
                        state: { study: item },
                    });
                };

                // 텍스트/Tag 색 결정
                const fontColorClass = getFontColorClass(IMAGE);
                const tagTheme = changeTagTheme(IMAGE);

                return (
                    // ✅ 여기 div가 "카드" 자체
                    <div
                        key={studyId}
                        className={`card ${sizeClass} ${themeClass}`}
                        onClick={handleClick}
                    >
                        {/* ✅ 여기 div가 "배경 전용 레이어" */}
                        {bg && (
                            <div
                                className="card-bg-layer"
                                style={getBackgroundStyle(bg)}
                            >
                                {/* 배경이 특정 4개 이미지면 어둡게 오버레이 */}
                                {bg.type === "image" &&
                                    isWhiteTextBackground(IMAGE) && (
                                        <div className="card-bg-overlay" />
                                    )}
                            </div>
                        )}

                        {/* ✅ 실제 컨텐츠는 배경 위에 올라감 */}
                        <article>
                            <header>
                                <div
                                    className={`title-box title-box-${size} title-box-${theme} ${fontColorClass}`}
                                >
                                    <p className={`title-${size}`}>
                                        <span className="auther">{author}</span>
                                        {title && `의 ${title}`}
                                    </p>
                                    <Tag
                                        type="point"
                                        size="sm"
                                        value={safePoint}
                                        theme={tagTheme}
                                        variant="home"
                                    />
                                </div>

                                {/* 날짜 텍스트도 흰색 적용 */}
                                <span
                                    className={`Card-day-text ${fontColorClass}`}
                                >
                                    {safeDay}일째 진행 중
                                </span>
                            </header>

                            <p className={`goal-${size} ${fontColorClass}`}>
                                {safeGoal}
                            </p>

                            <ul className="card--reactions">
                                {reactions.slice(0, 5).map((reaction) => (
                                    <li key={reaction.id} className="tag">
                                        <Tag
                                            type="reaction"
                                            size="emoji"
                                            emoji={reaction.emoji}
                                            value={reaction.value}
                                            theme="dark"
                                        />
                                    </li>
                                ))}
                            </ul>
                        </article>
                    </div>
                );
            })}
        </>
    );
};

export default Card;
