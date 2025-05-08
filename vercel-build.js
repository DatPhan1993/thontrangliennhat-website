// Vercel build script (Node.js version)
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Log the current directory and files
console.log('Current directory:', process.cwd());
console.log('Files in directory:', fs.readdirSync(process.cwd()));

try {
  // Run the craco build command
  console.log('Running craco build...');
  execSync('npx craco build', { stdio: 'inherit' });
  
  // Check if build directory exists
  const buildDir = path.join(process.cwd(), 'build');
  if (!fs.existsSync(buildDir)) {
    console.log('Creating build directory...');
    fs.mkdirSync(buildDir, { recursive: true });
  }
  
  // Create/update manifest.json
  const manifestPath = path.join(buildDir, 'manifest.json');
  const manifest = {
    "short_name": "Thon Trang",
    "name": "Thon Trang Lien Nhat",
    "icons": [
      {
        "src": "favicon.ico",
        "sizes": "64x64",
        "type": "image/x-icon"
      },
      {
        "src": "favicon-16x16.png",
        "type": "image/png",
        "sizes": "16x16"
      },
      {
        "src": "favicon-32x32.png",
        "type": "image/png",
        "sizes": "32x32"
      },
      {
        "src": "apple-touch-icon.png",
        "type": "image/png",
        "sizes": "192x192"
      }
    ],
    "start_url": ".",
    "scope": ".",
    "display": "standalone",
    "theme_color": "#4caf50",
    "background_color": "#ffffff",
    "description": "HTX Nong Nghiep va Dich vu tong hop"
  };
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('Created manifest.json');
  
  // Fix index.html paths from absolute to relative
  const indexPath = path.join(buildDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    indexContent = indexContent.replace(/href="\//g, 'href="./');
    indexContent = indexContent.replace(/src="\//g, 'src="./');
    fs.writeFileSync(indexPath, indexContent);
    console.log('Fixed paths in index.html');
  }
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 