import pkg from "pg";
const { Pool } = pkg;
export const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "tokenpractice",
  password: "Michigan!1", // Replace 'yourPassword' with the actual password
  port: 5432,
});
