import "./App.css";
import { Routes, Route } from "react-router-dom";
import Detail from "./components/Pages/Detail.jsx";
import Home from "./components/Pages/Home.jsx";

function App() {
    return (
        <div>
            <Routes>
                {/* 메인페이지 */}
                <Route path="/" element={<Home />} />
                <Route path="/Detail" element={<Detail />} />
                {/* <Route path="/Study" element={<Study />} />
                <Route path="/Habit" element={<Habit />} /> */}
            </Routes>
        </div>
    );
}

export default App;
