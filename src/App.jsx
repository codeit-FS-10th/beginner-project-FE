import "./assets/styles/App.css";
import { Routes, Route } from "react-router-dom";
import GNB from "./components/Molecule/GNB/GNB";
import Habit from "./components/pages/Habit";
import Home from "./components/pages/Home";
import Detail from "./components/pages/Detail";
import Focus from "./components/pages/Focus";
import Study from "./components/pages/Study";

function App() {
  return (
    <>
      <GNB />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/habit" element={<Habit />} />
          <Route path="/study" element={<Study />} />
          <Route path="/focus" element={<Focus />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
