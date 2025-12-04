import { useState } from "react";

export function useEmojiReactions(studyId, initial = []) {
    const [reactions, setReactions] = useState(initial);

    const sendToServer = async (code) => {
        try {
            const res = await fetch(`/api/studies/${studyId}/emoji`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            if (!res.ok) {
                console.error("emoji post 실패", await res.text());
            }
        } catch (err) {
            console.error("emoji post 에러", err);
        }
    };

    const handleEmojiClick = (code) => {
        sendToServer(code);
        setReactions((prev) =>
            prev.map((item) =>
                item.code === code ? { ...item, count: item.count + 1 } : item
            )
        );
    };

    const handleAddEmoji = ({ emoji, code }) => {
        sendToServer(code);

        setReactions((prev) => {
            const exists = prev.find((item) => item.code === code);

            if (exists) {
                return prev.map((item) =>
                    item.code === code
                        ? { ...item, count: item.count + 1 }
                        : item
                );
            }

            return [
                ...prev,
                {
                    id: code,
                    code,
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
