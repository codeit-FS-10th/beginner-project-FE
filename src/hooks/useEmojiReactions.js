import { useState } from "react";

// initial: 서버에서 불러온 초기 이모지 리스트 (없으면 [])
export function useEmojiReactions(initial = []) {
    const [reactions, setReactions] = useState(initial);

    // 기존 이모지 클릭 → count + 1
    const handleEmojiClick = (emoji) => {
        setReactions((prev) =>
            prev.map((item) =>
                item.emoji === emoji ? { ...item, count: item.count + 1 } : item
            )
        );
    };

    // "추가" 버튼 → 픽커에서 이모지 선택
    const handleAddEmoji = (emoji) => {
        setReactions((prev) => {
            const exists = prev.find((item) => item.emoji === emoji);

            if (exists) {
                // 이미 있으면 count만 +1
                return prev.map((item) =>
                    item.emoji === emoji
                        ? { ...item, count: item.count + 1 }
                        : item
                );
            }

            // 없으면 새로 추가
            return [
                ...prev,
                {
                    id: Date.now(), // 프론트 임시 id
                    emoji,
                    count: 1,
                    me: true,
                },
            ];
        });
    };

    return {
        reactions,
        handleEmojiClick,
        handleAddEmoji,
    };
}
