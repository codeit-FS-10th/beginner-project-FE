import React from "react";
import EmojiButton from "./EmojiButton";
import "../../../assets/styles/EmojiButton.css";

export default function EmojiGroup() {
    const emojiData = [
        { emoji: "🙇🏻‍♀️", count: 37 },
        { emoji: "👍🏻", count: 11 },
        { emoji: "🤩", count: 9 },
        { emoji: "🤩", count: 9 },
        { emoji: "🙇🏻‍♀️", count: 37 },
    ];

    return (
        <div className="emoji-group">
            {emojiData.map((item, index) => (
                <EmojiButton
                    key={index}
                    emoji={item.emoji}
                    count={item.count}
                />
            ))}
        </div>
    );
}
