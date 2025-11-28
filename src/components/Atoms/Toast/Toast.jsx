import { useEffect, useState } from "react";
import "./Toast.css";

export default function Toast({
  point,
  type = "point",
  duration = 2000,
  onClose,
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.(); 
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  if (!visible) return null;

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
