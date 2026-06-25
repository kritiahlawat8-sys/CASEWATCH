import React, { useState } from "react";

const COURTS = [
  { name: "Supreme Court", city: "New Delhi", x: 212, y: 164 },
  { name: "Delhi HC", city: "New Delhi", x: 218, y: 172 },
  { name: "Bombay HC", city: "Mumbai", x: 140, y: 370 },
  { name: "Madras HC", city: "Chennai", x: 275, y: 540 },
  { name: "Calcutta HC", city: "Kolkata", x: 485, y: 300 },
  { name: "Allahabad HC", city: "Prayagraj", x: 320, y: 260 },
  { name: "Karnataka HC", city: "Bengaluru", x: 215, y: 515 },
  { name: "Gujarat HC", city: "Ahmedabad", x: 100, y: 295 },
  { name: "Rajasthan HC", city: "Jodhpur", x: 120, y: 220 },
  { name: "Punjab & Haryana HC", city: "Chandigarh", x: 207, y: 118 },
  { name: "Patna HC", city: "Patna", x: 445, y: 225 },
  { name: "Hyderabad HC", city: "Hyderabad", x: 252, y: 425 },
];

const BADGES = [
  "CRL · 2024 · Delhi HC",
  "Hearing: 10:30 AM",
  "Order Uploaded ✓",
  "Next Date: Mon",
  "Case Synced ●",
  "Alert Sent ✓",
];

export default function CourtMap() {
  const [hoveredCourt, setHoveredCourt] = useState(null);

  return (
    <section style={{ background: "#F2F2F0", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
        
        {/* Left Side */}
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.1em", color: "#6B6B6B", marginBottom: "16px" }}>
            COURT COVERAGE
          </p>
          <h2 style={{ fontSize: "42px", fontWeight: "bold", color: "#1A1A1A", lineHeight: "1.1", marginBottom: "16px" }}>
            Every High Court.<br />
            Every District Bench.<br />
            All In One Place.
          </h2>
          <p style={{ fontSize: "16px", color: "#6B6B6B", marginBottom: "16px" }}>
            CaseWatch tracks live case data across all 25 High Courts and thousands of district courts in India.
          </p>
          <p style={{ fontSize: "13px", color: "#1A1A1A", marginBottom: "24px" }}>
            25 High Courts · 700+ District Courts
          </p>
          <button style={{ background: "#1A1A1A", color: "white", border: "none", borderRadius: "100px", padding: "14px 28px", fontSize: "14px", cursor: "pointer" }}>
            Explore Coverage →
          </button>
        </div>

        {/* Right Side - Map */}
        <div style={{ position: "relative" }}>
          <svg viewBox="0 0 710 725" style={{ width: "100%", height: "auto" }}>
            {/* Green dots for each court */}
            {COURTS.map((court, idx) => (
              <g key={idx}
                onMouseEnter={() => setHoveredCourt(court)}
                onMouseLeave={() => setHoveredCourt(null)}
                style={{ cursor: "pointer" }}
              >
                <circle cx={court.x} cy={court.y} r="8" fill="#22C55E" opacity="0.2" />
                <circle cx={court.x} cy={court.y} r="4" fill="#22C55E" />
              </g>
            ))}

            {/* Tooltip */}
            {hoveredCourt && (
              <g>
                <rect
                  x={hoveredCourt.x - 60}
                  y={hoveredCourt.y - 40}
                  width="120"
                  height="32"
                  rx="6"
                  fill="white"
                  stroke="#E2E2E2"
                />
                <text x={hoveredCourt.x} y={hoveredCourt.y - 20} textAnchor="middle" fontSize="10" fill="#1A1A1A" fontWeight="bold">
                  {hoveredCourt.name}
                </text>
                <text x={hoveredCourt.x} y={hoveredCourt.y - 10} textAnchor="middle" fontSize="9" fill="#6B6B6B">
                  {hoveredCourt.city}
                </text>
              </g>
            )}
          </svg>

          {/* Floating Badges */}
          <div style={{ position: "absolute", top: "10px", right: "0px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {BADGES.map((badge, idx) => (
              <span key={idx} style={{ background: "white", border: "1px solid #E2E2E2", borderRadius: "100px", padding: "6px 14px", fontSize: "11px", color: "#1A1A1A", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                {badge}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}