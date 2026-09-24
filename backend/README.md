# SahaySign backend

This FastAPI service provides a simple text-to-sign and sign-generation API for the prototype. The current implementation uses a controlled sign vocabulary and can later be replaced with a dataset-backed or model-backed sign engine.

## Run
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

For Windows PowerShell:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
