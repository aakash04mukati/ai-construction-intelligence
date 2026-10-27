# AI-Powered Multimodal Construction Intelligence Platform

A modern, production-oriented full-stack web application for construction site safety monitoring, structural crack diagnostics, project scheduling, real estate valuation, and weather-aware risk mitigation.

---

## 1. System Overview & Core Modules

The platform accepts and analyzes textual data, construction site photographs, project schedules, and weather feeds using multimodal artificial intelligence:

1. **Dashboard:** Portfolio KPI cards, weekly inspection volume, safety incidents by category, and chronological activity feed.
2. **Site Safety AI (Module 1):** Optical hazard detection for leading-edge fall hazards, missing PPE, improper material stacking, and electrical cords.
3. **Crack Detection & Morphology (Module 2):** Spatial localization with normalized bounding boxes, crack classification (diagonal shear, hairline, settlement), and ASTM repair protocol.
4. **Real Estate Valuation (Module 3):** Cost-approach valuation model with land vs structure separation, value drivers, and market comparables.
5. **Project Planning & WBS (Module 4):** Automated Work Breakdown Structure, phase durations, milestone critical path, material requirements, and risk register.
6. **Daily Site Assistant (Module 5):** Interactive field engineering assistant with step-by-step concrete volume math, modular brickwork estimates, and QC checklists.
7. **Weather-Aware Advisory (Module 6):** Real-time meteorological impact matrix evaluating concrete pouring, crane hoisting, roofing, and deep trenching.
8. **Construction Knowledge Base (Module 7):** Standards-grounded engineering encyclopedia referencing ACI 318, AISC, ASTM, IBC, and OSHA.
9. **Project Management (Module 8):** Full CRUD for construction sites, tasks, subcontractor assignments, and superintendent daily logs.
10. **Reports & Exports (Module 9):** Centralized inspection log with CSV export, printable PDF layouts, and review verification.
11. **Settings & Diagnostics:** Health checks, model status (`gemini-3.8-flash`), measurement unit preferences, and demo reset.

---

## 2. Technology Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, Lucide React, Recharts.
* **Full-Stack Runtime:** Node.js Express server (`server.ts`) with Vite dev middleware on port 3000, persistent local data store, and server-side `@google/genai` SDK integration.
* **Backend Architecture:** Python 3.11+ FastAPI (`backend/app/main.py`), Pydantic v2 schemas, SQLAlchemy ORM, and `google-genai`.
* **AI Model:** Configurable Google Gemini (`gemini-3.8-flash` default).

---

## 3. Quick Start & Execution

### Starting the Live Full-Stack Application (Default Environment)

The application includes an integrated full-stack server running Express and Vite middlewares:

```bash
# Install dependencies
npm install

# Start the full-stack server on port 3000
npm run dev
```

Visit `http://localhost:3000` to interact with the full dashboard and all 11 modules.

---

### Running the Python FastAPI Backend (Optional Standalone)

If running the Python FastAPI stack independently:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Access FastAPI interactive documentation at `http://localhost:8000/docs`.

---

## 4. Environment Variables

Create a `.env` file in the root directory (based on `.env.example`):

```bash
# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash

# Server Configuration
PORT=3000
FRONTEND_ORIGIN=http://localhost:3000

# Database & External Services
DATABASE_URL=sqlite:///./construction.db
WEATHER_PROVIDER=open-meteo
WEATHER_API_KEY=
```

---

## 5. Running Automated Tests

### Backend Tests (pytest)
```bash
pytest backend/tests
```

### TypeScript Validation (lint)
```bash
npm run lint
```

---

## 6. Safety & Appraisals Disclaimer

* **Site Safety:** AI image analysis assists field supervisors but does **not** certify site safety or replace in-person inspections by certified CSP/OSHA safety officers. Critical potential hazards must be inspected in person immediately.
* **Structural Cracks:** Optical image analysis cannot reliably determine crack depth or internal rebar corrosion without physical contact testing or ultrasonic pulse velocity (UPV). A licensed Structural Engineer (SE) must verify structural integrity.
* **Real Estate Valuation:** Valuations are AI-generated indicative feasibility models, not certified commercial real estate appraisals.
