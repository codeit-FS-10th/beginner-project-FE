import { useState } from "react";

export function useEmojiReactions(studyId, initial = []) {
    const [reactions, setReactions] = useState(initial);

    const sendToServer = async (rawCode) => {
        const code = rawCode.toUpperCase();

        try {
            const res = await fetch(`/api/studies/${studyId}/emoji`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }), // 항상 대문자 코드로 보냄
            });

            if (!res.ok) {
                if (process.env.NODE_ENV === "development") {
                    console.error("emoji post 실패", await res.text());
                }
            }
        } catch (err) {
            if (process.env.NODE_ENV === "development") {
                console.error("emoji post 에러", err);
            }
        }
    };

    const handleEmojiClick = (rawCode) => {
        const code = rawCode.toUpperCase();

        sendToServer(code);

        setReactions((prev) =>
            prev.map((item) =>
                item.code.toUpperCase() === code
                    ? { ...item, count: item.count + 1 }
                    : item
            )
        );
    };

    const handleAddEmoji = ({ emoji, code: rawCode }) => {
        const code = rawCode.toUpperCase();

        sendToServer(code);

        setReactions((prev) => {
            const exists = prev.find(
                (item) => item.code.toUpperCase() === code
            );

            if (exists) {
                return prev.map((item) =>
                    item.code.toUpperCase() === code
                        ? { ...item, count: item.count + 1 }
                        : item
                );
            }

            return [
                ...prev,
                {
                    id: code, // id도 통일해서 사용
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
