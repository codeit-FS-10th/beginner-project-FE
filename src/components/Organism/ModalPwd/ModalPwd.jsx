import "./ModalPwd.css";

function ModalPwd() {
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <header className="modal-header">
                    <h2>연우의 개발공장</h2>
                    <span>권한이 필요해요</span>
                </header>

                <div className="modal-body">
                    <label>비밀번호</label>
                    <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요."
                    />
                </div>

                <footer className="modal-footer">
                    <button>수정</button>
                </footer>
            </div>
        </div>
    );
}

export default ModalPwd;
