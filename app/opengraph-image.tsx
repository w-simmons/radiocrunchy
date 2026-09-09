import { ImageResponse } from "next/og";

export const alt = "Radio Crunchy — Crunchy outside. Soft center.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 5,
            height: 90,
            marginBottom: 28,
          }}
        >
          {[18, 36, 54, 72, 48, 84, 40, 66, 30, 78, 44, 22].map((h, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: h,
                background: "#C4A574",
                opacity: 0.85,
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            color: "#F4F0E8",
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: 8,
          }}
        >
          RADIO CRUNCHY
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            color: "#A8A29A",
            fontSize: 26,
          }}
        >
          Crunchy outside. Soft center.
        </div>
      </div>
    ),
    { ...size },
  );
}
