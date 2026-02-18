import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AssessmentForm from './components/AssessmentForm';
import RiskDashboard from './components/RiskDashboard';
import Hero3D from './components/Hero3D';
import { calculateRisk } from './utils/riskModel';
import './styles/global.css';

import dataDrivenImg from './assets/data-driven.png.png';
import instantImg from './assets/instant.png.png';
import privateImg from './assets/private.png.png';

// Animated count-up hook
const useCountUp = (target, duration = 1800, start = true) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

// Animated stat number component
const StatCount = ({ target, suffix = '', duration = 1800 }) => {
  const count = useCountUp(target, duration);
  return (
    <span className="stat-number">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

function App() {
  const [view, setView] = useState('landing');
  const [riskData, setRiskData] = useState(null);
  const [patientInput, setPatientInput] = useState(null);

  const handleCalculation = (formData) => {
    setPatientInput(formData);
    setView('processing');
    setTimeout(() => {
      const result = calculateRisk(formData);
      setRiskData(result);
      setView('results');
    }, 2000);
  };

  const reset = () => {
    setRiskData(null);
    setView('landing');
  };

  return (
    <>
      <Suspense fallback={null}>
        <Hero3D />
      </Suspense>

      <div className="app-wrapper">
        <AnimatePresence mode='wait'>

          {view === 'landing' && (
            <motion.div
              key="landing"
              className="page-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <div className="hero-section">
                <div className="hero-badge">🩺 AI-Powered Health Analysis</div>
                <h1 className="hero-title">
                  PulseGuard <span className="gradient-text">AI</span>
                </h1>
                <p className="hero-subtitle">
                  Advanced hypertension risk prediction powered by data-driven analysis.
                  Identify silent threats before they become critical.
                </p>
                <button className="btn-primary hero-btn" onClick={() => setView('form')}>
                  Start Free Assessment
                </button>

                <div className="stats-row">
                  <motion.div className="stat-item"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
                    <StatCount target={2000} suffix="+" />
                    <span className="stat-label">Patient Records</span>
                  </motion.div>
                  <div className="stat-divider" />
                  <motion.div className="stat-item"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6 }}>
                    <span className="stat-number">k-NN</span>
                    <span className="stat-label">AI Algorithm</span>
                  </motion.div>
                  <div className="stat-divider" />
                  <motion.div className="stat-item"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}>
                    <StatCount target={100} suffix="%" />
                    <span className="stat-label">Private &amp; Local</span>
                  </motion.div>
                </div>
              </div>

              <div className="features-grid">
                {[
                  { img: dataDrivenImg, title: 'Data-Driven', desc: 'Analyzes 2,000+ patient records in real-time' },
                  { img: instantImg, title: 'Instant Results', desc: 'Browser-based processing, no server needed' },
                  { img: privateImg, title: 'Private', desc: 'Your data never leaves your device' },
                ].map((f, i) => (
                  <motion.div
                    key={i}
                    className="glass-panel feature-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(45,212,191,0.15)' }}
                  >
                    <div className="feature-icon">
                      <img src={f.img} alt={f.title} style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
                    </div>
                    <h4 className="feature-title">{f.title}</h4>
                    <p className="feature-desc">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'form' && (
            <motion.div
              key="form"
              className="page-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <button onClick={reset} className="back-btn">← Back</button>
              <AssessmentForm onCalculate={handleCalculation} />
            </motion.div>
          )}

          {view === 'processing' && (
            <motion.div
              key="processing"
              className="page-center processing-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="spinner"></div>
              <h2>Analyzing Health Patterns...</h2>
              <p style={{ color: 'var(--text-dim)' }}>Comparing your profile with similar clinical cases.</p>
            </motion.div>
          )}

          {view === 'results' && riskData && (
            <motion.div
              key="results"
              className="page-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              <RiskDashboard data={riskData} patientInput={patientInput} onReset={reset} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
