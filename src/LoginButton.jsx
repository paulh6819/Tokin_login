import { useState } from "react";
export function LoginButton() {
  const [userName, setUserName] = useState("");

  function makingAUser(event) {
    setUserName(event.target.value);
  }

  function submitUserToDataBase() {
    console.log("this button is working on the front end");
    if (!hasPaid) {
      alert("Please donate to login, server space isnt free - Thank you!");
    }
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName }),
    });
  }

  const [token, setToken] = useState(10);
  const [hasPaid, setHasPaid] = useState(false);
  const [colorForButton, setColorForButton] = useState("red");

  async function tokenChange() {
    if (!hasPaid) {
      alert("Please donate to use this button!!");
    }
    if (!userName) {
      alert("Please log in with a user name to use your fun tokens!");
    }
    const tokenCount = token - 1;
    const user = userName;
    try {
      const response = await fetch("/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenCount, user }),
      });
      if (!response.ok) {
        throw new Error("Could not update token count");
      }
      const updatedResponse = await response.text();
      setToken(updatedResponse);
      console.log(updatedResponse);
    } catch {
      console.log("Could not update token count");
    }
  }
  function hasPaidChange() {
    setHasPaid(true);
    setColorForButton("green");
  }

  return (
    <div>
      <div>
        <button onClick={hasPaidChange}>
          Click this button if you have donated your money to the server
        </button>
        <h2 style={{ backgroundColor: colorForButton }}>
          {hasPaid
            ? "You have donated your money and you are considered a subscriber!"
            : "You have not donated your money"}
        </h2>
      </div>
      <input
        type="text"
        placeholder="Make up user name here"
        onChange={makingAUser}
      />
      {<p> {userName}</p>}
      <button className="login-button" onClick={submitUserToDataBase}>
        Login with new user name or existing user name
      </button>

      <button onClick={tokenChange}>Click to use a fun Token</button>
      <h2>{token}</h2>
    </div>
  );
}
