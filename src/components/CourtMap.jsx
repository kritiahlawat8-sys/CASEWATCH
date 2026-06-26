"use client";

import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";
import Reveal from './Reveal';

const geoUrl = "/india2.json";

const COURTS = [
  { name: "Supreme Court", city: "New Delhi", coordinates: [77.2090, 28.6139] },
  { name: "Delhi HC", city: "New Delhi", coordinates: [77.2405, 28.6083] },
  { name: "Bombay HC", city: "Mumbai", coordinates: [72.8777, 19.0760] },
  { name: "Madras HC", city: "Chennai", coordinates: [80.2707, 13.0827] },
  { name: "Calcutta HC", city: "Kolkata", coordinates: [88.3639, 22.5726] },
  { name: "Allahabad HC", city: "Prayagraj", coordinates: [81.8463, 25.4358] },
  { name: "Karnataka HC", city: "Bengaluru", coordinates: [77.5946, 12.9716] },
  { name: "Gujarat HC", city: "Ahmedabad", coordinates: [72.5714, 23.0225] },
  { name: "Rajasthan HC", city: "Jodhpur", coordinates: [73.0243, 26.2389] },
  { name: "Punjab & Haryana HC", city: "Chandigarh", coordinates: [76.7794, 30.7333] },
  { name: "Patna HC", city: "Patna", coordinates: [85.1376, 25.5941] },
  { name: "Hyderabad HC", city: "Hyderabad", coordinates: [78.4867, 17.3850] },
  { name: "Andhra Pradesh HC", city: "Amaravati", coordinates: [80.5000, 16.5000] },
  { name: "Chhattisgarh HC", city: "Bilaspur", coordinates: [82.1390, 22.0796] },
  { name: "Gauhati HC", city: "Guwahati", coordinates: [91.7362, 26.1445] },
  { name: "Himachal Pradesh HC", city: "Shimla", coordinates: [77.1734, 31.1048] },
  { name: "J&K and Ladakh HC", city: "Srinagar", coordinates: [74.7973, 34.0837] },
  { name: "Jharkhand HC", city: "Ranchi", coordinates: [85.3096, 23.3441] },
  { name: "Kerala HC", city: "Kochi", coordinates: [76.2673, 9.9312] },
  { name: "Madhya Pradesh HC", city: "Jabalpur", coordinates: [82.1699, 23.1815] },
  { name: "Manipur HC", city: "Imphal", coordinates: [92.9376, 24.8170] },
  { name: "Meghalaya HC", city: "Shillong", coordinates: [91.8933, 25.5788] },
  { name: "Orissa HC", city: "Cuttack", coordinates: [85.8312, 20.4625] },
  { name: "Sikkim HC", city: "Gangtok", coordinates: [88.6138, 27.3314] },
  { name: "Tripura HC", city: "Agartala", coordinates: [91.2868, 23.8315] },
  { name: "Uttarakhand HC", city: "Nainital", coordinates: [79.4632, 29.3919] }
];

// Define paths to simulate orbits (Delhi to others)
const ORBIT_PATHS = [
  { from: [77.2090, 28.6139], to: [88.3639, 22.5726] }, // Delhi to Kolkata
  { from: [77.2090, 28.6139], to: [72.8777, 19.0760] }, // Delhi to Mumbai
  { from: [77.2090, 28.6139], to: [80.2707, 13.0827] }, // Delhi to Chennai
  { from: [77.2090, 28.6139], to: [81.8463, 25.4358] }  // Delhi to Prayagraj
];

