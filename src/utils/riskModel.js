import patientDataset from '../data/patient_dataset.json';
import originalDataset from '../data/dataset.json';

// ─── Encoders for Clinical Dataset (patient_dataset.json) ────────────────────
const encodeGender = (v) => (v === 'Male' ? 1 : 0);
const encodeAge = (v) => {
  if (v === '18-34') return 0.2;
  if (v === '35-50') return 0.45;
  if (v === '51-64') return 0.7;
  if (v === '65+') return 1.0;
  return 0.5;
};
const encodeBool = (v) => (v === 'Yes' || v === true || v === 1) ? 1 : 0;
const encodeSeverity = (v) => {
  if (v === 'Mild') return 0.25;
  if (v === 'Moderate') return 0.5;
  if (v === 'Sever') return 0.75;
  return 0.25;
};
const encodeDuration = (v) => {
  if (v === '<1 Year') return 0.2;
  if (v === '1 - 5 Years') return 0.6;
  if (v === '>5 Years') return 1.0;
  return 0.2;
};

// ─── Encoders for Original Dataset (dataset.json) ────────────────────────────
const normalize = (val, min, max) => Math.min(1, Math.max(0, (val - min) / (max - min)));
const RANGES = {
  Age:            { min: 18, max: 90 },
  Salt_Intake:    { min: 0,  max: 15 },
  Stress_Score:   { min: 0,  max: 10 },
  Sleep_Duration: { min: 0,  max: 12 },
  BMI:            { min: 10, max: 50 },
  Exercise_Level: { Low: 0, Moderate: 0.5, High: 1 },
};

// ─── Stage helpers ────────────────────────────────────────────────────────────
const stageToRiskLevel = (stage) => {
  if (!stage) return 'Low';
  const s = stage.toUpperCase();
  if (s.includes('CRISIS'))  return 'Critical';
  if (s.includes('STAGE-2')) return 'High';
  if (s.includes('STAGE-1')) return 'Moderate';
  return 'Low';
};

const stageToBP = (stage) => {
  if (!stage) return 'Normal (<110/80)';
  const s = stage.toUpperCase();
  if (s.includes('CRISIS'))  return 'Crisis (130+/100+)';
  if (s.includes('STAGE-2')) return 'Stage 2 (121-130/91-100)';
  if (s.includes('STAGE-1')) return 'Stage 1 (111-120/81-90)';
  return 'Normal (<110/80)';
};

// ─── Distance helpers ─────────────────────────────────────────────────────────
const euclidean = (a, b) => {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += (a[i] - b[i]) ** 2;
  return Math.sqrt(sum);
};

// ─── Encode a clinical record ─────────────────────────────────────────────────
const encodeClinicalRecord = (r) => [
  encodeGender(r.Gender),
  encodeAge(r.Age),
  encodeBool(r.History),
  encodeBool(r.Patient),
  encodeBool(r.TakeMedication),
  encodeSeverity(r.Severity),
  encodeBool(r.BreathShortness),
  encodeBool(r.VisualChanges),
  encodeBool(r.NoseBleeding),
  encodeDuration(r.Whendiagnoused),
];

// ─── Encode user input for clinical lookup ────────────────────────────────────
const encodeClinicalUser = (u) => [
  encodeGender(u.gender),
  encodeAge(u.ageGroup),
  encodeBool(u.familyHistory),
  encodeBool(u.isPatient),
  encodeBool(u.takesMedication),
  encodeSeverity(u.severity),
  encodeBool(u.breathShortness),
  encodeBool(u.visualChanges),
  encodeBool(u.noseBleeding),
  encodeDuration(u.diagnosedDuration),
];

