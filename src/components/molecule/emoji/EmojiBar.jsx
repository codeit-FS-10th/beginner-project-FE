// EmojiBar.jsx
import { useState } from "react";
import EmojiButton from "./EmojiButton";
import EmojiGroup from "./EmojiGroup";
import EmojiPickerWrapper from "./EmojiPickerWrapper";
import "@styles/EmojiBar.css";

export default function EmojiBar({ reactions, onEmojiClick, onAddEmoji }) {
    const [showGroup, setShowGroup] = useState(false);

    const previewCount = 4;
    const preview = reactions.slice(0, previewCount);
    const restCount = reactions.length - previewCount;

    return (
        <div>
            <div className="emoji-bar">
                {preview.map((item) => (
                    <EmojiButton
                        key={item.id}
                        variant="normal"
                        emoji={item.emoji}
                        count={item.count}
                        isActive={item.me}
                        // ⚠️ 기존: onEmojiClick?.(item.emoji)
                        // ✅ 변경: code 기준으로 클릭 전달
                        onClick={() => onEmojiClick?.(item.code)}
                    />
                ))}

                {reactions.length > previewCount && (
                    <EmojiButton
                        variant="more"
                        label={`+ ${restCount}..`}
                        onClick={() => setShowGroup((prev) => !prev)}
                    />
                )}

                <EmojiPickerWrapper onSelect={onAddEmoji}>
                    <EmojiButton variant="add" />
                </EmojiPickerWrapper>
            </div>

            {showGroup && (
                <EmojiGroup reactions={reactions} onEmojiClick={onEmojiClick} />
            )}
        </div>
    );
}