export default function CourtMap() {
  const [hoveredCourt, setHoveredCourt] = useState(undefined);

  return (
    <section className="relative w-full min-h-screen bg-[#F2F2F0] flex items-center py-[120px] overflow-hidden border-b border-[#E2E2E2]">
      <style>{`
        @keyframes pulse-ring {
          0% { r: 4px; opacity: 0.8; }
          100% { r: 16px; opacity: 0; }
        }
        .map-pulse-circle {
          animation: pulse-ring 2s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
        }
        .orbital-path {
          stroke: rgba(16, 185, 129, 0.2);
          stroke-width: 1px;
          fill: none;
          stroke-dasharray: 4 4;
        }
        .court-marker {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .court-marker:hover circle:first-of-type {
          fill: #059669;
        }
      `}</style>

      <div className="w-full max-w-[1400px] mx-auto px-8 md:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column (45%) */}
          <div className="lg:col-span-5 flex flex-col gap-6 md:gap-8 relative z-20">
            <Reveal delay={0}>
              <span className="font-mono text-[11px] text-[#6B6B6B] uppercase tracking-wider block">
                COURT COVERAGE
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-heading text-[40px] md:text-[48px] font-black text-[#1A1A1A] leading-[1.1]" style={{color: "#1A1A1A"}}>
                Every High Court.<br />
                Every District Bench.<br />
                All In One Place.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="font-sans text-[16px] text-[#6B6B6B] leading-relaxed max-w-[420px]">
                CaseWatch maps over 3,000 court complexes across India. Whether it's the Supreme Court in Delhi, a High Court branch in Lucknow, or a District Court in Kerala, we capture real-time docket updates automatically. 
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="flex gap-4 mt-4">
                <div className="bg-[#10B981]/10 px-4 py-2 rounded-full border border-[#10B981]/20 backdrop-blur-sm">
                  <span className="font-mono text-[#10B981] font-medium text-sm">✓ 25 High Courts</span>
                </div>
                <div className="bg-[#10B981]/10 px-4 py-2 rounded-full border border-[#10B981]/20 backdrop-blur-sm hidden sm:block">
                  <span className="font-mono text-[#10B981] font-medium text-sm">✓ 600+ District Courts</span>
                </div>
              </div>
            </Reveal>
          </div>

        {/* Right Column (55%) */}
        <div className="lg:col-span-7 relative h-[600px] flex items-center justify-center -mt-12 lg:-mt-24">
          <div className="map-orbit-wrapper w-full h-full relative flex items-center justify-center">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 900,
                center: [82.8, 22.5]
              }}
              style={{ width: "100%", height: "100%", position: "relative", zIndex: 2 }}
            >
              {/* Shadow/Extrusion layer for 3D effect */}
              <Geographies geography={geoUrl} style={{ transform: "translate(0px, 4px)" }}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey + "-shadow"}
                      geography={geo}
                      fill="#d0d0ce"
                      stroke="#d0d0ce"
                      strokeWidth={1}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none" },
                        pressed: { outline: "none" }
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Main map layer with bold boundaries */}
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#fdfdfc"
                      stroke="#9ca3af"
                      strokeWidth={1.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: "#f0fdf4" },
                        pressed: { outline: "none" }
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Orbital lines */}
              {ORBIT_PATHS.map((path, idx) => (
                <Line
                  key={idx}
                  from={path.from}
                  to={path.to}
                  className="orbital-path"
                  style={{ pointerEvents: "none" }}
                />
              ))}

              {/* Courts Markers */}
              {COURTS.map((court, idx) => (
                <Marker
                  key={idx}
                  coordinates={court.coordinates}
                  onMouseEnter={() => setHoveredCourt(idx)}
                  onMouseLeave={() => setHoveredCourt(undefined)}
                  className="court-marker"
                >
                  <circle className="map-pulse-circle" r={4} fill="rgba(16, 185, 129, 0.3)" />
                  <circle r={3} fill="#10b981" />
                  
                  {hoveredCourt === idx && (
                    <g transform="translate(10, -10)">
                      <rect x="0" y="-14" width="130" height="28" rx="4" fill="#ffffff" stroke="#e2e2e2" strokeWidth={1} />
                      <text textAnchor="middle" x="65" y="4" style={{ fontFamily: "monospace", fontSize: "11px", fill: "#1a1a1a" }}>
                        {court.name}
                      </text>
                    </g>
                  )}
                </Marker>
              ))}
            </ComposableMap>

          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
