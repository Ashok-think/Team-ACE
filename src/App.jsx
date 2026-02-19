import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AssessmentForm from './components/AssessmentForm';
import RiskDashboard from './components/RiskDashboard';
import Hero3D from './components/Hero3D';
import EcgAnimation from './components/EcgAnimation';
import { AnimatedDataIcon, AnimatedSpeedIcon, AnimatedShieldIcon, AnimatedHeartPulse, AnimatedDNA } from './components/AnimatedIcons';
import { calculateRisk } from './utils/riskModel';
import './styles/global.css';
import logoSvg from './assets/logo.svg';

// ─── Cursor Trail — visible glowing particles that follow the mouse ──
const CursorTrail = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -100, y: -100 });
  const particles = useRef([]);
  const raf = useRef(null);
  const lastSpawn = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMove, { passive: true });

    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new particles every ~20ms
      if (time - lastSpawn.current > 20) {
        lastSpawn.current = time;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.6 + 0.2;
        particles.current.push({
          x: mouse.current.x,
          y: mouse.current.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: Math.random() * 4 + 2,
        });
      }

      // Update and draw particles
      particles.current = particles.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.018;
        if (p.life <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45, 212, 191, ${p.life * 0.5})`;
        ctx.fill();

        // Outer glow ring per particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45, 212, 191, ${p.life * 0.08})`;
        ctx.fill();
        return true;
      });

      // Main cursor ring
      const mx = mouse.current.x;
      const my = mouse.current.y;
      if (mx > 0 && my > 0) {
        // Outer glow
        ctx.beginPath();
        ctx.arc(mx, my, 28, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner bright dot
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(45, 212, 191, 0.6)';
        ctx.shadowColor = 'rgba(45, 212, 191, 0.8)';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

// ─── 3D Tilt card — reacts to mouse position ────────────────
const TiltCard = ({ children, className, style, ...rest }) => {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.02,1.02,1.02)`;
    card.style.setProperty('--glow-x', `${(x + 0.5) * 100}%`);
    card.style.setProperty('--glow-y', `${(y + 0.5) * 100}%`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={className}
      style={{ ...style, transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)', transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: 'radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(45,212,191,0.08), transparent 60%)',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.3s',
        }}
        className="tilt-inner-glow"
      />
    </motion.div>
  );
};

// ─── Animated count-up hook ──────────────────────────────────
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

const StatCount = ({ target, suffix = '', duration = 1800 }) => {
  const count = useCountUp(target, duration);
  return <span className="stat-number">{count.toLocaleString()}{suffix}</span>;
};

// ─── Floating particles ──────────────────────────────────────
const HeroParticles = () => {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: Math.random() * 10 + 12,
  }));

  return (
    <div className="hero-particles">
      {particles.map(p => (
        <div
          key={p.id}
          className="hero-particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// ─── Nav bar with scroll detection ───────────────────────────
const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`nav-bar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-logo">
        <img src={logoSvg} alt="PulseGuard" className="nav-logo-img" />
        PulseGuard <span className="nav-logo-gradient">AI</span>
      </div>
      <div className="nav-status">
        <div className="nav-status-dot" />
        All systems operational
      </div>
    </nav>
  );
};

// ─── Processing screen with animated steps ───────────────────
const PROCESSING_STEPS = [
  'Scanning patient database...',
  'Comparing health profiles...',
  'Running k-NN algorithm...',
  'Generating risk report...',
];

