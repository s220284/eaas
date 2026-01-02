#!/bin/bash
# Start the MASH AI frontend development server

set -e

cd "$(dirname "$0")/../frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start the development server
echo "Starting MASH AI frontend on http://localhost:3000"
npm start
