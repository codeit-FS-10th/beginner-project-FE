import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

export default function EmojiPickerWrapper({ onSelect, children }) {
    const [open, setOpen] = useState(false);

    const toggle = () => setOpen((v) => !v);
    const handleEmojiClick = (emojiData) => {
        onSelect?.(emojiData.emoji);
        setOpen(false);
    };

    return (
        <div style={{ position: "relative" }} className="emoji-picker-wrapper">
            <div onClick={toggle}>{children}</div>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "48px",
                        left: 0,
                        zIndex: 10,
                    }}
                >
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
            )}
        </div>
    );
}

//==============================================================//
// [EmojiPickerWrapper 사용법]
//
// 이 컴포넌트는 `children`을 클릭하면 이모지 픽커를 열어주고,
// 사용자가 선택한 이모지를 onSelect(emoji)로 부모에게 전달함
//
// + 버튼 형태로 쓰고 싶다면 다음과 같이 사용:
//
//   <EmojiPickerWrapper onSelect={handleAddEmoji}>
//       <EmojiButton variant="add" />
//   </EmojiPickerWrapper>
//
// 이러면 + 버튼을 누르면 picker가 열리고, 선택된 이모지가
// handleAddEmoji(emoji) 로 전달됨.
//==============================================================//
