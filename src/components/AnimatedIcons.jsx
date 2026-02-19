import React from 'react';

// ─── Animated Data-Driven Icon ───────────────────────────────
// Bar chart with bars that grow upward in sequence
export const AnimatedDataIcon = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .bar1 { animation: barGrow 2s ease-out infinite; animation-delay: 0s; }
      .bar2 { animation: barGrow 2s ease-out infinite; animation-delay: 0.2s; }
      .bar3 { animation: barGrow 2s ease-out infinite; animation-delay: 0.4s; }
      .bar4 { animation: barGrow 2s ease-out infinite; animation-delay: 0.6s; }
      @keyframes barGrow {
        0%, 100% { transform: scaleY(0.3); }
        50% { transform: scaleY(1); }
      }
      .data-pulse { animation: dataPulse 3s ease-in-out infinite; }
      @keyframes dataPulse { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
    `}</style>
    <circle cx="32" cy="32" r="30" fill="rgba(45,212,191,0.08)" className="data-pulse"/>
    <rect className="bar1" x="12" y="20" width="7" height="24" rx="3" fill="#2dd4bf" style={{transformOrigin:'12px 44px'}}/>
    <rect className="bar2" x="22" y="14" width="7" height="30" rx="3" fill="#14b8a6" style={{transformOrigin:'22px 44px'}}/>
    <rect className="bar3" x="32" y="18" width="7" height="26" rx="3" fill="#2dd4bf" style={{transformOrigin:'32px 44px'}}/>
    <rect className="bar4" x="42" y="10" width="7" height="34" rx="3" fill="#0d9488" style={{transformOrigin:'42px 44px'}}/>
    {/* Trend line */}
    <polyline points="15,35 26,24 36,30 46,16" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7"/>
    <circle cx="46" cy="16" r="3" fill="#f59e0b" opacity="0.9">
      <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

// ─── Animated Instant/Speed Icon ─────────────────────────────
// Lightning bolt with electric pulse
export const AnimatedSpeedIcon = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .bolt-flash { animation: boltFlash 1.5s ease-in-out infinite; }
      @keyframes boltFlash {
        0%, 100% { filter: drop-shadow(0 0 4px rgba(45,212,191,0.3)); opacity: 0.85; }
        50% { filter: drop-shadow(0 0 12px rgba(45,212,191,0.8)); opacity: 1; }
      }
      .spark { animation: sparkle 2s ease-in-out infinite; }
      .spark2 { animation: sparkle 2s ease-in-out infinite; animation-delay: 0.7s; }
      .spark3 { animation: sparkle 2s ease-in-out infinite; animation-delay: 1.4s; }
      @keyframes sparkle {
        0%,100% { opacity:0; transform: scale(0); }
        50% { opacity:1; transform: scale(1); }
      }
      .ring-pulse { animation: ringPulse 2s ease-out infinite; }
      @keyframes ringPulse {
        0% { r: 18; opacity: 0.3; }
        50% { r: 26; opacity: 0; }
        100% { r: 18; opacity: 0.3; }
      }
    `}</style>
    <circle cx="32" cy="32" r="28" fill="rgba(45,212,191,0.06)"/>
    <circle cx="32" cy="32" className="ring-pulse" fill="none" stroke="rgba(45,212,191,0.2)" strokeWidth="1"/>
    <path className="bolt-flash" d="M36 8L22 34h10L26 56l18-28H33L36 8z" fill="url(#boltGrad)"/>
    <circle className="spark" cx="18" cy="20" r="2" fill="#2dd4bf" style={{transformOrigin:'18px 20px'}}/>
    <circle className="spark2" cx="48" cy="24" r="1.5" fill="#14b8a6" style={{transformOrigin:'48px 24px'}}/>
    <circle className="spark3" cx="44" cy="46" r="2" fill="#2dd4bf" style={{transformOrigin:'44px 46px'}}/>
    <defs>
      <linearGradient id="boltGrad" x1="26" y1="8" x2="36" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2dd4bf"/>
        <stop offset="100%" stopColor="#0d9488"/>
      </linearGradient>
    </defs>
  </svg>
);

