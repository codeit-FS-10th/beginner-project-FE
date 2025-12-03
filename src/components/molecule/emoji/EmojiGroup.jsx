import React from "react";
import EmojiButton from "./EmojiButton";
import "@styles/EmojiGroup.css";

export default function EmojiGroup({ reactions, onEmojiClick }) {
    return (
        <div className="emoji-group">
            <div className="emoji-group__inner">
                {reactions.map((item) => (
                    <EmojiButton
                        key={item.id}
                        emoji={item.emoji}
                        count={item.count}
                        isActive={item.me}
                        onClick={() => onEmojiClick?.(item.emoji)}
                    />
                ))}
            </div>
        </div>
    );
}
