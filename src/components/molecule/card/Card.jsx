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

    const safeStudyData = Array.isArray(studyData) ? studyData : [];

    return (
        <>
            {safeStudyData.map((item) => {
                // DB 응답(STUDY_ID) + mock(id) 둘 다 대응
                const {
                    id,
                    STUDY_ID,
                    studyName,
                    NAME,
                    auther,
                    NICKNAME,
                    point,
                    day,
                    goal,
                    background,
                    reactionData,
                } = item;

                const studyId = id ?? STUDY_ID; // 클릭 시 보낼 id
                const key = studyId;
                const title = studyName ?? NAME ?? "";
                const author = auther ?? NICKNAME ?? "";
                const safePoint = point ?? 0;
                const safeDay = day ?? 0;
                const safeGoal = goal ?? "";
                const bg = background ?? null;
                const reactions = Array.isArray(reactionData)
                    ? reactionData
                    : [];

                const handleClick = () => {
                    if (!studyId) return;
                    // /detail?id=1 이런 식으로 이동
                    navigate(`/detail?id=${studyId}`);
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
                                    className={`title-box title-box-${size} title-box-${theme}`}
                                >
                                    <p
                                        className={`title-${size}`}
                                        style={changeFontColor(bg)}
                                    >
                                        <span
                                            className="auther"
                                            style={changeFontColor(bg)}
                                        >
                                            {author}
                                        </span>
                                        {title && `의 ${title}`}
                                    </p>
                                    <Tag
                                        type="point"
                                        size={size}
                                        value={safePoint}
                                        theme={changeTagTheme(bg)}
                                    />
                                </div>
                                <span style={changeFontColor(bg)}>
                                    {safeDay}일째 진행 중
                                </span>
                            </header>

                            <p
                                className={`goal-${size}`}
                                style={changeFontColor(bg)}
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
