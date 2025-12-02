// src/pages/EmojiTestPage.jsx
import { useState } from "react";
import EmojiGroup from "../components/Molecule/Emoji/EmojiGroup";

export default function EmojiTestPage() {
    const [reactions, setReactions] = useState([
        { id: 1, emoji: "👩🏻‍💻", count: 37, me: false },
        { id: 2, emoji: "👍", count: 11, me: true },
        { id: 3, emoji: "🤩", count: 9, me: false },
        { id: 4, emoji: "🔥", count: 21, me: false },
        { id: 5, emoji: "😂", count: 17, me: false },
        { id: 6, emoji: "❤️", count: 55, me: false },
    ]);

    // 기존 이모지 클릭 (count +1)
    const handleEmojiClick = (emoji) => {
        setReactions((prev) =>
            prev.map((item) =>
                item.emoji === emoji ? { ...item, count: item.count + 1 } : item
            )
        );
    };

    // + 버튼에서 새로운 이모지 추가
    const handleAddEmoji = (emoji) => {
        setReactions((prev) => {
            const found = prev.find((item) => item.emoji === emoji);
            if (found) {
                return prev.map((item) =>
                    item.emoji === emoji
                        ? { ...item, count: item.count + 1 }
                        : item
                );
            }
            return [
                ...prev,
                {
                    id: Date.now(),
                    emoji,
                    count: 1,
                    me: true,
                },
            ];
        });
    };

    return (
        <div style={{ padding: 40, background: "#333", minHeight: "100vh" }}>
            <h1 style={{ color: "#fff", marginBottom: 20 }}>
                Emoji + 버튼 테스트
            </h1>

            <EmojiGroup
                reactions={reactions}
                onEmojiClick={handleEmojiClick}
                onAddEmoji={handleAddEmoji}
            />
        </div>
    );
}
