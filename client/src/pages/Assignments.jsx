import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function getToken() {
  return localStorage.getItem("authToken") || "";
}

export default function Assignments() {
  const token = getToken();

  const [assignments, setAssignments] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  const [households, setHouseholds] = useState([]);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState("");
  const [members, setMembers] = useState([]);
  const [chores, setChores] = useState([]);

  // "" => omit assignedTo (API defaults to current user)
  // "__unassigned__" => send null
  // otherwise => send userId
  const [assigneeChoice, setAssigneeChoice] = useState("");

  const [choreId, setChoreId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (!token) window.location.href = "/auth";
  }, [token]);

  async function loadHouseholds() {
    if (!token) {
      setHouseholds([]);
      return;
    }

    try {
      const r = await fetch(`${API_BASE}/households`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!r.ok) {
        setHouseholds([]);
        return;
      }

      const data = await r.json();
      setHouseholds(Array.isArray(data) ? data : []);
    } catch {
      setHouseholds([]);
    }
  }

  async function loadChores(householdId) {
    if (!token) {
      setChores([]);
      return;
    }

    const url = new URL(`${API_BASE}/chores`);
    if (householdId) url.searchParams.set("householdId", householdId);

    try {
      const r = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!r.ok) {
        setChores([]);
        return;
      }

      const data = await r.json();
      setChores(Array.isArray(data) ? data : []);
    } catch {
      setChores([]);
    }
  }

  async function loadMembers(householdId) {
    if (!token || !householdId) {
      setMembers([]);
      return;
    }

    try {
      const r = await fetch(`${API_BASE}/households/${householdId}/member-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!r.ok) {
        setMembers([]);
        return;
      }

      const data = await r.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch {
      setMembers([]);
    }
  }

  async function loadAssignments() {
    setStatusMessage("");

    if (!token) {
      setAssignments([]);
      setStatusMessage("Sign in first on the Auth page.");
      return;
    }

    try {
      const r = await fetch(`${API_BASE}/assignments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!r.ok) {
        setStatusMessage("Failed to load assignments.");
        return;
      }

      const data = await r.json();
      setAssignments(Array.isArray(data) ? data : []);
    } catch {
      setStatusMessage("Failed to load assignments.");
    }
  }

  useEffect(() => {
    loadAssignments();
  }, [token]);

  useEffect(() => {
    loadHouseholds();
  }, [token]);

  useEffect(() => {
    loadMembers(selectedHouseholdId);
  }, [token, selectedHouseholdId]);

  useEffect(() => {
    loadChores(selectedHouseholdId);
  }, [token, selectedHouseholdId]);

  async function createAssignment(e) {
    e.preventDefault();
    setStatusMessage("Creating...");

    if (!token) {
      setStatusMessage("Sign in first on the Auth page.");
      return;
    }

    try {
      const body = {
        choreId,
        dueDate,
        status,
      };

      if (assigneeChoice === "__unassigned__") {
        body.assignedTo = null;
      } else if (assigneeChoice) {
        body.assignedTo = assigneeChoice;
      }

      const r = await fetch(`${API_BASE}/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!r.ok) {
        setStatusMessage("Failed to create assignment.");
        return;
      }

      setChoreId("");
      setDueDate("");
      setStatus("pending");
      setAssigneeChoice("");
      setStatusMessage("Created.");
      await loadAssignments();
    } catch {
      setStatusMessage("Failed to create assignment.");
    }
  }

  return (
    <div>
      <h2>Assignments</h2>

      <p>
        <strong>API base:</strong> {API_BASE}
      </p>

      {statusMessage ? <p><strong>Status:</strong> {statusMessage}</p> : null}

      <h3>Create assignment</h3>
      <form onSubmit={createAssignment}>
        <label>
          Household (for assignee dropdown)
          <select
            value={selectedHouseholdId}
            onChange={(e) => setSelectedHouseholdId(e.target.value)}
            style={{ display: "block", marginTop: 6, marginBottom: 12 }}
          >
            <option value="">(optional) Select household</option>
            {households.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Chore ID
          <select
            value={choreId}
            onChange={(e) => setChoreId(e.target.value)}
            style={{ display: "block", marginTop: 6, marginBottom: 12 }}
            required
          >
            <option value="" disabled>
              Select a chore
            </option>
            {chores.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name || c.id}
              </option>
            ))}
          </select>
        </label>

        <label>
          Assigned To
          <select
            value={assigneeChoice}
            onChange={(e) => setAssigneeChoice(e.target.value)}
            style={{ display: "block", marginTop: 6, marginBottom: 12 }}
          >
            <option value="">Default: me</option>
            <option value="__unassigned__">Unassigned</option>
            {members.map((m) => (
              <option key={m.userId} value={m.userId}>
                {(m.fullName || m.email || m.userId) + (m.role ? ` (${m.role})` : "")}
              </option>
            ))}
          </select>
        </label>

        <label>
          Due Date
          <input
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            type="date"
            style={{ display: "block", marginTop: 6, marginBottom: 12 }}
            required
          />
        </label>

        <label>
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ display: "block", marginTop: 6, marginBottom: 12 }}
          >
            <option value="pending">pending</option>
            <option value="completed">completed</option>
            <option value="missed">missed</option>
          </select>
        </label>

        <button type="submit">Create</button>
      </form>

      <h3 style={{ marginTop: 16 }}>Assignments</h3>
      {assignments.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        <ul>
          {assignments.map((a) => (
            <li key={a.id}>
              <strong>{a.status}</strong> due {a.dueDate}
              <div style={{ fontSize: 12, opacity: 0.8 }}>id: {a.id}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>choreId: {a.choreId}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>assignedTo: {a.assignedTo}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
