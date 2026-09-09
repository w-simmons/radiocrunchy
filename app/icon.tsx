import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0B0B0C",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <div style={{ width: 3, height: 10, background: "#C4A574" }} />
        <div style={{ width: 3, height: 16, background: "#C4A574" }} />
        <div style={{ width: 3, height: 7, background: "#C4A574" }} />
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: "#E85D4C",
            marginLeft: 2,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
