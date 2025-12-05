import React from "react";
import Tag from "@atoms/tag/Tag";
import "@styles/molecule/Card.css";
import { useNavigate } from "react-router-dom";

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

    const changeFontColor = (background) => {
        if (!background) return {};
        if (background.type === "color") {
            return {};
        }
        if (background.type === "image") {
            return { color: "#fff" };
        }
        return {};
    };

    const changeTagTheme = (background) => {
        if (!background) return "light";
        if (background.type === "color") {
            return "light";
        }
        if (background.type === "image") {
            return "dark";
        }
        return "light";
    };

    // 배경 타입에 따른 CSS 클래스 반환
    const getFontColorClass = (background) => {
        if (!background) return "";
        if (background.type === "color") {
            return "";
        }
        if (background.type === "image") {
            return "card--text-light";
        }
        return "";
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
                    IMAGE, //
                    background,
                    reactionData,
                } = item;

                const studyId = STUDY_ID;
                const key = studyId;
                const title = NAME ?? "";
                const author = NICKNAME ?? "";

                const safePoint = point ?? 0;
                const safeDay = day ?? 0;
                const safeGoal = INTRO ?? "";

                const bg = IMAGE
                    ? { type: "image", value: IMAGE }
                    : background ?? null;

                const reactions = Array.isArray(reactionData)
                    ? reactionData
                    : [];

                const handleClick = () => {
                    if (!studyId) return;
                    navigate(`/detail?id=${studyId}`, {
                        state: { study: item },
                    });
                };

                return (
                    <div
                        key={key}
                        className={`card ${sizeClass} ${themeClass}`}
                        style={getBackgroundStyle(bg)}
                        onClick={handleClick}
                    >
                        <article>
                            <header>
                                <div
                                    className={`title-box title-box-${size} title-box-${theme} ${getFontColorClass(
                                        bg
                                    )}`}
                                >
                                    <p className={`title-${size}`}>
                                        <span className="auther">{author}</span>
                                        {title && `의 ${title}`}
                                    </p>
                                    <Tag
                                        type="point"
                                        size={size}
                                        value={safePoint}
                                        theme={changeTagTheme(bg)}
                                    />
                                </div>
                                <span className="Card-day-text">
                                    {safeDay}일째 진행 중
                                </span>
                            </header>

                            <p
                                className={`goal-${size} ${getFontColorClass(
                                    bg
                                )}`}
                            >
                                {safeGoal}
                            </p>

                            <ul className="card--reactions">
                                {reactions.map((reaction) => (
                                    <li key={reaction.id} className="tag">
                                        <Tag
                                            type="reaction"
                                            size={size}
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
