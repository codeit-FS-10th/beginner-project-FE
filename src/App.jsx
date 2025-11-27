import "./App.css";
import GNB from "./components/Molecule/GNB/GNB";
import Mainpage from "./Pages/Mainpage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <GNB />
      <main>
        <Routes>
          <Route path="/" element={<Mainpage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
