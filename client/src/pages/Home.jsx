import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";

export default function Home() {
  const [health, setHealth] = useState("checking...");

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((r) => r.json())
      .then((data) => setHealth(data.status))
      .catch(() => setHealth("error"));
  }, []);

  return (
    <div>
      <h2>Home</h2>
      <p>Welcome to ChoreMate. This page checks that the API is reachable.</p>

      <p><strong>API base:</strong> {API_BASE}</p>
      <p><strong>API health status:</strong> {health}</p>
    </div>
  );
}
