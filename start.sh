#!/bin/sh
set -e

echo "[98STUDIO] Starting Express API Server on port 5000..."
PORT=5000 node server/index.js &
BACKEND_PID=$!

echo "[98STUDIO] Starting Next.js Standalone Frontend on port 3000..."
PORT=3000 HOSTNAME=0.0.0.0 node server.js &
FRONTEND_PID=$!

# Trap signals and shut down child processes gracefully
trap 'kill -TERM $BACKEND_PID $FRONTEND_PID 2>/dev/null; wait $BACKEND_PID $FRONTEND_PID' SIGINT SIGTERM

# Wait for any process to exit
wait -n $BACKEND_PID $FRONTEND_PID
