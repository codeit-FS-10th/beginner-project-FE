import { useState } from "react";
import BaseButton from "@atoms/button/BaseButton";
import Input from "@atoms/input/Input";
import "@styles/organism/ModalPwd.css";
import { showErrorToast } from "@atoms/toast/Toast";
import { verifyStudyPassword } from "@api/service/studyservice";

function ModalPwd({ onClose, onVerified, actionType, studyId }) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // 버튼 문구 자동 변경
    const buttonLabel =
        actionType === "delete" ? "삭제하러 가기" : "수정하러 가기";

    const handleSubmit = async () => {
        if (!studyId) {
            showErrorToast("❌ studyId가 전달되지 않았습니다.");
            return;
        }

        if (!password.trim()) {
            showErrorToast("❗ 비밀번호를 입력해주세요.");
            return;
        }

        try {
            setLoading(true);

            const res = await verifyStudyPassword(studyId, password);

            if (res.verified) {
                // Detail.jsx 에게 비밀번호 통과 사실 전달
                onVerified?.(actionType);
                onClose();
            } else {
                showErrorToast("🚨 비밀번호가 일치하지 않습니다.");
            }
        } catch (err) {
            console.error(err);
            showErrorToast("🚨 비밀번호가 일치하지 않습니다.");
        } finally {
            setLoading(false);
        }
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
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "확인 중..." : buttonLabel}
                            </BaseButton>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalPwd;
