import "./App.css";
import Mainpage from "./Pages/Mainpage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Mainpage />} />
      </Routes>
    </div>
  );
}

export default App;
