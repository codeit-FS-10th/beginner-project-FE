import "./App.css";
import { Routes, Route } from "react-router-dom";
import GNB from "./components/Molecule/GNB/GNB";
import Habit from "./components/pages/Habit";
import Home from "./components/pages/Home";
import Detail from "./components/pages/Detail";

function App() {
  return (
    <div>
      <GNB />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Detail" element={<Detail />} />
          <Route path="/Habit" element={<Habit />} />
          {/* <Route path="/Study" element={<Study />} />
                <Route path="/Habit" element={<Habit />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
