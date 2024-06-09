import { useState } from "react";

export function SeeAllUsers() {
  const [users, setUsers] = useState([]);

  async function fetchAllUsers() {
    const response = await fetch("/users");
    if (!response.ok) {
      throw new Error("Could not fetch all users");
    }
    const data = await response.json();
    setUsers(data);
    console.log(data[3].username);
    console.log(data[4].username);
    console.log(data[2].username);
    console.log(data[1].username);
  }

  return (
    <div>
      <button onClick={fetchAllUsers}>
        Click here to see all the users that have signed up{" "}
      </button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}