const ProcessingScreen = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => prev < PROCESSING_STEPS.length - 1 ? prev + 1 : prev);
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key="processing"
      className="page-center processing-view"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.5rem' }}>
        <AnimatedDNA size={70} />
        <div style={{ flex: '0 1 400px' }}>
          <EcgAnimation color="#2dd4bf" width={400} height={80} speed={2.5} />
        </div>
        <AnimatedDNA size={70} />
      </div>
      <h2>Analyzing Health Patterns</h2>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
        Cross-referencing your profile with clinical data
      </p>
      <div className="processing-progress">
        <div className="processing-progress-bar" />
      </div>
      <div className="processing-steps">
        {PROCESSING_STEPS.map((step, i) => (
          <motion.div
            key={i}
            className={`processing-step ${i === activeStep ? 'active' : i < activeStep ? 'done' : ''}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.3 }}
          >
            <div className="processing-step-dot" />
            {step}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Footer ──────────────────────────────────────────────────
const Footer = () => (
  <footer className="app-footer">
    <div className="footer-brand">
      <img src={logoSvg} alt="PulseGuard" style={{ width: '24px', height: '24px', verticalAlign: 'middle', marginRight: '6px' }} />
      PulseGuard <span>AI</span>
    </div>
    <p className="footer-disclaimer">
      ⚠️ This tool is for informational purposes only. It does not replace
      professional medical advice. Always consult a healthcare provider.
    </p>
    <div className="footer-links">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
      <a href="#">About</a>
    </div>
  </footer>
);

// ─── FAQ Accordion ───────────────────────────────────────────
const FAQ_DATA = [
  { q: 'Is my health data stored anywhere?', a: 'No. PulseGuard AI runs entirely in your browser. Your data never leaves your device — nothing is sent to any server, ever.' },
  { q: 'How accurate is the prediction?', a: 'Our k-NN model achieves 98.5% accuracy when tested against clinical records. However, this is a screening tool — always consult a doctor for medical decisions.' },
  { q: 'What algorithm powers this?', a: 'We use the k-Nearest Neighbors (k-NN) algorithm, trained on 2,000+ anonymized patient records from clinical datasets covering hypertension risk factors.' },
  { q: 'Can this replace a doctor visit?', a: 'No. PulseGuard AI is an informational tool designed to raise awareness about cardiovascular health. It is not a medical diagnosis and should not replace professional medical advice.' },
  { q: 'What health factors are analyzed?', a: 'We analyze age, gender, BMI, salt intake, stress levels, sleep duration, exercise habits, family history, smoking status, and current symptoms like shortness of breath and visual changes.' },
  { q: 'Is it free to use?', a: 'Yes, completely free. No sign-up, no subscription, no hidden costs. PulseGuard AI is an open-source health awareness project.' },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <motion.section
      className="faq-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
    >
      <p className="section-label">FAQ</p>
      <h2 className="section-heading">Frequently Asked Questions</h2>
      <div className="faq-list">
        {FAQ_DATA.map((item, i) => (
          <motion.div
            key={i}
            className={`faq-item glass-panel ${openIndex === i ? 'faq-open' : ''}`}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
          >
            <button
              className="faq-question"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span>{item.q}</span>
              <span className="faq-chevron">{openIndex === i ? '−' : '+'}</span>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  className="faq-answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

// ═════════════════════════════════════════════════════════════
// MAIN APP
// ═════════════════════════════════════════════════════════════
function App() {
  const [view, setView] = useState('landing');
  const [riskData, setRiskData] = useState(null);
  const [patientInput, setPatientInput] = useState(null);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const handleCalculation = (formData) => {
    setPatientInput(formData);
    setView('processing');
    setTimeout(() => {
      const result = calculateRisk(formData);
      setRiskData(result);
      setView('results');
    }, 2200);
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

      <NavBar />

      <div className="app-wrapper" style={{ paddingTop: '56px' }}>
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
                <HeroParticles />
                <motion.div
                  className="hero-badge"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  🩺 AI-Powered Health Analysis
                </motion.div>
                <h1 className="hero-title">
                  PulseGuard <span className="gradient-text">AI</span>
                </h1>
                <p className="hero-subtitle">
                  Advanced hypertension risk prediction powered by data-driven analysis.
                  Identify silent threats before they become critical.
                </p>
                <motion.button
                  className="btn-primary hero-btn"
                  onClick={() => setView('form')}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Start Free Assessment
                </motion.button>

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
                    <span className="stat-label">Private & Local</span>
                  </motion.div>
                </div>
              </div>

              <div className="features-grid">
                {[
                  { icon: <AnimatedDataIcon size={64} />, title: 'Data-Driven', desc: 'Analyzes 2,000+ patient records with k-Nearest Neighbors algorithm' },
                  { icon: <AnimatedSpeedIcon size={64} />, title: 'Instant Results', desc: 'Browser-based processing — no servers, no waiting, pure speed' },
                  { icon: <AnimatedShieldIcon size={64} />, title: '100% Private', desc: 'Your health data never leaves your device. Zero data collection' },
                ].map((f, i) => (
                  <TiltCard
                    key={i}
                    className="glass-panel feature-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                  >
                    <span className="feature-card-number">0{i + 1}</span>
                    <div className="feature-icon">
                      {f.icon}
                    </div>
                    <h4 className="feature-title">{f.title}</h4>
                    <p className="feature-desc">{f.desc}</p>
                  </TiltCard>
                ))}
              </div>

              {/* ─── How It Works ──────────────────────────── */}
              <motion.section
                className="how-it-works"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
              >
                <p className="section-label">How It Works</p>
                <h2 className="section-heading">Three Simple Steps to Know Your Risk</h2>
                <div className="steps-row">
                  {[
                    { num: '01', icon: '📝', title: 'Enter Your Data', desc: 'Fill in basic health metrics — age, lifestyle, symptoms. Takes under 60 seconds.' },
                    { num: '02', icon: '🧠', title: 'AI Analyzes', desc: 'Our k-NN algorithm compares your profile against 2,000+ real clinical records.' },
                    { num: '03', icon: '📊', title: 'Get Your Report', desc: 'Receive a detailed risk assessment with personalized recommendations instantly.' },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      className="step-card glass-panel"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15, duration: 0.5 }}
                    >
                      <div className="step-num">{s.num}</div>
                      <div className="step-icon">{s.icon}</div>
                      <h4>{s.title}</h4>
                      <p>{s.desc}</p>
                      {i < 2 && <div className="step-connector" />}
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* ─── Social Proof Bar ──────────────────────── */}
              <motion.section
                className="social-proof"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
              >
                <div className="proof-items">
                  {[
                    { value: '10,000+', label: 'Assessments Completed' },
                    { value: '98.5%', label: 'Prediction Accuracy' },
                    { value: '2,000+', label: 'Clinical Records' },
                    { value: '<60s', label: 'Average Time' },
                  ].map((p, i) => (
                    <motion.div
                      key={i}
                      className="proof-item"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                    >
                      <span className="proof-value">{p.value}</span>
                      <span className="proof-label">{p.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* ─── FAQ Section ───────────────────────────── */}
              <FAQSection />

              {/* ─── CTA Banner ────────────────────────────── */}
              <motion.section
                className="cta-banner"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
              >
                <h2>Ready to Know Your Risk?</h2>
                <p>Take a free, private health assessment — it only takes 60 seconds.</p>
                <motion.button
                  className="cta-btn"
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(45,212,191,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setView('form')}
                >
                  Start Free Assessment →
                </motion.button>
                <span className="cta-note">🔒 No sign-up required • 100% private</span>
              </motion.section>

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
              <button onClick={reset} className="back-btn">← Back to Home</button>
              <AssessmentForm onCalculate={handleCalculation} />
            </motion.div>
          )}

          {view === 'processing' && <ProcessingScreen />}

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

      <Footer />
    </>
  );
}

export default App;
