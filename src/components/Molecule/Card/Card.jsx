import React from "react";
import Tag from "../../Atoms/tag/Tag";

const Card = ({ size, studyData }) => {
  const sizeClass = {
    sm: "card--sm",
    lg: "card--lg",
  }[size];

  return (
    <div className="card card--${sizeClass}">
      {studyData.map((item) => {
        <div>
          <div>
            <h3>{item.studyname}</h3>
            <Tag type={item.point} value={item.point} size="lg" />
          </div>
          <span>{`${item.day}일째 진행 중`}</span>
          <span>{item.goal}</span>
          <Tag
            type={item.reactionData[1].type}
            emoji={item.reactionData[1].emoji}
            value={item.reactionData[1].value}
            size="lg"
          />
          ;
        </div>;
      })}
    </div>
  );
};

export default Card;
