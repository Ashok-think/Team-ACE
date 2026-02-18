# PulseGuard AI

A premium, browser-based **hypertension risk assessment tool** powered by a dual k-NN AI algorithm. All processing runs locally — no data ever leaves the device.

**Live Demo:** [https://pulseguard-ai-theta.vercel.app](https://pulseguard-ai-theta.vercel.app)

## Features

| Feature                  | Details                                                                         |
| ------------------------ | ------------------------------------------------------------------------------- |
| **AI Risk Engine**       | Dual k-NN: clinical stage dataset (60%) + hypertension prevalence dataset (40%) |
| **Video Background**     | Full-screen looping medical/tech video via `Hero3D.jsx`                         |
| **Glassmorphism UI**     | Frosted glass cards with backdrop blur throughout                               |
| **Framer Motion**        | Page transitions, hover lifts, animated score count-up                          |
| **3-Step Form**          | Basic Info → Lifestyle → Symptoms with progress indicator                       |
| **Results Dashboard**    | Risk score gauge, stage distribution, predicted BP, neighbor table              |
| **Health Tips**          | Score-based lifestyle recommendations                                           |
| **Medicine Suggestions** | Score-based suggestions with Amazon.in search links                             |
| **PDF Export**           | `jsPDF` + `html2canvas` report download                                         |

## Project Structure

```bash
pulseguard-ai/src/
├── App.jsx                      # Main app shell + routing between views
├── styles/global.css            # Design system (variables, glassmorphism, buttons)
├── components/
│   ├── Hero3D.jsx               # Video background + overlays
│   ├── AssessmentForm.jsx       # 3-step multi-page form
│   ├── AssessmentForm.css       # Form-specific styles
│   ├── RiskDashboard.jsx        # Results page with PDF export
│   └── EcgAnimation.jsx         # ECG line animation component
├── utils/
│   └── riskModel.js             # Dual k-NN algorithm
└── data/
    ├── dataset.json             # Original hypertension dataset (~2000 records)
    └── patient_dataset.json     # Clinical stage dataset
```

## How to Run Locally

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Ashok-think/Team-ACE.git
    cd Team-ACE
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## Example Scenarios

**High Risk Scenario**

- Age: 65+
- BMI: 35
- Salt: 12g
- Smoker: Yes
- Stress: 9
- Sleep: 4hrs
- Symptoms: Severe
- **Result:** High/Critical Risk

**Low Risk Scenario**

- Age: 18–34
- BMI: 22
- Salt: 3g
- Smoker: No
- Stress: 2
- Sleep: 8hrs
- Symptoms: Mild
- **Result:** Low Risk
