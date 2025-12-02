import React from "react";
import EmojiButton from "./EmojiButton";
import EmojiPickerWrapper from "./EmojiPickerWrapper";
import "../../../styles/EmojiGroup.css";

export default function EmojiGroup({ reactions, onEmojiClick, onAddEmoji }) {
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
                <EmojiPickerWrapper onSelect={onAddEmoji}>
                    <EmojiButton variant="add" />
                </EmojiPickerWrapper>
            </div>
        </div>
    );
}
