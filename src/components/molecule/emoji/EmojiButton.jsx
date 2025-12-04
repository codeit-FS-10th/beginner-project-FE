import SmileIcon from "@assets/Img/ic_smile.svg";
import "@styles/EmojiButton.css";

export default function EmojiButton({
    variant = "normal", // 'normal' | 'more' | 'add'
    emoji,
    count,
    label,
    onClick,
    isActive = false,
}) {
    return (
        <button
            type="button"
            className={`
                emoji-button
                ${variant === "normal" ? "emoji-button--normal" : ""}
                ${variant === "add" ? "emoji-button--add" : ""}
                ${variant === "more" ? "emoji-button--more" : ""}
                ${isActive ? "emoji-button--active" : ""}
            `}
            onClick={onClick}
        >
            {/* ------------------------
                NORMAL (이모지 + 카운트)
            ------------------------- */}
            {variant === "normal" && (
                <>
                    <span className="emoji-normal-icon">{emoji}</span>
                    <span className="emoji-normal-count">{count}</span>
                </>
            )}

            {/* ------------------------
                MORE (더보기 버튼)
            ------------------------- */}
            {variant === "more" && (
                <span className="emoji-more-label">{label}</span>
            )}

            {/* ------------------------
                ADD (이모지 추가 버튼)
            ------------------------- */}
            {variant === "add" && (
                <>
                    <img
                        src={SmileIcon}
                        alt="add emoji"
                        className="emoji-add-icon"
                    />
                    <span className="emoji-add-label">추가</span>
                </>
            )}
        </button>
    );
}
