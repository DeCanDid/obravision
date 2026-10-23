"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f3f7ff",
          color: "#0a1633",
          fontFamily: "Arial, Helvetica, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 440 }}>
          <h1 style={{ fontSize: 28, margin: "0 0 12px" }}>Something went wrong</h1>
          <p style={{ lineHeight: 1.6, color: "#4a5578", margin: "0 0 24px" }}>
            Sorry, the website could not load properly. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#1f5bff",
              color: "#fff",
              border: 0,
              borderRadius: 999,
              padding: "14px 28px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}