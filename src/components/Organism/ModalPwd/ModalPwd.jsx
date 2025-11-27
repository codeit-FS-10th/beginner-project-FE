import BaseButton from "../../Atoms/button/BaseButton/BaseButton";
import "./ModalPwd.css";

function ModalPwd() {
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-content">
                    <header className="modal-header">
                        <div className="title-wrap">
                            <h2>연우의 개발공장</h2>
                            <button className="close-btn">나가기</button>
                        </div>
                        <span className="sub-text">권한이 필요해요!</span>
                    </header>

                    <form className="modal-body">
                        <label>비밀번호</label>
                        <input
                            type="password"
                            placeholder="비밀번호를 입력해주세요."
                        />

                        <footer className="modal-footer">
                            <BaseButton type="default" size="xl">
                                수정하러 가기
                            </BaseButton>
                        </footer>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ModalPwd;
