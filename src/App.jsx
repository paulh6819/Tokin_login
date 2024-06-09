import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { LoginButton } from "./LoginButton.jsx";
import { SeeAllUsers } from "./SeeAllUsers.jsx";

function App() {
  return (
    <>
      <div>
        <h1>
          You can only use ten tokens a minute, if you use all ten tokens you
          will have to wait a minute to use them again.
        </h1>
        <LoginButton />
        <SeeAllUsers />
      </div>
    </>
  );
}

export default App;
