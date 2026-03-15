#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

echo "=== Safety² Video Generator ==="
echo ""

# Node.js prüfen
if ! command -v node &> /dev/null; then
  echo "Node.js ist nicht installiert. Bitte installieren: https://nodejs.org"
  exit 1
fi

# Python3 prüfen
if ! command -v python3 &> /dev/null; then
  echo "Python3 ist nicht installiert. Bitte installieren."
  exit 1
fi

# FFmpeg prüfen
if ! command -v ffmpeg &> /dev/null; then
  echo "FFmpeg ist nicht installiert. Bitte installieren: sudo apt install ffmpeg"
  exit 1
fi

# Angular Dependencies installieren
echo "[1/3] npm install ..."
npm install --silent

# Python venv + Flask installieren
echo "[2/3] Python Backend einrichten ..."
if [ ! -d "backend/.venv" ]; then
  python3 -m venv backend/.venv
fi
backend/.venv/bin/pip install -q flask flask-cors

# Backend starten (im Hintergrund)
echo "[3/3] Starte Backend (Port 5000) + Frontend (Port 4200) ..."
echo ""

backend/.venv/bin/python backend/app.py &
BACKEND_PID=$!

# Bei Beenden beide Prozesse stoppen
cleanup() {
  echo ""
  echo "Beende Backend und Frontend ..."
  kill $BACKEND_PID 2>/dev/null
  exit 0
}
trap cleanup SIGINT SIGTERM

# Angular starten
ng serve --open

cleanup
