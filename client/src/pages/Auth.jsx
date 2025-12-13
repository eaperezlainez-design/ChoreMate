import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("authToken") || "");
  const [status, setStatus] = useState("");
  const [me, setMe] = useState(null);

  useEffect(() => {
    async function loadMe() {
      if (!token) {
        setMe(null);
        return;
      }

      try {
        const r = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!r.ok) {
          setMe(null);
          return;
        }

        const data = await r.json();
        setMe(data.user || null);
      } catch {
        setMe(null);
      }
    }

    loadMe();
  }, [token]);

  async function requestOtp(e) {
    e.preventDefault();
    setStatus("Requesting code...");

    try {
      const r = await fetch(`${API_BASE}/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!r.ok) {
        setStatus("Failed to request code.");
        return;
      }

      setStatus("Code sent. Check your email.");
    } catch {
      setStatus("Failed to request code.");
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setStatus("Verifying code...");

    try {
      const r = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: code }),
      });

      if (!r.ok) {
        setStatus("Invalid code.");
        return;
      }

      const data = await r.json();
      localStorage.setItem("authToken", data.accessToken);
      setToken(data.accessToken);
      setStatus("Signed in.");
    } catch {
      setStatus("Failed to verify code.");
    }
  }

  function signOut() {
    localStorage.removeItem("authToken");
    setToken("");
    setMe(null);
    setStatus("Signed out.");
  }

  return (
    <div>
      <h2>Auth (OTP)</h2>

      <p>Sign in using a one-time email code (via Express API).</p>

      <p>
        <strong>API base:</strong> {API_BASE}
      </p>

      {status ? <p><strong>Status:</strong> {status}</p> : null}

      {me ? (
        <div>
          <p>
            <strong>Signed in as:</strong> {me.email}
          </p>
          <button onClick={signOut}>Sign out</button>
        </div>
      ) : (
        <>
          <form onSubmit={requestOtp}>
            <label>
              Email
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                style={{ display: "block", marginTop: 6, marginBottom: 12 }}
                required
              />
            </label>
            <button type="submit">Send code</button>
          </form>

          <hr />

          <form onSubmit={verifyOtp}>
            <label>
              Code
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                style={{ display: "block", marginTop: 6, marginBottom: 12 }}
                required
              />
            </label>
            <button type="submit">Verify & Sign in</button>
          </form>
        </>
      )}
    </div>
  );
}
