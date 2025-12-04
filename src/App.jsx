import "@styles/App.css";
import { Routes, Route } from "react-router-dom";
import GNB from "@molecule/gnb/GNB";
import Habit from "@pages/Habit";
import Home from "@pages/Home";
import Detail from "@pages/Detail";
import Focus from "@pages/Focus";
import Study from "@pages/Study";
import Toast from "./components/atoms/toast/Toast";

function App() {
    return (
        <>
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
