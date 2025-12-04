"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body style={{ 
        backgroundColor: "#0f172a", 
        color: "#f1f5f9",
        fontFamily: "system-ui, sans-serif",
        margin: 0,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center", padding: "24px" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
            We encountered an unexpected error.
          </p>
          <button
            onClick={() => reset()}
            style={{
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "9999px",
              cursor: "pointer",
              fontWeight: 600,
              marginRight: "12px"
            }}
          >
            Try Again
          </button>
          <a
            href="/"
            style={{
              color: "#fbbf24",
              textDecoration: "none"
            }}
          >
            Go Home
          </a>
        </div>
      </body>
    </html>
  );
}