// ─── Animated Privacy/Shield Icon ────────────────────────────
// Shield with a checkmark that draws itself
export const AnimatedShieldIcon = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .shield-body { animation: shieldPulse 3s ease-in-out infinite; }
      @keyframes shieldPulse {
        0%,100% { filter: drop-shadow(0 0 6px rgba(45,212,191,0.2)); }
        50% { filter: drop-shadow(0 0 14px rgba(45,212,191,0.5)); }
      }
      .check-draw {
        stroke-dasharray: 24;
        stroke-dashoffset: 24;
        animation: drawCheck 1.8s ease-out infinite;
      }
      @keyframes drawCheck {
        0% { stroke-dashoffset: 24; }
        40%,100% { stroke-dashoffset: 0; }
      }
      .shield-ring {
        animation: shieldRing 3s ease-out infinite;
      }
      @keyframes shieldRing {
        0% { opacity: 0.4; transform: scale(1); }
        50% { opacity: 0; transform: scale(1.3); }
        100% { opacity: 0.4; transform: scale(1); }
      }
    `}</style>
    <circle cx="32" cy="32" r="28" fill="rgba(45,212,191,0.05)"/>
    <path className="shield-body" d="M32 6L12 16v14c0 13.2 8.5 25.5 20 30 11.5-4.5 20-16.8 20-30V16L32 6z" fill="rgba(45,212,191,0.1)" stroke="#2dd4bf" strokeWidth="2"/>
    <path className="shield-ring" d="M32 10L15 18.5v12c0 11.4 7.2 22 17 26 9.8-4 17-14.6 17-26v-12L32 10z" fill="none" stroke="rgba(45,212,191,0.15)" strokeWidth="1" style={{transformOrigin:'32px 32px'}}/>
    <polyline className="check-draw" points="22,34 29,41 42,24" stroke="#2dd4bf" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

// ─── Animated Heart Pulse for Hero Section ───────────────────
export const AnimatedHeartPulse = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .heart-main { animation: heartBeat 1.4s ease-in-out infinite; }
      @keyframes heartBeat {
        0%, 100% { transform: scale(1); }
        15% { transform: scale(1.12); }
        30% { transform: scale(1); }
        45% { transform: scale(1.08); }
        60% { transform: scale(1); }
      }
      .ecg-line {
        stroke-dasharray: 300;
        stroke-dashoffset: 300;
        animation: ecgDraw 2.5s linear infinite;
      }
      @keyframes ecgDraw {
        0% { stroke-dashoffset: 300; }
        100% { stroke-dashoffset: -300; }
      }
      .pulse-ring1 { animation: pulseRing 2s ease-out infinite; }
      .pulse-ring2 { animation: pulseRing 2s ease-out infinite; animation-delay: 0.5s; }
      .pulse-ring3 { animation: pulseRing 2s ease-out infinite; animation-delay: 1s; }
      @keyframes pulseRing {
        0% { r: 40; opacity: 0.3; }
        100% { r: 90; opacity: 0; }
      }
    `}</style>
    {/* Pulsing rings */}
    <circle className="pulse-ring1" cx="100" cy="95" fill="none" stroke="rgba(45,212,191,0.15)" strokeWidth="1"/>
    <circle className="pulse-ring2" cx="100" cy="95" fill="none" stroke="rgba(45,212,191,0.1)" strokeWidth="1"/>
    <circle className="pulse-ring3" cx="100" cy="95" fill="none" stroke="rgba(45,212,191,0.08)" strokeWidth="1"/>
    {/* Heart shape */}
    <g className="heart-main" style={{transformOrigin:'100px 95px'}}>
      <path d="M100 160 C60 120, 20 90, 40 60 C55 40, 80 45, 100 70 C120 45, 145 40, 160 60 C180 90, 140 120, 100 160z" fill="url(#heartGrad)" opacity="0.25"/>
      <path d="M100 155 C62 118, 28 90, 45 63 C58 44, 78 48, 100 72 C122 48, 142 44, 155 63 C172 90, 138 118, 100 155z" stroke="#2dd4bf" strokeWidth="2" fill="none"/>
    </g>
    {/* ECG line across */}
    <polyline className="ecg-line" points="20,100 55,100 65,100 72,85 80,120 88,60 96,115 104,90 112,100 180,100" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <defs>
      <linearGradient id="heartGrad" x1="60" y1="50" x2="140" y2="160" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2dd4bf"/>
        <stop offset="100%" stopColor="#0f766e"/>
      </linearGradient>
    </defs>
  </svg>
);

