import EmojiBar from "./EmojiBar";
import { useEmojiReactions } from "@hooks/useEmojiReactions";

export default function EmojiReactionsPanel({
    studyId,
    initialReactions = [],
}) {
    const { reactions, handleEmojiClick, handleAddEmoji } = useEmojiReactions(
        studyId,
        initialReactions
    );

    return (
        <EmojiBar
            reactions={reactions}
            onEmojiClick={handleEmojiClick}
            onAddEmoji={handleAddEmoji}
        />
    );
}
