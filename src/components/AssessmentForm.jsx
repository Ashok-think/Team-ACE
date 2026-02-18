import React, { useState } from 'react';
import './AssessmentForm.css';

const STEPS = [
  { id: 1, title: 'Basic Info', icon: '👤' },
  { id: 2, title: 'Lifestyle', icon: '🏃' },
  { id: 3, title: 'Symptoms', icon: '🏥' },
];

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="form-group">
    <label>{label}</label>
    <select name={name} value={value} onChange={onChange}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const SliderField = ({ label, name, value, onChange, min, max, step = 1, unit = '' }) => (
  <div className="form-group">
    <label>{label} <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{value}{unit}</span></label>
    <input type="range" name={name} min={min} max={max} step={step} value={value} onChange={onChange} />
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
      <span>{min}{unit}</span><span>{max}{unit}</span>
    </div>
  </div>
);

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
    <div className="glass-panel form-container fade-in" style={{ maxWidth: '720px' }}>
      <h2 style={{ textAlign: 'center', color: 'var(--secondary)', marginBottom: '0.5rem' }}>🩺 Health Assessment</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Answer based on your current health status
      </p>

      {/* Progress Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', alignItems: 'center' }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', margin: '0 auto 4px',
                background: step >= s.id ? 'var(--secondary)' : 'rgba(255,255,255,0.08)',
                border: `2px solid ${step >= s.id ? 'var(--secondary)' : 'rgba(255,255,255,0.15)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', transition: 'all 0.3s',
                boxShadow: step >= s.id ? '0 0 12px rgba(45,212,191,0.5)' : 'none',
              }}>
                {step > s.id ? '✓' : s.icon}
              </div>
              <div style={{ fontSize: '0.72rem', color: step >= s.id ? 'var(--secondary)' : 'var(--text-dim)', fontWeight: step === s.id ? 700 : 400 }}>
                {s.title}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 2, height: '2px', background: step > s.id ? 'var(--secondary)' : 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '20px', transition: 'background 0.3s' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0 1.5rem' }}>
          <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
          ]} />
          <SelectField label="Age Group" name="ageGroup" value={formData.ageGroup} onChange={handleChange} options={[
            { value: '18-34', label: '18–34 years' },
            { value: '35-50', label: '35–50 years' },
            { value: '51-64', label: '51–64 years' },
            { value: '65+', label: '65+ years' },
          ]} />
          <SelectField label="Family History of Hypertension?" name="familyHistory" value={formData.familyHistory} onChange={handleChange} options={[
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' },
          ]} />
          <SelectField label="Known hypertension patient?" name="isPatient" value={formData.isPatient} onChange={handleChange} options={[
            { value: 'No', label: 'No' },
            { value: 'Yes', label: 'Yes' },
          ]} />
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0 1.5rem' }}>
          <SliderField label="BMI" name="bmi" value={formData.bmi} onChange={handleChange} min={10} max={50} step={0.5} />
          <SliderField label="Daily Salt Intake" name="saltIntake" value={formData.saltIntake} onChange={handleChange} min={0} max={15} unit=" g" />
          <SliderField label="Stress Level" name="stressLevel" value={formData.stressLevel} onChange={handleChange} min={0} max={10} />
          <SliderField label="Sleep Duration" name="sleepDuration" value={formData.sleepDuration} onChange={handleChange} min={3} max={12} unit=" hrs" />
          <SelectField label="Smoking Status" name="isSmoker" value={formData.isSmoker} onChange={handleChange} options={[
            { value: 'No', label: 'Non-Smoker' },
            { value: 'Yes', label: 'Smoker' },
          ]} />
          <SelectField label="Exercise Level" name="exerciseLevel" value={formData.exerciseLevel} onChange={handleChange} options={[
            { value: 'Low', label: 'Low (rarely active)' },
            { value: 'Moderate', label: 'Moderate (3–4x/week)' },
            { value: 'High', label: 'High (daily intense)' },
          ]} />
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0 1.5rem' }}>
          <SelectField label="Currently taking BP medication?" name="takesMedication" value={formData.takesMedication} onChange={handleChange} options={[
            { value: 'No', label: 'No' },
            { value: 'Yes', label: 'Yes' },
          ]} />
          <SelectField label="Symptom Severity" name="severity" value={formData.severity} onChange={handleChange} options={[
            { value: 'Mild', label: 'Mild / None' },
            { value: 'Moderate', label: 'Moderate' },
            { value: 'Sever', label: 'Severe' },
          ]} />
          <SelectField label="Shortness of Breath?" name="breathShortness" value={formData.breathShortness} onChange={handleChange} options={[
            { value: 'No', label: 'No' },
            { value: 'Yes', label: 'Yes' },
          ]} />
          <SelectField label="Visual Changes / Blurred Vision?" name="visualChanges" value={formData.visualChanges} onChange={handleChange} options={[
            { value: 'No', label: 'No' },
            { value: 'Yes', label: 'Yes' },
          ]} />
          <SelectField label="Frequent Nose Bleeding?" name="noseBleeding" value={formData.noseBleeding} onChange={handleChange} options={[
            { value: 'No', label: 'No' },
            { value: 'Yes', label: 'Yes' },
          ]} />
          <SelectField label="How long since first diagnosed?" name="diagnosedDuration" value={formData.diagnosedDuration} onChange={handleChange} options={[
            { value: '<1 Year', label: 'Less than 1 year / Not diagnosed' },
            { value: '1 - 5 Years', label: '1–5 years' },
            { value: '>5 Years', label: 'More than 5 years' },
          ]} />
        </div>
      )}

      {/* Navigation — completely outside any <form> tag */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        {step > 1 && (
          <button
            type="button"
            className="btn-secondary"
            style={{ flex: 1, padding: '0.9rem', fontSize: '0.95rem' }}
            onClick={() => setStep(s => s - 1)}
          >
            ← Back
          </button>
        )}
        {step < 3 ? (
          <button
            type="button"
            className="btn-primary"
            style={{ flex: 2, padding: '0.9rem', fontSize: '0.95rem' }}
            onClick={() => setStep(s => s + 1)}
          >
            Next Step →
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary"
            style={{ flex: 2, padding: '0.9rem', fontSize: '0.95rem' }}
            onClick={() => onCalculate(formData)}
          >
            🔍 Analyze My Risk
          </button>
        )}
      </div>

      <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '1rem' }}>
        Step {step} of {STEPS.length}
      </p>
    </div>
  );
};

export default AssessmentForm;
