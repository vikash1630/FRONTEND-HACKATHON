import { Routes, Route } from "react-router-dom";
import Login from "./components/Global/Login";
import Signup from "./components/Global/Signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
