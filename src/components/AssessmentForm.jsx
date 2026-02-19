import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedStethoscope } from './AnimatedIcons';
import './AssessmentForm.css';

const STEPS = [
  { id: 1, title: 'Basic Info', icon: '👤' },
  { id: 2, title: 'Lifestyle', icon: '🏃' },
  { id: 3, title: 'Symptoms', icon: '🏥' },
];

// ─── Premium Toggle Button Group ─────────────────────────────
const ToggleField = ({ label, name, value, onChange, options }) => (
  <div className="form-group">
    <label>{label}</label>
    <div className="toggle-group">
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          className={`toggle-btn ${value === o.value ? 'active' : ''}`}
          onClick={() => onChange({ target: { name, value: o.value, type: 'button' } })}
        >
          {o.icon && <span className="toggle-icon">{o.icon}</span>}
          {o.label}
        </button>
      ))}
    </div>
  </div>
);

// ─── Premium Select Field ────────────────────────────────────
const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="form-group">
    <label>{label}</label>
    <div className="select-wrapper">
      <select name={name} value={value} onChange={onChange}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span className="select-arrow">▾</span>
    </div>
  </div>
);

// ─── Premium Slider ──────────────────────────────────────────
const SliderField = ({ label, name, value, onChange, min, max, step = 1, unit = '' }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="form-group">
      <label>
        {label}
        <span className="slider-value">{value}{unit}</span>
      </label>
      <div className="slider-container">
        <input
          type="range"
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          style={{ '--progress': `${percentage}%` }}
        />
      </div>
      <div className="slider-limits">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

// ─── Animated Step Indicator ─────────────────────────────────
const StepIndicator = ({ steps, currentStep }) => (
  <div className="step-indicator">
    {steps.map((s, i) => (
      <React.Fragment key={s.id}>
        <div className={`step-node ${currentStep >= s.id ? 'active' : ''} ${currentStep > s.id ? 'done' : ''}`}>
          <div className="step-circle">
            {currentStep > s.id ? (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>✓</motion.span>
            ) : (
              s.icon
            )}
          </div>
          <span className="step-label">{s.title}</span>
        </div>
        {i < steps.length - 1 && (
          <div className="step-connector">
            <motion.div
              className="step-connector-fill"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: currentStep > s.id ? 1 : 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        )}
      </React.Fragment>
    ))}
  </div>
);

// ═════════════════════════════════════════════════════════════
// MAIN FORM
// ═════════════════════════════════════════════════════════════
const AssessmentForm = ({ onCalculate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gender: 'Male',
    ageGroup: '18-34',
    familyHistory: 'Yes',
    isPatient: 'No',
    takesMedication: 'No',
    severity: 'Mild',
    breathShortness: 'No',
    visualChanges: 'No',
    noseBleeding: 'No',
    diagnosedDuration: '<1 Year',
    bmi: 25,
    saltIntake: 5,
    stressLevel: 5,
    sleepDuration: 7,
    isSmoker: 'No',
    exerciseLevel: 'Moderate',
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'range' ? parseFloat(value) : value }));
  };

  return (
    <div className="glass-panel form-container">
      <div className="form-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <AnimatedStethoscope size={48} />
        <h2>Health Assessment</h2>
        <p>Answer based on your current health status</p>
      </div>

      <StepIndicator steps={STEPS} currentStep={step} />

      <AnimatePresence mode="wait">
        {/* Step 1 — Basic Info */}
        {step === 1 && (
          <motion.div
            key="step1"
            className="form-grid"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ToggleField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={[
              { value: 'Male', label: 'Male', icon: '♂' },
              { value: 'Female', label: 'Female', icon: '♀' },
            ]} />
            <SelectField label="Age Group" name="ageGroup" value={formData.ageGroup} onChange={handleChange} options={[
              { value: '18-34', label: '18–34 years' },
              { value: '35-50', label: '35–50 years' },
              { value: '51-64', label: '51–64 years' },
              { value: '65+', label: '65+ years' },
            ]} />
            <ToggleField label="Family History of Hypertension?" name="familyHistory" value={formData.familyHistory} onChange={handleChange} options={[
              { value: 'Yes', label: 'Yes', icon: '✓' },
              { value: 'No', label: 'No', icon: '✗' },
            ]} />
            <ToggleField label="Known hypertension patient?" name="isPatient" value={formData.isPatient} onChange={handleChange} options={[
              { value: 'Yes', label: 'Yes', icon: '✓' },
              { value: 'No', label: 'No', icon: '✗' },
            ]} />
          </motion.div>
        )}

        {/* Step 2 — Lifestyle */}
        {step === 2 && (
          <motion.div
            key="step2"
            className="form-grid"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SliderField label="BMI" name="bmi" value={formData.bmi} onChange={handleChange} min={10} max={50} step={0.5} />
            <SliderField label="Daily Salt Intake" name="saltIntake" value={formData.saltIntake} onChange={handleChange} min={0} max={15} unit=" g" />
            <SliderField label="Stress Level" name="stressLevel" value={formData.stressLevel} onChange={handleChange} min={0} max={10} />
            <SliderField label="Sleep Duration" name="sleepDuration" value={formData.sleepDuration} onChange={handleChange} min={3} max={12} unit=" hrs" />
            <ToggleField label="Smoking Status" name="isSmoker" value={formData.isSmoker} onChange={handleChange} options={[
              { value: 'No', label: 'Non-Smoker', icon: '🚭' },
              { value: 'Yes', label: 'Smoker', icon: '🚬' },
            ]} />
            <SelectField label="Exercise Level" name="exerciseLevel" value={formData.exerciseLevel} onChange={handleChange} options={[
              { value: 'Low', label: 'Low (rarely active)' },
              { value: 'Moderate', label: 'Moderate (3–4x/week)' },
              { value: 'High', label: 'High (daily intense)' },
            ]} />
          </motion.div>
        )}

        {/* Step 3 — Symptoms */}
        {step === 3 && (
          <motion.div
            key="step3"
            className="form-grid"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ToggleField label="Currently taking BP medication?" name="takesMedication" value={formData.takesMedication} onChange={handleChange} options={[
              { value: 'Yes', label: 'Yes', icon: '💊' },
              { value: 'No', label: 'No', icon: '✗' },
            ]} />
            <SelectField label="Symptom Severity" name="severity" value={formData.severity} onChange={handleChange} options={[
              { value: 'Mild', label: 'Mild / None' },
              { value: 'Moderate', label: 'Moderate' },
              { value: 'Sever', label: 'Severe' },
            ]} />
            <ToggleField label="Shortness of Breath?" name="breathShortness" value={formData.breathShortness} onChange={handleChange} options={[
              { value: 'Yes', label: 'Yes', icon: '✓' },
              { value: 'No', label: 'No', icon: '✗' },
            ]} />
            <ToggleField label="Visual Changes / Blurred Vision?" name="visualChanges" value={formData.visualChanges} onChange={handleChange} options={[
              { value: 'Yes', label: 'Yes', icon: '✓' },
              { value: 'No', label: 'No', icon: '✗' },
            ]} />
            <ToggleField label="Frequent Nose Bleeding?" name="noseBleeding" value={formData.noseBleeding} onChange={handleChange} options={[
              { value: 'Yes', label: 'Yes', icon: '✓' },
              { value: 'No', label: 'No', icon: '✗' },
            ]} />
            <SelectField label="How long since first diagnosed?" name="diagnosedDuration" value={formData.diagnosedDuration} onChange={handleChange} options={[
              { value: '<1 Year', label: 'Less than 1 year / Not diagnosed' },
              { value: '1 - 5 Years', label: '1–5 years' },
              { value: '>5 Years', label: 'More than 5 years' },
            ]} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="form-nav">
        {step > 1 && (
          <motion.button
            type="button"
            className="btn-secondary"
            onClick={() => setStep(s => s - 1)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ← Back
          </motion.button>
        )}
        {step < 3 ? (
          <motion.button
            type="button"
            className="btn-primary form-next-btn"
            onClick={() => setStep(s => s + 1)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Next Step →
          </motion.button>
        ) : (
          <motion.button
            type="button"
            className="btn-primary form-next-btn"
            onClick={() => onCalculate(formData)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            🔍 Analyze My Risk
          </motion.button>
        )}
      </div>

      <p className="form-step-counter">Step {step} of {STEPS.length}</p>
    </div>
  );
};

export default AssessmentForm;
