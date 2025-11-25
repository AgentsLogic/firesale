import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 96px",
          background: "radial-gradient(circle at top left, #fbbf24 0, #020617 40%, #020617 100%)",
          color: "#f9fafb",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div
            style={{
              height: 40,
              width: 40,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(251, 191, 36, 0.1)",
              color: "#fbbf24",
              border: "1px solid rgba(251, 191, 36, 0.5)",
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "0.14em",
              }}
            >
              FS
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 24, fontWeight: 600 }}>FireSaleHomes</div>
            <div style={{ fontSize: 14, color: "#9ca3af" }}>
              Sell fast. Serious cash buyers only.
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: 720,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 46,
              fontWeight: 600,
              lineHeight: 1.1,
              marginBottom: 18,
            }}
          >
            Turn motivated sellers into clean, off-market deals.
          </div>
          <div style={{ fontSize: 20, color: "#e5e7eb", lineHeight: 1.4 }}>
            A serious two-sided marketplace that quietly matches U.S. home sellers with pre-vetted investors
            and cash buyers.
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 40, fontSize: 16, color: "#d1d5db" }}>
          <div
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid rgba(148, 163, 184, 0.5)",
              backgroundColor: "rgba(15, 23, 42, 0.7)",
            }}
          >
            Fast, as-is offers (*no seller fee*)
          </div>
          <div
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid rgba(148, 163, 184, 0.5)",
              backgroundColor: "rgba(15, 23, 42, 0.7)",
            }}
          >
            Curated, high-intent seller pipeline
          </div>
        </div>
      </div>
    ),
    size,
  );
}

