import React from "react";
import LeafIcon from "../Icons/LeafIcon";
import "./tag.css";

const Tag = ({ type, value, emoji, size = "sm", theme = "dark" }) => {
  const typeClass = {
    point: "tag--type-point",
    reaction: "tag--type-reaction",
  }[type];

  const themeClass = {
    dark: "tag--theme-dark",
    light: "tag--theme-light",
  }[theme];

  const displayEmoji = type === "point" ? <LeafIcon /> : emoji;
  const text = type === "point" ? `${value}P 획득` : String(value);

  return (
    <div className={`tag ${typeClass} ${themeClass}`}>
      <span className={`tag--emoji-${size}`}>{displayEmoji}</span>
      <span className={`tag--label-${size}`}>{text}</span>
    </div>
  );
};

export default Tag;
