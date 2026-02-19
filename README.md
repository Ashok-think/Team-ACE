# 🫀 PulseGuard AI

> **AI-Powered Hypertension Risk Assessment — 100% Browser-Based, Zero Data Collection**

PulseGuard AI is a premium, interactive health assessment tool that uses a **dual k-NN (k-Nearest Neighbors) AI algorithm** to predict hypertension risk. All processing runs entirely in the browser — no data is ever sent to a server or stored anywhere.

🔗 **Live Demo:** [https://pulseguard-ai-ashok-kumars-projects-75d36be3.vercel.app](https://pulseguard-ai-ashok-kumars-projects-75d36be3.vercel.app)

---

## ✨ Features

| Feature                           | Details                                                                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 🤖 **Dual AI Risk Engine**        | k-NN algorithm combining a clinical stage dataset (60% weight) and a hypertension prevalence dataset (40% weight) for accurate predictions |
| 🎬 **Cinematic Video Background** | Full-screen looping medical/tech video with dynamic overlays                                                                               |
| 🧊 **Glassmorphism UI**           | Frosted glass cards with backdrop blur, glowing borders, and depth effects                                                                 |
| 🎞️ **Framer Motion Animations**   | Smooth page transitions, hover lifts, staggered reveals, and animated score count-ups                                                      |
| ✨ **Custom Animated SVG Icons**  | Hand-crafted animated icons — heart pulse, stethoscope, DNA helix, lightning bolt, shield, and more                                        |
| 🖱️ **Cursor Trail Effect**        | Glowing particle trail that follows mouse movement across the entire app                                                                   |
| 📊 **3D Tilt Cards**              | Interactive cards that react to mouse position with perspective transforms                                                                 |
| 📋 **3-Step Assessment Form**     | Basic Info → Lifestyle → Symptoms — with animated progress indicator                                                                       |
| 📈 **Results Dashboard**          | Risk score gauge, hypertension stage distribution chart, predicted blood pressure, and similar patient table                               |
| 💡 **Smart Health Tips**          | Score-based personalized lifestyle recommendations                                                                                         |
| 💊 **Medicine Suggestions**       | Score-based medication suggestions with Amazon.in search links                                                                             |
| 📄 **Branded PDF Export**         | Professional PDF report with PulseGuard branding via `jsPDF` + `html2canvas`                                                               |
| 🧬 **Processing Animation**       | DNA helix animation with step-by-step algorithm progress display                                                                           |
| ❓ **FAQ Accordion**              | Interactive FAQ section with smooth expand/collapse animations                                                                             |
| 🔒 **100% Private**               | Zero data collection. No sign-up. No cookies. Everything stays in your browser                                                             |

---

## 🛠️ Tech Stack

| Technology                       | Purpose                                 |
| -------------------------------- | --------------------------------------- |
| **React 19**                     | UI framework                            |
| **Vite 7**                       | Build tool & dev server                 |
| **Framer Motion**                | Animations & page transitions           |
| **jsPDF + html2canvas**          | PDF report generation                   |
| **Three.js / React Three Fiber** | 3D capabilities                         |
| **Vanilla CSS**                  | Custom design system with CSS variables |
| **Vercel**                       | Deployment & hosting                    |

---

## 📁 Project Structure

```
pulseguard-ai/
├── public/
│   ├── favicon.svg              # Custom PulseGuard favicon
│   └── vite.svg
├── src/
│   ├── App.jsx                  # Main app — routing, navbar, hero, footer, FAQ
│   ├── App.css                  # App-level styles
│   ├── index.css                # Root styles
│   ├── main.jsx                 # React entry point
│   ├── assets/
│   │   ├── logo.svg             # PulseGuard logo
│   │   └── background.mp4      # Hero section video background
│   ├── components/
│   │   ├── Hero3D.jsx           # Video background with overlays
│   │   ├── AssessmentForm.jsx   # 3-step multi-page health form
│   │   ├── AssessmentForm.css   # Form-specific styles
│   │   ├── RiskDashboard.jsx    # Results page with charts, tips, medicines & PDF export
│   │   ├── EcgAnimation.jsx     # ECG heartbeat line animation
│   │   └── AnimatedIcons.jsx    # All custom animated SVG icons
│   ├── styles/
│   │   └── global.css           # Design system (CSS variables, glassmorphism, utilities)
│   ├── utils/
│   │   └── riskModel.js         # Dual k-NN AI algorithm
│   └── data/
│       ├── dataset.json         # Hypertension prevalence dataset (~2000 records)
│       └── patient_dataset.json # Clinical stage dataset
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Ashok-think/Team-ACE.git
   cd Team-ACE
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🧠 How the AI Works

PulseGuard AI uses a **dual k-NN (k-Nearest Neighbors)** algorithm that combines two datasets:

1. **Clinical Stage Dataset (60% weight)** — Maps health parameters to hypertension stages (Normal, Elevated, Stage 1, Stage 2, Hypertensive Crisis)
2. **Hypertension Prevalence Dataset (40% weight)** — Contains ~2000 real-world patient records for pattern matching

### Input Parameters

- Age, Gender, BMI
- Daily salt intake (g)
- Smoking status
- Stress level (1–10)
- Sleep hours
- Family history
- Symptom severity (headaches, dizziness, chest pain, etc.)

### Output

- **Risk Score** (0–100)
- **Risk Level** (Low / Moderate / High / Critical)
- **Predicted Blood Pressure** (Systolic/Diastolic)
- **Hypertension Stage Distribution**
- **Similar Patient Profiles** from the dataset

---

## 🧪 Example Scenarios

### 🔴 High Risk

| Parameter           | Value                    |
| ------------------- | ------------------------ |
| Age                 | 65+                      |
| BMI                 | 35                       |
| Salt Intake         | 12g/day                  |
| Smoker              | Yes                      |
| Stress Level        | 9/10                     |
| Sleep               | 4 hrs                    |
| Symptoms            | Severe                   |
| **Expected Result** | **High / Critical Risk** |

### 🟢 Low Risk

| Parameter           | Value        |
| ------------------- | ------------ |
| Age                 | 18–34        |
| BMI                 | 22           |
| Salt Intake         | 3g/day       |
| Smoker              | No           |
| Stress Level        | 2/10         |
| Sleep               | 8 hrs        |
| Symptoms            | Mild         |
| **Expected Result** | **Low Risk** |

---

## 🎨 Design Highlights

- **Dark theme** with carefully curated color palette using CSS custom properties
- **Glassmorphism** effects with backdrop blur and semi-transparent surfaces
- **Micro-animations** on every interaction — hover, click, scroll, and transitions
- **Custom animated SVG icons** — no icon libraries, all hand-crafted with CSS animations
- **Glowing cursor trail** particles that follow mouse movement
- **3D tilt cards** that respond to mouse position with perspective transforms
- **Responsive design** that works on desktop, tablet, and mobile

---

## 👥 Team ACE

Built with ❤️ by **Team ACE**

---

## 📜 License

This project is open-source and free to use for educational and awareness purposes.

---

## ⚠️ Disclaimer

PulseGuard AI is a **health awareness tool only**. It is **not** a medical device and should **not** be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
