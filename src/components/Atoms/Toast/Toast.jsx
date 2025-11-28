import { useEffect } from "react";
import "./Toast.css";

export default function Toast({ point, type = "point", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); //2초 후 자동 닫기

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      {type === "point" && (
       <h3 className="point_lg">
        🎉 <span className="point_number">{point}</span>포인트를 획득했습니다!
        </h3>
        )}

      {type === "warning" && (
       <h3 className="warning_lg">🚨 집중이 중단되었습니다!</h3>
       )}
    </div>
  );
}
