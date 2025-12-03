// src/components/molecule/emoji/EmojiReactionsPanel.jsx
import EmojiBar from "./EmojiBar";
import { useEmojiReactions } from "@hooks/useEmojiReactions"; // alias 없으면 상대경로로 바꿔

export default function EmojiReactionsPanel({ initialReactions = [] }) {
    const { reactions, handleEmojiClick, handleAddEmoji } =
        useEmojiReactions(initialReactions);

    // 나중에 서버랑 동기화하고 싶으면 여기서 reactions를 활용해서
    // useEffect로 onChange 같은 거 붙이면 됨

    return (
        <EmojiBar
            reactions={reactions}
            onEmojiClick={handleEmojiClick}
            onAddEmoji={handleAddEmoji}
        />
    );
}
