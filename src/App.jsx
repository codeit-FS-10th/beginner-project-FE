import { useState, useEffect } from "react";
import "@styles/App.css";
import { Routes, Route } from "react-router-dom";
import GNB from "@molecule/gnb/GNB";
import Habit from "@pages/Habit";
import Home from "@pages/Home";
import Detail from "@pages/Detail";
import Focus from "@pages/Focus";
import Study from "@pages/Study";
import Toast from "./components/atoms/toast/Toast";
import { setLoadingHandler } from "./api/axiosInstance";
import "@styles/atoms/loadingBar.css";

function App() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // axiosInstance에 로딩 핸들러 등록
        setLoadingHandler((isLoading) => {
            setLoading(isLoading);
        });
    }, []);

    useEffect(() => {
        if (loading) {
            // 로딩 시작 시 0%에서 시작
            setProgress(0);
            
            // 점진적으로 진행 (90%까지)
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return 90;
                    const increment = prev < 50 ? 15 : 5;
                    return Math.min(prev + increment, 90);
                });
            }, 100);

            return () => clearInterval(interval);
        } else {
            // 로딩 완료 시 100%까지 가고 사라짐
            setProgress(100);
            const timeout = setTimeout(() => {
                setProgress(0);
            }, 300);

            return () => clearTimeout(timeout);
        }
    }, [loading]);

    return (
        <>
            {progress > 0 && (
                <div className="loading-bar-container">
                    <div
                        className="loading-bar"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
            <GNB />
            <Toast />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/detail" element={<Detail />} />
                <Route path="/habit" element={<Habit />} />
                <Route path="/study" element={<Study />} />
                <Route path="/focus" element={<Focus />} />
            </Routes>
        </>
    );
}

export default App;
