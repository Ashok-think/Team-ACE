import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Score-based medicine & tip lookup (more precise than just risk level)
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
    '✅ Maintain your healthy lifestyle',
    '🥗 Keep eating a balanced, low-sodium diet',
    '🏃 Continue regular physical activity',
    '🩺 Annual check-ups are still recommended',
  ];
  if (score <= 35) return [
    '⚠️ Monitor your BP regularly at home',
    '🥗 Reduce salt intake to <5g/day',
    '🏃 30 mins of moderate exercise daily',
    '😴 Aim for 7–8 hours of sleep',
    '🧘 Try stress-reduction techniques',
  ];
  if (score <= 55) return [
    '⚠️ Consult a doctor for a BP check',
    '🥗 Reduce salt intake to <5g/day',
    '🏃 30 mins of moderate exercise daily',
    '🧘 Practice stress-reduction techniques',
    '😴 Aim for 7–8 hours of sleep',
  ];
  if (score <= 75) return [
    '🚨 See a doctor as soon as possible',
    '🥗 Strict low-sodium DASH diet',
    '🚭 Quit smoking immediately',
    '🏃 Daily light exercise (walking)',
    '📉 Monitor BP at home daily',
  ];
  return [
    '🆘 Seek immediate medical attention',
    '📵 Avoid all stimulants (caffeine, alcohol)',
    '🥗 Hospital-grade dietary restrictions',
    '📊 Daily BP monitoring required',
    '💊 Medication likely needed — see a cardiologist',
  ];
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
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);

  const downloadPDF = async () => {
    const el = reportRef.current;
    if (!el) return;
    const canvas = await html2canvas(el, { backgroundColor: '#0a0f1e', scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
    pdf.save(`PulseGuard-Report-${new Date().toLocaleDateString('en-IN').replace(/\//g,'-')}.pdf`);
  };

  const colorMap = {
    Low: '#34d399',
    Moderate: '#fbbf24',
    High: '#f87171',
    Critical: '#ef4444',
  };
  const color = colorMap[riskLevel] || '#2dd4bf';

  const medicines = getMedicinesForScore(score);
  const tips = getTipsForScore(score);

  const amazonLink = (query) =>
    `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;

  return (
    <div style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={onReset} className="back-btn" style={{ margin: 0 }}>← Start Over</button>
        <motion.button
          onClick={downloadPDF}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: '0.6rem 1.4rem', borderRadius: '999px', border: '1px solid rgba(45,212,191,0.4)',
            background: 'rgba(45,212,191,0.1)', color: 'var(--secondary)', fontWeight: 600,
            cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}
        >
          📄 Download PDF Report
        </motion.button>
      </div>
      <div ref={reportRef}>

      {/* PDF Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', paddingTop: '1rem' }}>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--secondary)', letterSpacing: '1px' }}>🩺 PulseGuard AI — Health Report</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>Generated: {new Date().toLocaleString('en-IN')}</div>
      </div>

      {/* Patient Summary Card */}
      {patientInput && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--secondary)', marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px' }}>📋 Patient Profile</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem 1.5rem' }}>
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
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>{label}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-light)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Score Card */}
      <motion.div
        className="glass-panel"
        style={{ padding: '3rem', textAlign: 'center', marginBottom: '2rem' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p style={{ color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.8rem', marginBottom: '1rem' }}>
          Hypertension Risk Analysis
        </p>

        {/* Circular Score */}
        <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 1.5rem' }}>
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
            <circle
              cx="80" cy="80" r="70"
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - animatedScore / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
              style={{ filter: `drop-shadow(0 0 8px ${color})` }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', color }}>{animatedScore}%</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Risk Score</span>
          </div>
        </div>

        <div style={{ fontSize: '2.5rem', fontWeight: '900', color, textShadow: `0 0 30px ${color}`, marginBottom: '0.5rem' }}>
          {riskLevel} Risk
        </div>
        <p style={{ color: 'var(--text-dim)', maxWidth: '500px', margin: '0 auto 1rem' }}>
          Based on <strong style={{ color }}>1,825 clinical records</strong>, your profile most closely matches patients with:
        </p>
        <div style={{ display: 'inline-block', padding: '0.6rem 1.4rem', background: `rgba(${color === '#34d399' ? '52,211,153' : color === '#fbbf24' ? '251,191,36' : '248,113,113'},0.15)`, border: `1px solid ${color}`, borderRadius: '999px', fontSize: '1rem', fontWeight: '700', color, marginBottom: '0.5rem' }}>
          🩺 Predicted BP: {predictedBP}
        </div>

        {/* BP Stages Reference */}
        <div style={{ marginTop: '1.5rem', width: '100%', maxWidth: '560px', margin: '1.2rem auto 0' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.7rem' }}>Blood Pressure Stages</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[
              { stage: 'Normal',    range: '< 120 / < 80',        color: '#34d399', desc: 'Healthy BP — keep it up!' },
              { stage: 'Elevated',  range: '120–129 / < 80',      color: '#4ade80', desc: 'At risk — lifestyle changes needed' },
              { stage: 'Stage 1',   range: '130–139 / 80–89',     color: '#fbbf24', desc: 'High BP — doctor consultation advised' },
              { stage: 'Stage 2',   range: '140–179 / 90–119',    color: '#f97316', desc: 'High BP — medication likely needed' },
              { stage: 'Crisis',    range: '≥ 180 / ≥ 120',       color: '#f87171', desc: 'Emergency — seek care immediately' },
            ].map(({ stage, range, color: stageColor, desc }) => {
              const isActive = predictedBP && predictedBP.toLowerCase().includes(stage.toLowerCase());
              return (
                <div key={stage} style={{
                  display: 'flex', alignItems: 'center', gap: '0.8rem',
                  padding: '0.5rem 0.8rem', borderRadius: '10px',
                  background: isActive ? `rgba(${stageColor === '#34d399' ? '52,211,153' : stageColor === '#a3e635' ? '163,230,53' : stageColor === '#fbbf24' ? '251,191,36' : stageColor === '#f97316' ? '249,115,22' : '248,113,113'},0.12)` : 'rgba(255,255,255,0.03)',
                  border: isActive ? `1px solid ${stageColor}` : '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.3s',
                }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: stageColor, flexShrink: 0, boxShadow: isActive ? `0 0 8px ${stageColor}` : 'none' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.82rem', color: stageColor, minWidth: '60px' }}>{stage}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', minWidth: '130px' }}>{range} mmHg</span>
                  <span style={{ fontSize: '0.78rem', color: isActive ? 'var(--text-light)' : 'var(--text-dim)' }}>{desc}</span>
                  {isActive && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', fontWeight: 700, color: stageColor, background: `rgba(${stageColor === '#34d399' ? '52,211,153' : stageColor === '#a3e635' ? '163,230,53' : stageColor === '#fbbf24' ? '251,191,36' : stageColor === '#f97316' ? '249,115,22' : '248,113,113'},0.2)`, padding: '2px 8px', borderRadius: '999px' }}>YOUR STAGE</span>}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

        {/* Lifestyle Tips */}
        <motion.div className="glass-panel" style={{ padding: '2rem' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, type: 'spring', stiffness: 80 }}
          whileHover={{ y: -6, boxShadow: '0 24px 48px rgba(45,212,191,0.15)' }}
        >
          <h3 style={{ marginBottom: '1.2rem', color: 'var(--secondary)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.8rem' }}>
            💡 Recommendations
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {tips.map((tip, i) => (
              <motion.li key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                whileHover={{ x: 4, background: 'rgba(45,212,191,0.08)' }}
                style={{ padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '0.9rem', cursor: 'default', transition: 'background 0.2s' }}
              >
                {tip}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Medicine Links */}
        <motion.div className="glass-panel" style={{ padding: '2rem' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, type: 'spring', stiffness: 80 }}
          whileHover={{ y: -6, boxShadow: '0 24px 48px rgba(45,212,191,0.15)' }}
        >
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--secondary)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.8rem' }}>
            💊 Suggested Medicines
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
            ⚠️ Always consult a doctor before taking any medication.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {medicines.map((med, i) => (
              <motion.a
                key={i}
                href={amazonLink(med.query)}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.03, x: 5, boxShadow: '0 4px 20px rgba(45,212,191,0.2)' }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.8rem 1rem',
                  background: 'rgba(45, 212, 191, 0.07)',
                  border: '1px solid rgba(45, 212, 191, 0.2)',
                  borderRadius: '10px', textDecoration: 'none',
                  color: 'var(--text-light)', fontSize: '0.88rem', cursor: 'pointer',
                }}
              >
                <span>{med.name}</span>
                <span style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: '600', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                  🛒 Amazon →
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Similar Cases */}
        <motion.div className="glass-panel" style={{ padding: '2rem' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5, type: 'spring', stiffness: 80 }}
          whileHover={{ y: -6, boxShadow: '0 24px 48px rgba(45,212,191,0.15)' }}
        >
          <h3 style={{ marginBottom: '1.2rem', color: 'var(--secondary)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.8rem' }}>
            🔍 Similar Cases (k-NN)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
            Top 3 most similar profiles from our dataset:
          </p>
          {neighbors.map((n, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.12, duration: 0.4 }}
              whileHover={{ x: -4, background: 'rgba(255,255,255,0.06)' }}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.7rem 1rem', background: 'rgba(0,0,0,0.25)',
                borderRadius: '8px', marginBottom: '0.6rem', fontSize: '0.85rem',
                cursor: 'default', transition: 'background 0.2s',
              }}
            >
              <span style={{ color: 'var(--text-dim)' }}>{n.Gender} · Age {n.Age} · BP {n.Systolic}/{n.Diastolic}</span>
              <span style={{ color: n.Stages?.includes('CRISIS') ? '#ef4444' : n.Stages?.includes('Stage-2') ? '#f87171' : '#fbbf24', fontWeight: '700', fontSize: '0.78rem' }}>
                {n.Stages || 'Unknown'}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
      </div> {/* end reportRef */}
    </div>
  );
};

export default RiskDashboard;
