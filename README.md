# SahaySign

SahaySign is a functional prototype for generating sign-language sequences from government announcements and presenting them through a realistic female 3D avatar.

## Problem
Generative Sign-Language Avatar for Government Announcements.

## Features
- Text input for government announcements
- Speech input using browser Web Speech API
- Semantic processing and concept detection
- Controlled sign vocabulary and gloss generation
- 3D female avatar with deterministic motion mapping
- Accessibility-focused layout and readable UI
- History stored in localStorage
- Developer test mode for validation

## Technology
- React
- Vite
- Tailwind CSS
- Three.js
- React Three Fiber
- FastAPI
- Python
- Web Speech API

## Prototype note
This prototype uses a controlled sign vocabulary and a modular rule-based sign generation engine. It is intentionally honest about the current limitations and is designed for future integration with verified ISL datasets and trained sign motion models.

## Future work
- Verified ISL datasets
- Expert validation of motion sequences
- Larger sign vocabulary
- Real sign-language motion generation model
- Better facial expressions and hand fidelity
- Regional language support
- Deployment and governance workflows

## Run frontend
From the frontend folder:

```bash
npm install
npm run dev -- --host 0.0.0.0
```

## Run backend
From the backend folder:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

On Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
