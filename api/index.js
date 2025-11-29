// api/index.js
// ChoreMate API for Kent (MINS 350 Prototype 2)

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Supabase Postgres
// You must have DATABASE_URL=... in your .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Supabase requires SSL
});

// ----------------------------
// HEALTH CHECK
// ----------------------------
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ----------------------------
// HOUSEHOLDS
// ----------------------------
app.get("/households", async (req, res) => {
  try {
    const result = await pool.query(
      `select id, name from households order by created_at desc`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /households error:", err);
    res.status(500).json({ error: "server_error" });
  }
});

app.post("/households", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name_required" });

  try {
    const result = await pool.query(
      `insert into households (name)
       values ($1)
       returning id, name`,
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /households error:", err);
    res.status(500).json({ error: "server_error" });
  }
});

// ----------------------------
// HOUSEHOLD MEMBERS
// ----------------------------
app.get("/households/:id/members", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `select id,
              household_id as "householdId",
              user_id as "userId",
              role
       from household_members
       where household_id = $1`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /households/:id/members error:", err);
    res.status(500).json({ error: "server_error" });
  }
});

// ----------------------------
// CHORES
// ----------------------------
app.get("/chores", async (req, res) => {
  const { householdId } = req.query;

  try {
    let result;
    if (householdId) {
      result = await pool.query(
        `select id,
                household_id as "householdId",
                name,
                description,
                frequency
         from chores
         where household_id = $1
         order by created_at desc`,
        [householdId]
      );
    } else {
      result = await pool.query(
        `select id,
                household_id as "householdId",
                name,
                description,
                frequency
         from chores
         order by created_at desc`
      );
    }

    res.json(result.rows);
  } catch (err) {
    console.error("GET /chores error:", err);
    res.status(500).json({ error: "server_error" });
  }
});

app.post("/chores", async (req, res) => {
  const { householdId, name, description, frequency } = req.body;

  if (!householdId || !name) {
    return res.status(400).json({ error: "householdId_and_name_required" });
  }

  try {
    const result = await pool.query(
      `insert into chores (household_id, name, description, frequency)
       values ($1, $2, $3, $4)
       returning id,
                 household_id as "householdId",
                 name,
                 description,
                 frequency`,
      [householdId, name, description, frequency]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /chores error:", err);
    res.status(500).json({ error: "server_error" });
  }
});

// ----------------------------
// CHORE ASSIGNMENTS
// ----------------------------
app.get("/assignments", async (req, res) => {
  try {
    const result = await pool.query(
      `select
          id,
          chore_id as "choreId",
          assigned_to as "assignedTo",
          due_date as "dueDate",
          status
       from chore_assignments
       order by created_at desc`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET /assignments error:", err);
    res.status(500).json({ error: "server_error" });
  }
});

app.post("/assignments", async (req, res) => {
  const { choreId, assignedTo, dueDate, status } = req.body;

  if (!choreId || !assignedTo || !dueDate) {
    return res.status(400).json({ error: "required_fields_missing" });
  }

  try {
    const result = await pool.query(
      `insert into chore_assignments (chore_id, assigned_to, due_date, status)
       values ($1, $2, $3, coalesce($4, 'pending'))
       returning id,
                 chore_id as "choreId",
                 assigned_to as "assignedTo",
                 due_date as "dueDate",
                 status`,
      [choreId, assignedTo, dueDate, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /assignments error:", err);
    res.status(500).json({ error: "server_error" });
  }
});

// ----------------------------
// START SERVER
// ----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ChoreMate API running on port ${PORT}`);
});
