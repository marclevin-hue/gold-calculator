"use client";

import { useState, useEffect } from "react";

const FALLBACK_SPOT = 145.65;
const FALLBACK_DATE = "May 4, 2026";

const PURITIES = {
  "18K": 0.75,
  "14K": 0.583,
};

const MULTIPLIERS = {
  melt:      { label: "Melt",      min: 1.0,  max: 1.0  },
  scrap:     { label: "Scrap",     min: 0.85, max: 0.90 },
  wholesale: { label: "Wholesale", min: 1.2,  max: 1.5  },
  retail:    { label: "Retail",    min: 1.8,  max: 2.4  },
};

function fmt(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

function formatSpotDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function calcRows(spotPerGram, grams) {
  const multiplier = grams > 0 ? grams : 1;
  return Object.entries(MULTIPLIERS).map(([key, { label, min, max }]) => {
    const cols = Object.entries(PURITIES).map(([karat, purity]) => {
      const meltPerGram = spotPerGram * purity;
      const lo = meltPerGram * min * multiplier;
      const hi = meltPerGram * max * multiplier;
      return { karat, value: min === max ? fmt(lo) : `${fmt(lo)} – ${fmt(hi)}` };
    });
    return { key, label, cols };
  });
}

export default function GoldPage() {
  const [grams, setGrams] = useState("");
  const [spot, setSpot] = useState(FALLBACK_SPOT);
  const [spotDate, setSpotDate] = useState(FALLBACK_DATE);

  useEffect(() => {
    fetch("/api/gold")
      .then(r => r.json())
      .then(data => {
        if (data.price_gram_24k) {
          setSpot(data.price_gram_24k);
          setSpotDate(formatSpotDate(data.timestamp));
        }
      })
      .catch(() => {});
  }, []);

  const gramsNum = parseFloat(grams) || 0;
  const perGramMode = gramsNum <= 0;
  const rows = calcRows(spot, gramsNum);

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1208 50%, #0a0a0a 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "40px 16px",
      color: "#f0e6c8",
    }}>

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          letterSpacing: "0.3em",
          fontSize: 11,
          color: "#b8923a",
          textTransform: "uppercase",
          marginBottom: 8,
        }}>
          Gold Reference
        </div>
        <div style={{ fontSize: 36, marginBottom: 4 }}>✡️</div>
        <h1 style={{
          margin: 0,
          fontSize: 30,
          fontWeight: 400,
          color: "#f5d77e",
          letterSpacing: "0.05em",
        }}>
          Gold Price Calculator
        </h1>

        <div style={{
          marginTop: 20,
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          background: "rgba(184,146,58,0.12)",
          border: "1px solid rgba(184,146,58,0.4)",
          borderRadius: 8,
          padding: "10px 24px",
        }}>
          <span style={{ fontSize: 11, color: "#9a7a3a", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Spot / gram
          </span>
          <span style={{
            fontSize: 26,
            color: "#f5d77e",
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}>
            {fmt(spot)}
          </span>
        </div>

        <div style={{ fontSize: 11, color: "#5a4a22", marginTop: 6 }}>
          As of {spotDate} · Live via Yahoo Finance
        </div>
      </div>

      <div style={{
        marginBottom: 28,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}>
        <label style={{
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#9a7a3a",
        }}>
          Piece Weight (grams)
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 8.30"
            value={grams}
            onChange={e => setGrams(e.target.value)}
            style={{
              background: "rgba(184,146,58,0.08)",
              border: "1px solid rgba(184,146,58,0.35)",
              borderRadius: 6,
              padding: "10px 16px",
              fontSize: 18,
              color: "#f5d77e",
              fontFamily: "Georgia, serif",
              width: 140,
              textAlign: "center",
              outline: "none",
            }}
          />
          {grams && (
            <button
              onClick={() => setGrams("")}
              style={{
                background: "none",
                border: "none",
                color: "#6a5a2a",
                cursor: "pointer",
                fontSize: 22,
                lineHeight: 1,
              }}
              title="Clear"
            >
              ×
            </button>
          )}
        </div>
        <div style={{ fontSize: 11, color: "#5a4a22" }}>
          {perGramMode
            ? "Showing per-gram values"
            : `Showing total values for ${gramsNum}g piece`}
        </div>
      </div>

      <div style={{
        width: "100%",
        maxWidth: 560,
        border: "1px solid rgba(184,146,58,0.25)",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          background: "rgba(184,146,58,0.18)",
          borderBottom: "1px solid rgba(184,146,58,0.3)",
        }}>
          {["Value Type", "18K (75%)", "14K (58.3%)"].map((h, i) => (
            <div key={i} style={{
              padding: "12px 10px",
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#b8923a",
              textAlign: i === 0 ? "left" : "right",
            }}>
              {h}
            </div>
          ))}
        </div>

        {rows.map(({ key, label, cols }, idx) => (
          <div
            key={key}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              borderBottom: idx < rows.length - 1 ? "1px solid rgba(184,146,58,0.12)" : "none",
              background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
            }}
          >
            <div style={{
              padding: "14px 10px",
              fontSize: 12,
              color: "#d4b86a",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontStyle: "italic",
            }}>
              {label}
            </div>
            {cols.map(({ karat, value }) => (
              <div key={karat} style={{
                padding: "14px 10px",
                fontSize: 12,
                color: "#f0e6c8",
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
              }}>
                {value}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 20,
        fontSize: 11,
        color: "#5a4a22",
        textAlign: "center",
        maxWidth: 500,
        lineHeight: 1.6,
      }}>
        {perGramMode ? "All values per gram · " : `All values for ${gramsNum}g · `}
        Scrap 85–90% of melt · Wholesale 1.2–1.5× · Retail 1.8–2.4×
      </div>
    </div>
  );
}
