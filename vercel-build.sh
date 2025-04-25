#!/bin/bash
echo "VERCEL_ENV: $VERCEL_ENV"

# Build the frontend React app
npm install
npm run build

# The build directory is automatically used as the deployment
