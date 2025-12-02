import { useState } from "react";
import BaseButton from "@atoms/button/BaseButton";
import Input from "@atoms/input/Input";
import "@styles/organism/ModalPwd.css";
import { showErrorToast } from "@atoms/toast/Toast";

function ModalPwd({ onClose }) {
    const [password, setPassword] = useState("");

    const handleClick = () => {
        showErrorToast("🚨 비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-content">
                    <header className="modal-header">
                        <div className="title-wrap">
                            <h2>연우의 개발공장</h2>
                            <button className="close-btn" onClick={onClose}>
                                나가기
                            </button>
                        </div>
                        <span className="sub-text">권한이 필요해요!</span>
                    </header>

                    <div className="modal-body">
                        <label>비밀번호</label>

                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력해 주세요"
                        />

                        <footer className="modal-footer">
                            <BaseButton
                                type="default"
                                size="full"
                                onClick={handleClick}
                            >
                                수정하러 가기
                            </BaseButton>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalPwd;
