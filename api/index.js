// api/index.js
// ChoreMate API for Kent (MINS 350 Prototype 2)

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublishableKey =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    "Missing SUPABASE_URL and/or SUPABASE_PUBLISHABLE_KEY in API environment. Auth endpoints will fail until configured."
  );
}

const supabase = createClient(supabaseUrl || "", supabasePublishableKey || "", {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Optional: Secret key can be used later for server-side admin tasks.
// Keep it server-only. Do not expose it to the client.
void supabaseSecretKey;

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    const token = match?.[1];

    if (!token) return res.status(401).json({ error: "missing_bearer_token" });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: "invalid_token" });
    }

    req.user = data.user;

    // Supabase client that runs queries AS the authenticated user (RLS applies)
    req.supabase = createClient(supabaseUrl || "", supabasePublishableKey || "", {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ error: "server_error" });
  }
}

// ----------------------------
// HEALTH CHECK
// ----------------------------
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ----------------------------
// AUTH (SUPABASE via API ONLY)
// ----------------------------
app.post("/auth/request-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "email_required" });

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.error("POST /auth/request-otp error:", error);
      return res.status(400).json({ error: "otp_request_failed" });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("POST /auth/request-otp error:", err);
    return res.status(500).json({ error: "server_error" });
  }
});

app.post("/auth/verify-otp", async (req, res) => {
  const { email, token } = req.body;
  if (!email || !token) {
    return res.status(400).json({ error: "email_and_token_required" });
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error || !data?.session) {
      console.error("POST /auth/verify-otp error:", error);
      return res.status(400).json({ error: "otp_verify_failed" });
    }

    return res.json({
      accessToken: data.session.access_token,
      user: data.user,
    });
  } catch (err) {
    console.error("POST /auth/verify-otp error:", err);
    return res.status(500).json({ error: "server_error" });
  }
});

app.get("/auth/me", requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

app.use(["/households", "/chores", "/assignments"], requireAuth);

// ----------------------------
// HOUSEHOLDS
// ----------------------------
app.get("/households", async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from("households")
      .select("id,name");

    if (error) {
      console.error("GET /households error:", error);
      return res.status(500).json({
        error: "server_error",
        supabase: {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
      });
    }

    res.json(data);
  } catch (err) {
    console.error("GET /households error:", err);
    res.status(500).json({ error: "server_error" });
  }
});

app.get("/households/:id/member-users", async (req, res) => {
  const { id } = req.params;

  try {
    const { data: members, error: membersError } = await req.supabase
      .from("household_members")
      .select("user_id, role")
      .eq("household_id", id);

    if (membersError) {
      if (membersError.code === "PGRST205") {
        return res.json([]);
      }
      console.error("GET /households/:id/member-users error:", membersError);
      return res.status(500).json({ error: "server_error" });
    }

    const result = (members || []).map((m) => ({
      userId: m.user_id,
      email: null,
      fullName: null,
      role: m.role,
    }));

    res.json(result);
  } catch (err) {
    console.error("GET /households/:id/member-users error:", err);
    res.status(500).json({ error: "server_error" });
  }
});

app.post("/households", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name_required" });

  try {
    const { data, error } = await req.supabase
      .from("households")
      .insert({ name })
      .select("id,name")
      .single();

    if (error) {
      console.error("POST /households error:", error);
      return res.status(500).json({
        error: "server_error",
        supabase: {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
      });
    }

    res.status(201).json(data);
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
    const { data, error } = await req.supabase
      .from("household_members")
      .select("id, household_id, user_id, role")
      .eq("household_id", id);

    if (error) {
      if (error.code === "PGRST205") {
        return res.json([]);
      }
      console.error("GET /households/:id/members error:", error);
      return res.status(500).json({ error: "server_error" });
    }

    const mapped = (data || []).map((m) => ({
      id: m.id,
      householdId: m.household_id,
      userId: m.user_id,
      role: m.role,
    }));

    res.json(mapped);
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
    let query = req.supabase
      .from("chores")
      .select("id, household_id, name");

    if (householdId) query = query.eq("household_id", householdId);

    const { data, error } = await query;

    if (error) {
      console.error("GET /chores error:", error);
      return res.status(500).json({ error: "server_error" });
    }

    const mapped = (data || []).map((c) => ({
      id: c.id,
      householdId: c.household_id,
      name: c.name,
    }));

    res.json(mapped);
  } catch (err) {
    console.error("GET /chores error:", err);
    res.status(500).json({ error: "server_error" });
  }
});

app.post("/chores", async (req, res) => {
  const { householdId, name, frequency } = req.body;

  if (!householdId || !name) {
    return res.status(400).json({ error: "householdId_and_name_required" });
  }

  try {
    const { data, error } = await req.supabase
      .from("chores")
      .insert({
        household_id: householdId,
        name,
      })
      .select("id, household_id, name")
      .single();

    if (error) {
      console.error("POST /chores error:", error);
      return res.status(500).json({ error: "server_error" });
    }

    res.status(201).json({
      id: data.id,
      householdId: data.household_id,
      name: data.name,
    });
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
    const { data, error } = await req.supabase
      .from("assignments")
      .select("id, chore_id, due_date, status");

    if (error) {
      console.error("GET /assignments error:", error);
      return res.status(500).json({ error: "server_error" });
    }

    const mapped = (data || []).map((a) => ({
      id: a.id,
      choreId: a.chore_id,
      assignedTo: null,
      dueDate: a.due_date,
      status: a.status,
    }));

    res.json(mapped);
  } catch (err) {
    console.error("GET /assignments error:", err);
    res.status(500).json({ error: "server_error" });
  }
});

app.post("/assignments", async (req, res) => {
  const { choreId, assignedTo, dueDate, status } = req.body;

  if (!choreId || !dueDate) {
    return res.status(400).json({ error: "required_fields_missing" });
  }

  try {
    const { data, error } = await req.supabase
      .from("assignments")
      .insert({
        chore_id: choreId,
        due_date: dueDate,
        status: status ?? "pending",
      })
      .select("id, chore_id, due_date, status")
      .single();

    if (error) {
      console.error("POST /assignments error:", error);
      return res.status(500).json({ error: "server_error" });
    }

    res.status(201).json({
      id: data.id,
      choreId: data.chore_id,
      assignedTo: null,
      dueDate: data.due_date,
      status: data.status,
    });
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
