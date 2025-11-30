import React from "react";
import Tag from "@atoms/tag/Tag";
import "@styles/molecule/card.css";

const Card = ({ size = "lg", theme = "dark", studyData = [] }) => {
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
    };

    const changeTagTheme = (background) => {
        if (!background) return {};
        if (background.type === "color") {
            return "light";
        }
        if (background.type === "image") {
            return "dark";
        }
    };

    return (
        <>
            {studyData.map((item) => (
                <div
                    key={item.id}
                    className={`card ${sizeClass} ${themeClass}`}
                    style={getBackgroundStyle(item.background)}
                >
                    <article>
                        {/* 카드헤더 - title + point 태그 + day */}
                        <header>
                            <div
                                className={`title-box title-box-${size} title-box-${theme}`}
                            >
                                <p
                                    className={`title-${size}`}
                                    style={changeFontColor(item.background)}
                                >
                                    <span
                                        className="auther"
                                        style={changeFontColor(item.background)}
                                    >
                                        {item.auther}
                                    </span>
                                    {`의 ${item.studyName}`}
                                </p>
                                <Tag
                                    type="point"
                                    size={size}
                                    value={item.point}
                                    theme={changeTagTheme(item.background)}
                                />
                            </div>
                            <span
                                style={changeFontColor(item.background)}
                            >{`${item.day}일째 진행 중`}</span>
                        </header>
                        {/* 목표 문구 */}
                        <p
                            className={`goal-${size}`}
                            style={changeFontColor(item.background)}
                        >
                            {item.goal}
                        </p>

                        {/* reaction 태그들 */}
                        <ul className="card--reactions">
                            {item.reactionData.map((reaction) => (
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
            ))}
        </>
    );
};

export default Card;
