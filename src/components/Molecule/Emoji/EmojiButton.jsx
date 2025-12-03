import "@styles/EmojiButton.css";

export default function EmojiButton({
    emoji,
    count,
    isActive = false,
    onClick,
    variant = "default",
}) {
    const isAdd = variant === "add"; // 따로 스타일링을 위해 변수 생성 (EmojiPickerWrapper에서 사용됨)

    return (
        <button
            type="button"
            className={`emoji-button 
                ${isActive ? "emoji-button--active" : ""} 
                ${isAdd ? "emoji-button--add" : ""}`}
            onClick={onClick}
        >
            {isAdd ? (
                <span className="emoji-button__icon">+</span>
            ) : (
                <>
                    <span className="emoji-button__icon">{emoji}</span>
                    <span className="emoji-button__count">{count}</span>
                </>
            )}
        </button>
    );
}