// ─── Encode user input for original dataset lookup ────────────────────────────
const encodeOriginalUser = (u) => {
  const ageMidpoints = { '18-34': 26, '35-50': 42, '51-64': 57, '65+': 72 };
  const age = ageMidpoints[u.ageGroup] || 40;
  return {
    Age:            normalize(age, RANGES.Age.min, RANGES.Age.max),
    BMI:            normalize(u.bmi ?? 25, RANGES.BMI.min, RANGES.BMI.max),
    Salt_Intake:    normalize(u.saltIntake ?? 5, RANGES.Salt_Intake.min, RANGES.Salt_Intake.max),
    Stress_Score:   normalize(u.stressLevel ?? 5, RANGES.Stress_Score.min, RANGES.Stress_Score.max),
    Sleep_Duration: normalize(u.sleepDuration ?? 7, RANGES.Sleep_Duration.min, RANGES.Sleep_Duration.max),
    Smoking_Status: u.isSmoker === 'Yes' ? 1 : 0,
    Exercise_Level: RANGES.Exercise_Level[u.exerciseLevel] ?? 0.5,
  };
};

// ─── Main export ──────────────────────────────────────────────────────────────
export const calculateRisk = (userInput) => {
  const k = 15;

  // ── 1. Clinical dataset k-NN (stage & BP prediction) ──
  const clinicalVec = encodeClinicalUser(userInput);
  const clinicalSorted = patientDataset
    .map(r => ({ ...r, _dist: euclidean(clinicalVec, encodeClinicalRecord(r)) }))
    .sort((a, b) => a._dist - b._dist);
  const clinicalNeighbors = clinicalSorted.slice(0, k);

  const stageCounts = { Low: 0, Moderate: 0, High: 0, Critical: 0 };
  clinicalNeighbors.forEach(n => {
    stageCounts[stageToRiskLevel(n.Stages)]++;
  });

  // ── 2. Original dataset k-NN (hypertension prevalence) ──
  const origUser = encodeOriginalUser(userInput);
  const origSorted = originalDataset
    .map(r => {
      const rv = {
        Age:            normalize(r.Age, RANGES.Age.min, RANGES.Age.max),
        BMI:            normalize(r.BMI, RANGES.BMI.min, RANGES.BMI.max),
        Salt_Intake:    normalize(r.Salt_Intake, RANGES.Salt_Intake.min, RANGES.Salt_Intake.max),
        Stress_Score:   normalize(r.Stress_Score, RANGES.Stress_Score.min, RANGES.Stress_Score.max),
        Sleep_Duration: normalize(r.Sleep_Duration, RANGES.Sleep_Duration.min, RANGES.Sleep_Duration.max),
        Smoking_Status: r.Smoking_Status === 'Smoker' ? 1 : 0,
        Exercise_Level: RANGES.Exercise_Level[r.Exercise_Level] ?? 0.5,
      };
      const vec = Object.values(rv);
      const uVec = Object.values(origUser);
      return { ...r, _dist: euclidean(vec, uVec) };
    })
    .sort((a, b) => a._dist - b._dist);
  const origNeighbors = origSorted.slice(0, k);
  const origHypertensiveCount = origNeighbors.filter(n => n.Has_Hypertension === 'Yes').length;
  const origRiskRatio = origHypertensiveCount / k; // 0–1

  // ── 3. Combine both signals ──
  // Clinical dataset gives stage distribution; original gives raw prevalence
  const clinicalSevereRatio = (stageCounts.High + stageCounts.Critical) / k;
  const combinedScore = Math.round(((clinicalSevereRatio * 0.6) + (origRiskRatio * 0.4)) * 100);

  // Dominant stage from clinical dataset
  const dominant = Object.entries(stageCounts).sort((a, b) => b[1] - a[1])[0][0];
  const predictedBP = stageToBP(clinicalNeighbors[0]?.Stages);

  return {
    riskLevel: dominant,
    score: combinedScore,
    predictedBP,
    stageCounts,
    neighbors: clinicalNeighbors.slice(0, 3).map(n => ({
      Age:      n.Age,
      Gender:   n.Gender,
      Stages:   n.Stages,
      Systolic: n.Systolic,
      Diastolic: n.Diastolic,
    })),
  };
};
