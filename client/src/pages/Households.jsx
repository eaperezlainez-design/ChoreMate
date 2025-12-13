import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function getToken() {
  return localStorage.getItem("authToken") || "";
}

export default function Households() {
  const [households, setHouseholds] = useState([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const token = getToken();

  useEffect(() => {
    if (!token) window.location.href = "/auth";
  }, [token]);

  async function loadHouseholds() {
    setStatus("");

    if (!token) {
      setHouseholds([]);
      setStatus("Sign in first on the Auth page.");
      return;
    }

    try {
      const r = await fetch(`${API_BASE}/households`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!r.ok) {
        setStatus("Failed to load households.");
        return;
      }

      const data = await r.json();
      setHouseholds(Array.isArray(data) ? data : []);
    } catch {
      setStatus("Failed to load households.");
    }
  }

  useEffect(() => {
    loadHouseholds();
  }, [token]);

  async function createHousehold(e) {
    e.preventDefault();
    setStatus("Creating...");

    if (!token) {
      setStatus("Sign in first on the Auth page.");
      return;
    }

    try {
      const r = await fetch(`${API_BASE}/households`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!r.ok) {
        setStatus("Failed to create household.");
        return;
      }

      setName("");
      setStatus("Created.");
      await loadHouseholds();
    } catch {
      setStatus("Failed to create household.");
    }
  }

  return (
    <div>
      <h2>Households</h2>

      <p>
        <strong>API base:</strong> {API_BASE}
      </p>

      {status ? <p><strong>Status:</strong> {status}</p> : null}

      <h3>Create household</h3>
      <form onSubmit={createHousehold}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Household name"
          style={{ marginRight: 8 }}
          required
        />
        <button type="submit">Create</button>
      </form>

      <h3 style={{ marginTop: 16 }}>Your households</h3>
      {households.length === 0 ? (
        <p>No households found.</p>
      ) : (
        <ul>
          {households.map((h) => (
            <li key={h.id}>
              <strong>{h.name}</strong>
              <div style={{ fontSize: 12, opacity: 0.8 }}>id: {h.id}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