// ─── Animated Stethoscope for Form Header ────────────────────
export const AnimatedStethoscope = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .steth-pulse { animation: stethPulse 2s ease-in-out infinite; }
      @keyframes stethPulse {
        0%,100% { filter: drop-shadow(0 0 3px rgba(45,212,191,0.3)); }
        50% { filter: drop-shadow(0 0 8px rgba(45,212,191,0.7)); }
      }
      .steth-dot { animation: stethDot 1.5s ease-in-out infinite; }
      @keyframes stethDot {
        0%,100% { r: 3; fill: #2dd4bf; }
        50% { r: 4; fill: #5eead4; }
      }
    `}</style>
    <g className="steth-pulse">
      {/* Ear pieces */}
      <path d="M14 6 Q14 14, 18 18" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M34 6 Q34 14, 30 18" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Y connector */}
      <path d="M18 18 Q24 24, 24 30" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M30 18 Q24 24, 24 30" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Tube */}
      <path d="M24 30 Q24 38, 30 40 Q36 42, 36 36" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Chest piece */}
      <circle cx="36" cy="34" r="5" fill="rgba(45,212,191,0.15)" stroke="#2dd4bf" strokeWidth="1.5"/>
      <circle className="steth-dot" cx="36" cy="34"/>
    </g>
    {/* Ear tips */}
    <circle cx="14" cy="5" r="2" fill="#64748b"/>
    <circle cx="34" cy="5" r="2" fill="#64748b"/>
  </svg>
);

// ─── Animated DNA Helix for Processing Screen ────────────────
export const AnimatedDNA = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .dna-strand { animation: dnaRotate 3s linear infinite; }
      @keyframes dnaRotate {
        0% { transform: rotateY(0deg); }
        100% { transform: rotateY(360deg); }
      }
      .dna-dot { animation: dnaDot 1.5s ease-in-out infinite alternate; }
      .dna-dot2 { animation: dnaDot 1.5s ease-in-out infinite alternate; animation-delay: 0.3s; }
      .dna-dot3 { animation: dnaDot 1.5s ease-in-out infinite alternate; animation-delay: 0.6s; }
      .dna-dot4 { animation: dnaDot 1.5s ease-in-out infinite alternate; animation-delay: 0.9s; }
      @keyframes dnaDot { 0% { opacity:0.4; } 100% { opacity:1; } }
    `}</style>
    <g style={{transformOrigin:'40px 40px'}}>
      {/* Left strand */}
      <path d="M25 5 Q15 20, 25 35 Q35 50, 25 65 Q15 80, 25 80" stroke="#2dd4bf" strokeWidth="2" fill="none" opacity="0.7"/>
      {/* Right strand */}
      <path d="M55 5 Q65 20, 55 35 Q45 50, 55 65 Q65 80, 55 80" stroke="#0d9488" strokeWidth="2" fill="none" opacity="0.7"/>
      {/* Cross bars */}
      <line className="dna-dot" x1="28" y1="12" x2="52" y2="12" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <line className="dna-dot2" x1="24" y1="25" x2="56" y2="25" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <line className="dna-dot3" x1="28" y1="38" x2="52" y2="38" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <line className="dna-dot4" x1="24" y1="51" x2="56" y2="51" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <line className="dna-dot" x1="28" y1="64" x2="52" y2="64" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      {/* Node dots */}
      <circle className="dna-dot" cx="28" cy="12" r="3" fill="#2dd4bf"/>
      <circle className="dna-dot2" cx="52" cy="12" r="3" fill="#0d9488"/>
      <circle className="dna-dot3" cx="24" cy="25" r="3" fill="#14b8a6"/>
      <circle className="dna-dot4" cx="56" cy="25" r="3" fill="#2dd4bf"/>
      <circle className="dna-dot" cx="28" cy="38" r="3" fill="#0d9488"/>
      <circle className="dna-dot2" cx="52" cy="38" r="3" fill="#2dd4bf"/>
      <circle className="dna-dot3" cx="24" cy="51" r="3" fill="#2dd4bf"/>
      <circle className="dna-dot4" cx="56" cy="51" r="3" fill="#14b8a6"/>
    </g>
  </svg>
);

