import "@styles/ui/modal.css";
import BaseButton from "@Atoms/button/BaseButton";

function Modal({ children, buttons = [] }) {
    const isSingle = buttons.length === 1;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-content">
                    <div className="modal-children">
                        <h2>{children}</h2>
                    </div>

                    <div className="modal-cofirm-btn">
                        <div
                            className={`modal-buttons ${
                                isSingle ? "single" : "multi"
                            }`}
                        >
                            {buttons.map((btn) => (
                                <BaseButton
                                    type={btn.type}
                                    size={isSingle ? "full" : "xl"}
                                >
                                    {btn.label}
                                </BaseButton>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
