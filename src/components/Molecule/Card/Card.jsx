import React from "react";
import Tag from "../../Atoms/tag/Tag";
import "../../../assets/styles/card.css";

const Card = ({ size = "lg", theme = "dark", studyData = [] }) => {
  const sizeClass = {
    sm: "card--sm",
    lg: "card--lg",
  }[size];

  const themeClass = {
    dark: "card--dark",
    light: "card--light",
  }[theme];

  return (
    <>
      {studyData.map((item) => (
        <div key={item.id} className={`card ${sizeClass} ${themeClass}`}>
          <article>
            {/* 카드헤더 - title + point 태그 + day */}
            <header>
              <div className={`title-box title-box-${size} title-box-${theme}`}>
                <p className={`title-${size}`}>
                  <span className={`auther ${theme}`}>{item.auther}</span>
                  {`의 ${item.studyName}`}
                </p>
                <Tag
                  type="point"
                  size={size}
                  value={item.point}
                  theme={theme}
                />
              </div>
              <span>{`${item.day}일째 진행 중`}</span>
            </header>
            {/* 목표 문구 */}
            <p className={`goal-${size}`}>{item.goal}</p>

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
