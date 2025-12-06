import React from "react";
import { LeafIcon } from "@assets/Icons";
import "@styles/atoms/tag.css";

const Tag = ({
    type,
    value,
    emoji,
    size = "sm",
    theme = "dark",
    variant, // ← 추가
}) => {
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
        emoji: "tag--size-emoji",
    }[size];

    const variantClass = variant ? `tag--variant-${variant}` : "";

    const displayEmoji = type === "point" ? <LeafIcon /> : emoji;
    const text = type === "point" ? `${value}P 획득` : String(value);

    return (
        <div
            className={`tag ${typeClass} ${sizeClass} ${themeClass} ${variantClass}`}
        >
            <span className={`tag--emoji-${size}`}>{displayEmoji}</span>
            <span className={`tag--label-${size}`}>{text}</span>
        </div>
    );
};

export default Tag;
