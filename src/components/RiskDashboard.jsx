import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AnimatedLightbulb, AnimatedPill, AnimatedSearch } from './AnimatedIcons';

// ─── Score-based medicine & tip lookup ────────────────────────
const getMedicinesForScore = (score) => {
  if (score <= 20) return [
    { name: 'Omega-3 Fish Oil (Heart Health)', query: 'omega 3 fish oil heart health supplement' },
    { name: 'Magnesium Supplement', query: 'magnesium supplement blood pressure' },
    { name: 'Potassium Supplement', query: 'potassium supplement heart health' },
    { name: 'Digital BP Monitor (Preventive)', query: 'digital blood pressure monitor home' },
  ];
  if (score <= 35) return [
    { name: 'Omega-3 Supplements', query: 'omega 3 fish oil heart health supplement' },
    { name: 'Magnesium + Potassium Combo', query: 'magnesium potassium supplement blood pressure' },
    { name: 'Garlic Extract (Natural BP Support)', query: 'garlic extract blood pressure supplement' },
    { name: 'Digital BP Monitor', query: 'digital blood pressure monitor home' },
  ];
  if (score <= 55) return [
    { name: 'Amlodipine (Calcium Channel Blocker)', query: 'amlodipine blood pressure tablet' },
    { name: 'Losartan (ARB)', query: 'losartan potassium blood pressure' },
    { name: 'Omega-3 Supplements', query: 'omega 3 fish oil heart health supplement' },
    { name: 'Digital BP Monitor', query: 'digital blood pressure monitor home' },
  ];
  if (score <= 75) return [
    { name: 'Lisinopril (ACE Inhibitor)', query: 'lisinopril blood pressure tablet' },
    { name: 'Metoprolol (Beta Blocker)', query: 'metoprolol succinate tablet' },
    { name: 'Hydrochlorothiazide (Diuretic)', query: 'hydrochlorothiazide tablet' },
    { name: 'CoQ10 Supplement', query: 'coq10 heart health supplement' },
  ];
  return [
    { name: 'Amlodipine + Valsartan (Combo)', query: 'amlodipine valsartan combination tablet' },
    { name: 'Furosemide (Loop Diuretic)', query: 'furosemide tablet' },
    { name: 'Carvedilol (Beta Blocker)', query: 'carvedilol tablet blood pressure' },
    { name: 'Blood Pressure Monitor', query: 'digital blood pressure monitor home' },
  ];
};

const getTipsForScore = (score) => {
  if (score <= 20) return [
    { icon: '✅', text: 'Maintain your healthy lifestyle' },
    { icon: '🥗', text: 'Keep eating a balanced, low-sodium diet' },
    { icon: '🏃', text: 'Continue regular physical activity' },
    { icon: '🩺', text: 'Annual check-ups are still recommended' },
  ];
  if (score <= 35) return [
    { icon: '⚠️', text: 'Monitor your BP regularly at home' },
    { icon: '🥗', text: 'Reduce salt intake to <5g/day' },
    { icon: '🏃', text: '30 mins of moderate exercise daily' },
    { icon: '😴', text: 'Aim for 7–8 hours of sleep' },
    { icon: '🧘', text: 'Try stress-reduction techniques' },
  ];
  if (score <= 55) return [
    { icon: '⚠️', text: 'Consult a doctor for a BP check' },
    { icon: '🥗', text: 'Reduce salt intake to <5g/day' },
    { icon: '🏃', text: '30 mins of moderate exercise daily' },
    { icon: '🧘', text: 'Practice stress-reduction techniques' },
    { icon: '😴', text: 'Aim for 7–8 hours of sleep' },
  ];
  if (score <= 75) return [
    { icon: '🚨', text: 'See a doctor as soon as possible' },
    { icon: '🥗', text: 'Strict low-sodium DASH diet' },
    { icon: '🚭', text: 'Quit smoking immediately' },
    { icon: '🏃', text: 'Daily light exercise (walking)' },
    { icon: '📉', text: 'Monitor BP at home daily' },
  ];
  return [
    { icon: '🆘', text: 'Seek immediate medical attention' },
    { icon: '📵', text: 'Avoid all stimulants (caffeine, alcohol)' },
    { icon: '🥗', text: 'Hospital-grade dietary restrictions' },
    { icon: '📊', text: 'Daily BP monitoring required' },
    { icon: '💊', text: 'Medication likely needed — see a cardiologist' },
  ];
};

