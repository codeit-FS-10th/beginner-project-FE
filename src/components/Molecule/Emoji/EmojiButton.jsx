import React from "react";
import "../../../assets/styles/EmojiButton.css";

function EmojiButton({ emoji, count }) {
    return (
        <div className="emoji-button">
            <span className="emoji-icon">{emoji}</span>
            <span className="emoji-count">{count}</span>
        </div>
    );
}

export default EmojiButton;
