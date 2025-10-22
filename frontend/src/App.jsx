import React from "react";
import { Outlet } from "react-router-dom";
import Login from "./Components/Login";

function App() {
  return (
    <div>
      <Outlet/>
    </div>
  );
}

export default App;
