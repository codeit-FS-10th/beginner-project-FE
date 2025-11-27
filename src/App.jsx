import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/home";
import Detail from "./Pages/detail";

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
