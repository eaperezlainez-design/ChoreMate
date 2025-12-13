import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function getToken() {
  return localStorage.getItem("authToken") || "";
}

export default function Chores() {
  const token = getToken();

  const [households, setHouseholds] = useState([]);
  const [chores, setChores] = useState([]);
  const [status, setStatus] = useState("");

  const [householdIdFilter, setHouseholdIdFilter] = useState("");

  const [householdId, setHouseholdId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("weekly");

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

  async function loadChores() {
    setStatus("");

    if (!token) {
      setChores([]);
      setStatus("Sign in first on the Auth page.");
      return;
    }

    const url = new URL(`${API_BASE}/chores`);
    if (householdIdFilter) url.searchParams.set("householdId", householdIdFilter);

    try {
      const r = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!r.ok) {
        setStatus("Failed to load chores.");
        return;
      }

      const data = await r.json();
      setChores(Array.isArray(data) ? data : []);
    } catch {
      setStatus("Failed to load chores.");
    }
  }

  useEffect(() => {
    loadHouseholds();
    loadChores();
  }, [token, householdIdFilter]);

  async function createChore(e) {
    e.preventDefault();
    setStatus("Creating...");

    if (!token) {
      setStatus("Sign in first on the Auth page.");
      return;
    }

    try {
      const r = await fetch(`${API_BASE}/chores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          householdId,
          name,
          description,
          frequency,
        }),
      });

      if (!r.ok) {
        setStatus("Failed to create chore.");
        return;
      }

      setHouseholdId("");
      setName("");
      setDescription("");
      setFrequency("weekly");
      setStatus("Created.");
      await loadChores();
    } catch {
      setStatus("Failed to create chore.");
    }
  }

  return (
    <div>
      <h2>Chores</h2>

      <p>
        <strong>API base:</strong> {API_BASE}
      </p>

      {status ? <p><strong>Status:</strong> {status}</p> : null}

      <h3>Filter</h3>
      <label>
        Household ID (optional)
        <select
          value={householdIdFilter}
          onChange={(e) => setHouseholdIdFilter(e.target.value)}
          style={{ display: "block", marginTop: 6 }}
        >
          <option value="">All households</option>
          {households.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name || h.id}
            </option>
          ))}
        </select>
      </label>

      <h3 style={{ marginTop: 16 }}>Create chore</h3>
      <form onSubmit={createChore}>
        <label>
          Household ID
          <select
            value={householdId}
            onChange={(e) => setHouseholdId(e.target.value)}
            style={{ display: "block", marginTop: 6, marginBottom: 12 }}
            required
          >
            <option value="" disabled>
              Select a household
            </option>
            {households.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name || h.id}
              </option>
            ))}
          </select>
        </label>

        <label>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Wash dishes"
            style={{ display: "block", marginTop: 6, marginBottom: 12 }}
            required
          />
        </label>

        <label>
          Description
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional"
            style={{ display: "block", marginTop: 6, marginBottom: 12 }}
          />
        </label>

        <label>
          Frequency
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            style={{ display: "block", marginTop: 6, marginBottom: 12 }}
          >
            <option value="daily">daily</option>
            <option value="weekly">weekly</option>
            <option value="monthly">monthly</option>
          </select>
        </label>

        <button type="submit">Create</button>
      </form>

      <h3 style={{ marginTop: 16 }}>Chores</h3>
      {chores.length === 0 ? (
        <p>No chores found.</p>
      ) : (
        <ul>
          {chores.map((c) => (
            <li key={c.id}>
              <strong>{c.name}</strong> ({c.frequency || "n/a"})
              <div style={{ fontSize: 12, opacity: 0.8 }}>householdId: {c.householdId}</div>
              {c.description ? (
                <div style={{ fontSize: 12, opacity: 0.9 }}>{c.description}</div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
