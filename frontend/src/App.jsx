import "./App.css";
import { Routes, Route, Link } from "react-router-dom";

import Signin from "./pages/Signin";

const App = () => {
  return (
    <Routes>
      <Route path="/signin" element={<Signin />}></Route>
    </Routes>
  );
};

export default App;
