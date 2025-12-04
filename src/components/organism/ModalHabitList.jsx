import BaseButton from "@atoms/button/BaseButton";
import "@styles/organism/ModalHabitList.css";
import Chip from "@atoms/chip/chip";

function ModalHabitList() {
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-content">
                    <header className="modal-header">
                        <h2>습관 목록</h2>
                    </header>
                    <div className="modal-body">
                        <div></div>
                        <Chip>하이</Chip>
                    </div>

                    <footer className="modal-footer">
                        <BaseButton type="cancle" size="md">
                            취소
                        </BaseButton>
                        <BaseButton type="default" size="md">
                            수정완료
                        </BaseButton>
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default ModalHabitList;
