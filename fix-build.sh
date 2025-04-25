#!/bin/bash

# Fix index.html
sed -i '' 's/%$//g' build/index.html

# Fix manifest.json
sed -i '' 's/%$//g' build/manifest.json

echo "Fixed trailing % characters in build files"

# Check if the files have been fixed
echo "Contents of build/index.html (last 10 characters):"
tail -c 10 build/index.html

echo "Contents of build/manifest.json (last 10 characters):"
tail -c 10 build/manifest.json 