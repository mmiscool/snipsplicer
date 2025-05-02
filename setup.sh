#!/bin/bash

set -e

# Step 1: Initialize NPM if not already done
if [ ! -f package.json ]; then
  echo "Initializing NPM project..."
  npm init -y > /dev/null
fi

# Step 2: Install Parcel if not installed
if ! npm ls parcel > /dev/null 2>&1; then
  echo "Installing Parcel..."
  npm install --save-dev parcel > /dev/null
fi

# Step 3: Create src directory and sample markdown
mkdir -p src

cat > src/prompt.md <<EOF
# Sample Prompt

Respond only in JSON format. Do not explain your answer.
EOF

# Step 4: Create index.js that uses bundle-text
cat > src/index.js <<EOF
import system_prompt from "bundle-text:./prompt.md";

export { system_prompt };
EOF

# Step 5: Create .parcelrc (optional)
cat > .parcelrc <<EOF
{
  "extends": "@parcel/config-default"
}
EOF

# Step 6: Update package.json
echo "Updating package.json..."

node <<EOF
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.type = "module";
pkg.main = "dist/index.js";
pkg.exports = { "import": "./dist/index.js" };
pkg.scripts = pkg.scripts || {};
pkg.scripts.build = "parcel build src/index.js --dist-dir dist --no-source-maps";
pkg.files = ["dist"];

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
EOF

# Step 7: Build the bundle
echo "Running initial build..."
npm run build

echo ""
echo "✅ Markdown bundle is ready. dist/index.js exports your prompt as a string."
