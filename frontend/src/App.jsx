import React from "react";
import { Outlet } from "react-router-dom";
import Login from "./Components/Login";

function App() {
  return (
    <div>
      <Login/>
      <Outlet/>
    </div>
  );
}

export default App;
