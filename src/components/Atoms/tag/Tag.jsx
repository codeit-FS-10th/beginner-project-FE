import React from "react";
import { LeafIcon } from "../../../assets/Icons";
import "../../../assets/styles/tag.css";

const Tag = ({ type, value, emoji, size = "sm", theme = "dark" }) => {
  const typeClass = {
    point: "tag--type-point",
    reaction: "tag--type-reaction",
  }[type];

  const themeClass = {
    dark: "tag--theme-dark",
    light: "tag--theme-light",
  }[theme];

  const sizeClass = {
    sm: "tag--size-sm",
    lg: "tag--size-lg",
  }[size];

  const displayEmoji = type === "point" ? <LeafIcon /> : emoji;
  const text = type === "point" ? `${value}P 획득` : String(value);

  return (
    <div className={`tag ${typeClass} ${sizeClass} ${themeClass}`}>
      <span className={`tag--emoji-${size}`}>{displayEmoji}</span>
      <span className={`tag--label-${size}`}>{text}</span>
    </div>
  );
};

export default Tag;
