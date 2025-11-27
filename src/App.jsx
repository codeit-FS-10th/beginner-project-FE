import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/home";
import Detail from "./Pages/detail";
import GNB from "./components/Molecule/GNB/GNB";

function App() {
  return (
    <div>
      <GNB />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Detail" element={<Detail />} />
          {/* <Route path="/Study" element={<Study />} />
                <Route path="/Habit" element={<Habit />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
