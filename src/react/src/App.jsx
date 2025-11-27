import { useState } from "react";
import Input from "./components/atom/input/Input";
import Dropdown from "./components/atom/dropdown/Dropdown";
import Toast from "./components/atom/toast/Toast";
import "./App.css";

export default function App() {
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2000);
  };

  return (
    <div className="container">
      <h1>Atom components</h1>

      <Input />

      <Dropdown />

      <button
        className="toast-button"
        onClick={() => addToast("point", "50 포인트를 획득했습니다!")}
      >
        포인트 토스트 테스트
      </button>

      <div id="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
          />
        ))}
      </div>
    </div>
  );
}
