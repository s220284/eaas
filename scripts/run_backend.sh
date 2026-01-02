#!/bin/bash
# Start the MASH AI backend server

set -e

cd "$(dirname "$0")/.."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Set environment variables if not set
export DATABASE_URL=${DATABASE_URL:-"sqlite:///./mash_demo.db"}
export DEBUG=${DEBUG:-"true"}

# Run the server
echo "Starting MASH AI backend on http://localhost:8000"
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
