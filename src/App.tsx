import { Routes, Route } from "react-router-dom";
import AnimeDetail from "./AnimeDetail";
import HomePage from "./HomePage"; // Move your homepage logic here

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/anime/:id" element={<AnimeDetail />} />
    </Routes>
  );
}

export default App;
