import express from "express";
import { pool } from "./database.js";
const app = express();
app.use(express.json());

app.get("/users", async (req, res) => {
  console.log("this is the users endpoint");
  try {
    const result = await pool.query("SELECT * FROM users");

    console.log(result.rows, "this is the result");
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  console.log(req.body.userName);
  const userName = req.body.userName;
  if (!userName) {
    return res.status(400).send("please provide a user name");
  }

  try {
    await pool.query(
      "INSERT INTO users (username) VALUES ($1) ON CONFLICT DO NOTHING",
      [userName]
    );
    const result = await pool.query(
      `
      WITH updated AS (
        UPDATE users
        SET token_count = 10,
            token_count_down_period = NULL
        WHERE username = $1 AND token_count < 10 AND 
              token_count_down_period IS NOT NULL AND
              token_count_down_period < NOW() - INTERVAL '1 minute'
        RETURNing token_count, token_count_down_period
      )
      SELECT * FROM updated
      UNION ALL
      SELECT token_count, token_count_down_period FROM users WHERE username = $1 AND NOT EXISTS (SELECT 1 FROM updated)
    `,
      [userName]
    );
    console.log(result.rows[0], "this is the result");
    res.json({
      message: "Login successful",
      tokenCount: result.rows[0].token_count,
      lastReset: result.rows[0].token_count_down_period || "No reset needed",
    });
  } catch (error) {
    console.error("Database error during login:", error);
    res.status(500).send("Could not process login due to server error");
  }
});

app.post("/token", async (req, res) => {
  console.log(req.body.tokenCount, req.body.user);
  const oldTokenCount = await pool.query(
    "SELECT token_count FROM users WHERE username = $1",
    [req.body.user]
  );
  console.log(
    oldTokenCount.rows[0]?.token_count,
    "this is the old token count"
  );
  const newTokenCount = oldTokenCount.rows[0]?.token_count - 1;
  const user = req.body.user;
  console.log(newTokenCount, user, "this is the new token count and user");
  try {
    await pool.query("UPDATE users SET token_count = $1 WHERE username = $2", [
      newTokenCount,
      user,
    ]);
    res.send(newTokenCount.toString());
  } catch {
    console.log("Could not update token count");
    // res.send("Could not update token count");
  }
});

app.get("/", (req, res) => {
  res.send("Hello World from the server!");
});

app.listen(3676, () => {
  console.log("Server is running on port 3676");
});
