import React from "react";
import EmojiIcon from "../../../assets/Icons/EmojiIcon";
import "@styles/atoms/reactionAddButton.css";
const ReactionAddButton = () => {
    return (
        <button className="reaction-add-btn">
            <span className="icon">
                <EmojiIcon />
            </span>
            <span className="label">추가</span>
        </button>
    );
};

export default ReactionAddButton;
