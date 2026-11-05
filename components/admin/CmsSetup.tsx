import React from "react";

/*
 * Shown at /admin when no database is configured. The public website keeps
 * serving its built-in content in this state, so this only says what is
 * missing and how to fix it.
 */
export const CmsSetup = () => (
  <main
    style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      padding: 24,
      background: "#f0f0f1",
      fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
      color: "#1d2327",
    }}
  >
    <div
      style={{
        maxWidth: 560,
        width: "100%",
        background: "#fff",
        border: "1px solid #c3c4c7",
        borderTop: "4px solid #00a850",
        borderRadius: 4,
        padding: "36px 32px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src="/photos/Logo_Gold_noBg.png" alt="" width={48} height={48} style={{ display: "block", width: 48, height: 48, objectFit: "contain" }} />
        <div>
          <div style={{ fontWeight: 800, letterSpacing: "0.08em", color: "#072617", fontSize: 18 }}>DECO-LAND</div>
          <div style={{ fontSize: 12, color: "#646970" }}>Website admin</div>
        </div>
      </div>
      <h1 style={{ fontSize: 22, margin: "28px 0 8px", color: "#00803d" }}>The website admin is not connected yet</h1>
      <p style={{ margin: 0, lineHeight: 1.6, color: "#3c434a" }}>
        The public website is working normally and showing its built-in content. Editing switches on once the website
        is connected to its database.
      </p>
      <p style={{ margin: "20px 0 8px", fontWeight: 600 }}>Set these in the hosting environment (Vercel, Settings, Environment Variables):</p>
      <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9, color: "#3c434a" }}>
        <li>
          <code>DATABASE_URL</code> — the Postgres connection string
        </li>
        <li>
          <code>PAYLOAD_SECRET</code> — a long random value that signs sign-in sessions
        </li>
      </ul>
      <p style={{ margin: "20px 0 0", lineHeight: 1.6, color: "#3c434a", fontSize: 14 }}>
        Then redeploy. The first person to open this page afterwards is asked to create the first admin account.
      </p>
      <p style={{ margin: "16px 0 0", fontSize: 14 }}>
        <a href="/en" style={{ color: "#00803d", fontWeight: 600 }}>View the website</a>
      </p>
    </div>
  </main>
);

export default CmsSetup;