// ─── Styles object for cleaner JSX ───────────────────────────
const s = {
  card: {
    padding: '2rem',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
  },
  sectionTitle: (color = 'var(--secondary)') => ({
    marginBottom: '1.2rem',
    color,
    fontSize: '0.95rem',
    fontWeight: 700,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }),
  profileRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.4rem 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    fontSize: '0.85rem',
  },
};

const RiskDashboard = ({ data, patientInput, onReset }) => {
  const { riskLevel, score, neighbors, predictedBP, stageCounts } = data;
  const reportRef = useRef(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = null;
    const duration = 1400;
    const target = score;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);

  const downloadPDF = async () => {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = pdf.internal.pageSize.getWidth();
    const margin = 15;
    let y = 15;

    // ─── Helper: draw the PulseGuard logo ────────────────────
    const drawLogo = (x, ly, size) => {
      // Crescent arc
      pdf.setDrawColor(148, 163, 184);
      pdf.setLineWidth(0.6);
      const cx = x + size / 2, cy = ly + size / 2, r = size * 0.4;
      // Draw arc from top-right to bottom-right
      for (let a = -60; a < 240; a += 3) {
        const rad = (a * Math.PI) / 180;
        const rad2 = ((a + 3) * Math.PI) / 180;
        pdf.line(cx + r * Math.cos(rad), cy + r * Math.sin(rad), cx + r * Math.cos(rad2), cy + r * Math.sin(rad2));
      }
      // ECG heartbeat polyline
      pdf.setDrawColor(45, 212, 191);
      pdf.setLineWidth(0.5);
      const pts = [[0.17,0.52],[0.33,0.52],[0.40,0.52],[0.43,0.40],[0.47,0.65],[0.50,0.32],[0.53,0.60],[0.57,0.46],[0.60,0.52],[0.83,0.52]];
      for (let i = 0; i < pts.length - 1; i++) {
        pdf.line(x + pts[i][0]*size, ly + pts[i][1]*size, x + pts[i+1][0]*size, ly + pts[i+1][1]*size);
      }
    };

    // ─── Header with logo ────────────────────────────────────
    const logoSize = 14;
    drawLogo(margin, y - 2, logoSize);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(45, 212, 191);
    pdf.text('PulseGuard AI', margin + logoSize + 4, y + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(140, 160, 190);
    pdf.text('AI-Powered Hypertension Risk Assessment', margin + logoSize + 4, y + 10);
    y += 18;

    // Divider line
    pdf.setDrawColor(45, 212, 191);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y, W - margin, y);
    y += 8;

    // ─── Risk Score ──────────────────────────────────────────
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    const riskColors = { Low: [52, 211, 153], Moderate: [251, 191, 36], High: [248, 113, 113], Critical: [239, 68, 68] };
    const rc = riskColors[riskLevel] || [45, 212, 191];
    pdf.setTextColor(...rc);
    pdf.text(`${score}% — ${riskLevel} Risk`, margin, y);
    y += 8;
    pdf.setFontSize(11);
    pdf.setTextColor(140, 160, 190);
    pdf.text(`Predicted Blood Pressure: ${predictedBP}`, margin, y);
    y += 10;

    // ─── Patient Profile ─────────────────────────────────────
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(45, 212, 191);
    pdf.text('Patient Profile', margin, y);
    y += 6;

    const profileData = patientInput ? [
      ['Gender', patientInput.gender],
      ['Age Group', patientInput.ageGroup],
      ['BMI', String(patientInput.bmi)],
      ['Family History', patientInput.familyHistory],
      ['Smoker', patientInput.isSmoker],
      ['Exercise Level', patientInput.exerciseLevel],
      ['Salt Intake', `${patientInput.saltIntake}g/day`],
      ['Stress Level', `${patientInput.stressLevel}/10`],
      ['Sleep Duration', `${patientInput.sleepDuration} hrs`],
    ] : [];

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    profileData.forEach(([label, value]) => {
      pdf.setTextColor(140, 160, 190);
      pdf.text(label, margin + 2, y);
      pdf.setTextColor(220, 230, 245);
      pdf.text(String(value), margin + 55, y);
      y += 5;
    });
    y += 5;

    // ─── Recommendations ─────────────────────────────────────
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(45, 212, 191);
    pdf.text('Recommendations', margin, y);
    y += 6;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(200, 210, 230);
    tips.forEach(tip => {
      if (y > 270) { pdf.addPage(); y = 15; }
      pdf.text(`${tip.icon}  ${tip.text}`, margin + 2, y);
      y += 5;
    });
    y += 5;

    // ─── Suggested Medicines ─────────────────────────────────
    if (y > 250) { pdf.addPage(); y = 15; }
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(45, 212, 191);
    pdf.text('Suggested Medicines', margin, y);
    y += 6;

    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(7);
    pdf.setTextColor(251, 191, 36);
    pdf.text('⚠ Always consult a doctor before taking any medication.', margin + 2, y);
    y += 5;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(200, 210, 230);
    medicines.forEach(med => {
      if (y > 270) { pdf.addPage(); y = 15; }
      pdf.text(`•  ${med.name}`, margin + 2, y);
      y += 5;
    });
    y += 5;

    // ─── Similar Cases ───────────────────────────────────────
    if (y > 240) { pdf.addPage(); y = 15; }
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(45, 212, 191);
    pdf.text('Similar Cases (k-NN)', margin, y);
    y += 6;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    neighbors.forEach((n, i) => {
      if (y > 270) { pdf.addPage(); y = 15; }
      pdf.setTextColor(140, 160, 190);
      const info = `${n.gender} · Age ${n.ageGroup} · BP ${n.systolic}/${n.diastolic}`;
      pdf.text(info, margin + 2, y);
      pdf.setTextColor(...rc);
      pdf.text(n.riskCategory || '', W - margin - 30, y);
      y += 5;
    });

    // ─── Footer ──────────────────────────────────────────────
    const footerY = pdf.internal.pageSize.getHeight() - 15;
    pdf.setDrawColor(45, 212, 191);
    pdf.setLineWidth(0.2);
    pdf.line(margin, footerY - 5, W - margin, footerY - 5);
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(7);
    pdf.setTextColor(140, 160, 190);
    pdf.text('This report is for informational purposes only. It does not replace professional medical advice.', margin, footerY);
    pdf.text(`Generated by PulseGuard AI · ${new Date().toLocaleDateString('en-IN')} · ${new Date().toLocaleTimeString('en-IN')}`, margin, footerY + 3.5);

    pdf.save(`PulseGuard-Report-${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.pdf`);
  };

  const colorMap = {
    Low: '#34d399',
    Moderate: '#fbbf24',
    High: '#f87171',
    Critical: '#ef4444',
  };
  const color = colorMap[riskLevel] || '#2dd4bf';
  const isCritical = riskLevel === 'Critical' || riskLevel === 'High';

  const medicines = getMedicinesForScore(score);
  const tips = getTipsForScore(score);
  const amazonLink = (query) => `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;

  const rgbaFromHex = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  return (
    <div style={{ paddingTop: '1rem' }}>
      {/* Top actions */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={onReset} className="back-btn" style={{ margin: 0 }}>← Start Over</button>
        <motion.button
          onClick={downloadPDF}
          whileHover={{ scale: 1.04, boxShadow: '0 8px 25px rgba(45,212,191,0.2)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: '0.6rem 1.4rem', borderRadius: '999px',
            border: '1px solid rgba(45,212,191,0.3)',
            background: 'rgba(45,212,191,0.08)', color: 'var(--secondary)',
            fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontFamily: 'inherit', transition: 'all 0.3s',
          }}
        >
          📄 Download PDF Report
        </motion.button>
      </div>

      <div ref={reportRef}>
        {/* PDF Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', paddingTop: '0.5rem' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)', letterSpacing: '1px' }}>
            🩺 PulseGuard AI — Health Report
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Generated: {new Date().toLocaleString('en-IN')}
          </div>
        </div>

        {/* Patient Summary */}
        {patientInput && (
          <motion.div
            className="glass-panel"
            style={{ padding: '1.5rem', marginBottom: '1.5rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <h3 style={s.sectionTitle()}>📋 Patient Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.4rem 1.5rem' }}>
              {[
                ['Gender', patientInput.gender],
                ['Age Group', patientInput.ageGroup],
                ['BMI', patientInput.bmi],
                ['Salt Intake', `${patientInput.saltIntake} g/day`],
                ['Stress Level', `${patientInput.stressLevel}/10`],
                ['Sleep Duration', `${patientInput.sleepDuration} hrs`],
                ['Smoking', patientInput.isSmoker === 'Yes' ? 'Smoker' : 'Non-Smoker'],
                ['Exercise', patientInput.exerciseLevel],
                ['Family History', patientInput.familyHistory],
                ['Known Patient', patientInput.isPatient],
                ['On Medication', patientInput.takesMedication],
                ['Symptom Severity', patientInput.severity],
                ['Shortness of Breath', patientInput.breathShortness],
                ['Visual Changes', patientInput.visualChanges],
                ['Nose Bleeding', patientInput.noseBleeding],
                ['Diagnosed Duration', patientInput.diagnosedDuration],
              ].map(([label, value]) => (
                <div key={label} style={s.profileRow}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-light)' }}>{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Risk Score Card */}
        <motion.div
          className="glass-panel"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden',
            animation: isCritical ? 'critical-pulse 3s ease-in-out infinite' : undefined,
          }}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        >
          {/* Background glow */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${rgbaFromHex(color, 0.08)}, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <p style={{
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            fontSize: '0.75rem',
            marginBottom: '1.2rem',
            fontWeight: 600,
          }}>
            Hypertension Risk Analysis
          </p>

          {/* Circular Score */}
          <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 1.5rem' }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="76" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
              <circle
                cx="90" cy="90" r="76"
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 76}`}
                strokeDashoffset={`${2 * Math.PI * 76 * (1 - animatedScore / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 90 90)"
                style={{ filter: `drop-shadow(0 0 12px ${color})`, transition: 'stroke-dashoffset 0.1s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontSize: '2.4rem', fontWeight: '800', color,
                textShadow: `0 0 20px ${rgbaFromHex(color, 0.3)}`,
              }}>
                {animatedScore}%
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Risk Score
              </span>
            </div>
          </div>

          <div style={{
            fontSize: '2.2rem', fontWeight: '900', color,
            textShadow: `0 0 30px ${rgbaFromHex(color, 0.4)}`,
            marginBottom: '0.8rem',
          }}>
            {riskLevel} Risk
          </div>

          <p style={{ color: 'var(--text-dim)', maxWidth: '500px', margin: '0 auto 1.2rem', fontSize: '0.9rem' }}>
            Based on <strong style={{ color }}>{1825} clinical records</strong>, your profile most closely matches:
          </p>

          <div style={{
            display: 'inline-block',
            padding: '0.7rem 1.6rem',
            background: rgbaFromHex(color, 0.1),
            border: `1px solid ${rgbaFromHex(color, 0.3)}`,
            borderRadius: '999px',
            fontSize: '1rem',
            fontWeight: '700',
            color,
          }}>
            🩺 Predicted BP: {predictedBP}
          </div>

          {/* BP Stages Reference */}
          <div style={{ marginTop: '2rem', width: '100%', maxWidth: '580px', margin: '2rem auto 0' }}>
            <p style={{
              fontSize: '0.72rem', color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.8rem', fontWeight: 600,
            }}>
              Blood Pressure Stages
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {[
                { stage: 'Normal', range: '< 120 / < 80', color: '#34d399', desc: 'Healthy BP — keep it up!' },
                { stage: 'Elevated', range: '120–129 / < 80', color: '#4ade80', desc: 'At risk — lifestyle changes needed' },
                { stage: 'Stage 1', range: '130–139 / 80–89', color: '#fbbf24', desc: 'High BP — doctor consultation advised' },
                { stage: 'Stage 2', range: '140–179 / 90–119', color: '#f97316', desc: 'High BP — medication likely needed' },
                { stage: 'Crisis', range: '≥ 180 / ≥ 120', color: '#f87171', desc: 'Emergency — seek care immediately' },
              ].map(({ stage, range, color: stageColor, desc }) => {
                const isActive = predictedBP && predictedBP.toLowerCase().includes(stage.toLowerCase());
                return (
                  <motion.div
                    key={stage}
                    initial={false}
                    animate={{
                      background: isActive ? rgbaFromHex(stageColor, 0.1) : 'rgba(255,255,255,0.02)',
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.8rem',
                      padding: '0.5rem 0.8rem', borderRadius: '10px',
                      border: isActive ? `1px solid ${rgbaFromHex(stageColor, 0.4)}` : '1px solid rgba(255,255,255,0.04)',
                      transition: 'all 0.3s',
                    }}
                  >
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: stageColor, flexShrink: 0,
                      boxShadow: isActive ? `0 0 8px ${stageColor}` : 'none',
                    }} />
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: stageColor, minWidth: '55px' }}>{stage}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', minWidth: '120px' }}>{range} mmHg</span>
                    <span style={{ fontSize: '0.76rem', color: isActive ? 'var(--text-light)' : 'var(--text-muted)', flex: 1 }}>{desc}</span>
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        style={{
                          fontSize: '0.68rem', fontWeight: 700, color: stageColor,
                          background: rgbaFromHex(stageColor, 0.15),
                          padding: '2px 10px', borderRadius: '999px', whiteSpace: 'nowrap',
                        }}
                      >
                        YOUR STAGE
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Bottom Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

          {/* Lifestyle Tips */}
          <motion.div
            className="glass-panel"
            style={s.card}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 80 }}
            whileHover={{ y: -6, borderColor: 'rgba(45,212,191,0.15)' }}
          >
            <h3 style={{ ...s.sectionTitle(), display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AnimatedLightbulb size={24} /> Recommendations</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {tips.map((tip, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.08, duration: 0.35 }}
                  whileHover={{ x: 4, background: 'rgba(45,212,191,0.06)' }}
                  style={{
                    padding: '0.65rem 0.8rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    cursor: 'default',
                    transition: 'background 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                  }}
                >
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{tip.icon}</span>
                  <span>{tip.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Medicine Links */}
          <motion.div
            className="glass-panel"
            style={s.card}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, type: 'spring', stiffness: 80 }}
            whileHover={{ y: -6, borderColor: 'rgba(45,212,191,0.15)' }}
          >
            <h3 style={{ ...s.sectionTitle(), display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AnimatedPill size={24} /> Suggested Medicines</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', background: 'rgba(251,191,36,0.06)', padding: '0.5rem 0.7rem', borderRadius: '8px', border: '1px solid rgba(251,191,36,0.12)' }}>
              ⚠️ Always consult a doctor before taking any medication.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {medicines.map((med, i) => (
                <motion.a
                  key={i}
                  href={amazonLink(med.query)}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.35 }}
                  whileHover={{ scale: 1.02, x: 4, boxShadow: '0 4px 20px rgba(45,212,191,0.15)' }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: 'rgba(45, 212, 191, 0.05)',
                    border: '1px solid rgba(45, 212, 191, 0.12)',
                    borderRadius: '12px', textDecoration: 'none',
                    color: 'var(--text-light)', fontSize: '0.86rem', cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                >
                  <span>{med.name}</span>
                  <span style={{
                    color: '#f59e0b', fontSize: '0.73rem', fontWeight: 600,
                    whiteSpace: 'nowrap', marginLeft: '0.8rem',
                    background: 'rgba(245,158,11,0.1)',
                    padding: '3px 10px',
                    borderRadius: '999px',
                  }}>
                    🛒 Amazon
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Similar Cases */}
          <motion.div
            className="glass-panel"
            style={s.card}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, type: 'spring', stiffness: 80 }}
            whileHover={{ y: -6, borderColor: 'rgba(45,212,191,0.15)' }}
          >
            <h3 style={{ ...s.sectionTitle(), display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AnimatedSearch size={24} /> Similar Cases (k-NN)</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Top 3 most similar profiles from our dataset:
            </p>
            {neighbors.map((n, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.1, duration: 0.35 }}
                whileHover={{ x: -4, background: 'rgba(255,255,255,0.05)' }}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.7rem 1rem',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '10px', marginBottom: '0.5rem', fontSize: '0.84rem',
                  cursor: 'default', transition: 'background 0.2s',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <span style={{ color: 'var(--text-dim)' }}>
                  {n.Gender} · Age {n.Age} · BP {n.Systolic}/{n.Diastolic}
                </span>
                <span style={{
                  color: n.Stages?.includes('CRISIS') ? '#ef4444' : n.Stages?.includes('Stage-2') ? '#f87171' : '#fbbf24',
                  fontWeight: 700, fontSize: '0.75rem',
                  background: n.Stages?.includes('CRISIS') ? 'rgba(239,68,68,0.1)' : n.Stages?.includes('Stage-2') ? 'rgba(248,113,113,0.1)' : 'rgba(251,191,36,0.1)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}>
                  {n.Stages || 'Unknown'}
                </span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default RiskDashboard;