// ─── Animated Lightbulb for Recommendations ──────────────────
export const AnimatedLightbulb = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .bulb-glow { animation: bulbGlow 2s ease-in-out infinite; }
      @keyframes bulbGlow {
        0%,100% { filter: drop-shadow(0 0 3px rgba(251,191,36,0.3)); }
        50% { filter: drop-shadow(0 0 10px rgba(251,191,36,0.7)); }
      }
      .bulb-ray { animation: rayPulse 2s ease-in-out infinite; }
      @keyframes rayPulse { 0%,100% { opacity:0.3; } 50% { opacity:0.8; } }
    `}</style>
    <g className="bulb-glow">
      <path d="M14 3C9.6 3 6 6.4 6 10.5c0 2.8 1.6 5.2 4 6.5v2.5c0 .8.7 1.5 1.5 1.5h5c.8 0 1.5-.7 1.5-1.5V17c2.4-1.3 4-3.7 4-6.5C22 6.4 18.4 3 14 3z" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="1.5"/>
      <line x1="11" y1="23" x2="17" y2="23" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <line x1="12" y1="25" x2="16" y2="25" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
    </g>
    {/* Rays */}
    <line className="bulb-ray" x1="14" y1="0" x2="14" y2="1.5" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
    <line className="bulb-ray" x1="4" y1="4" x2="5.2" y2="5.2" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
    <line className="bulb-ray" x1="24" y1="4" x2="22.8" y2="5.2" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
    <line className="bulb-ray" x1="1" y1="11" x2="2.5" y2="11" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
    <line className="bulb-ray" x1="25.5" y1="11" x2="27" y2="11" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ─── Animated Pill for Suggested Medicines ───────────────────
export const AnimatedPill = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .pill-bounce { animation: pillBounce 2.5s ease-in-out infinite; }
      @keyframes pillBounce {
        0%,100% { transform: rotate(-45deg) translateY(0); }
        50% { transform: rotate(-45deg) translateY(-2px); }
      }
      .pill-shine {
        animation: pillShine 3s ease-in-out infinite;
      }
      @keyframes pillShine {
        0%,100% { opacity: 0; transform: translateX(-8px); }
        50% { opacity: 0.6; transform: translateX(8px); }
      }
    `}</style>
    <g className="pill-bounce" style={{transformOrigin:'14px 14px'}}>
      <rect x="6" y="6" width="16" height="8" rx="4" fill="#f87171" stroke="#ef4444" strokeWidth="1"/>
      <rect x="6" y="14" width="16" height="8" rx="4" fill="rgba(255,255,255,0.2)" stroke="#ef4444" strokeWidth="1"/>
      <rect className="pill-shine" x="9" y="8" width="2" height="4" rx="1" fill="rgba(255,255,255,0.5)" style={{transformOrigin:'14px 14px'}}/>
    </g>
    <circle cx="14" cy="14" r="13" fill="none" stroke="rgba(248,113,113,0.15)" strokeWidth="1">
      <animate attributeName="r" values="10;13;10" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

// ─── Animated Search/Magnifier for Similar Cases ─────────────
export const AnimatedSearch = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .search-scan { animation: searchScan 2.5s ease-in-out infinite; }
      @keyframes searchScan {
        0%,100% { transform: translate(0, 0); }
        25% { transform: translate(2px, -1px); }
        50% { transform: translate(-1px, 2px); }
        75% { transform: translate(1px, 1px); }
      }
      .search-ring { animation: searchRing 2s ease-in-out infinite; }
      @keyframes searchRing {
        0%,100% { filter: drop-shadow(0 0 2px rgba(56,189,248,0.3)); }
        50% { filter: drop-shadow(0 0 6px rgba(56,189,248,0.6)); }
      }
    `}</style>
    <g className="search-scan">
      <g className="search-ring">
        <circle cx="12" cy="12" r="8" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="4" fill="none" stroke="rgba(56,189,248,0.2)" strokeWidth="0.5">
          <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite"/>
        </circle>
      </g>
      <line x1="18" y1="18" x2="25" y2="25" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round"/>
    </g>
  </svg>
);
