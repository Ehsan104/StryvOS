import { ImageResponse } from "next/og";

export const alt = "Stryvos — Gym Management for Small Gyms";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0B0B0C",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#F7F7F7",
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: "bold",
              marginBottom: 20,
              color: "#7CF67C",
            }}
          >
            Stryvos
          </h1>
          <p
            style={{
              fontSize: 32,
              color: "#F7F7F7",
              textAlign: "center",
              maxWidth: 900,
            }}
          >
            Run your small gym like a big one
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

