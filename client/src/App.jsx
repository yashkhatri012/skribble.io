import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import SkribblHome from "./pages/SkribblHome";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<SkribblHome />}
      />

      <Route
        path="/game/:roomId"
        element={<GamePage />}
      />

    </Routes>
  );
}

export default App;