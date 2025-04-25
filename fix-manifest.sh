#!/bin/bash

# Script để tạo lại file manifest.json hoàn toàn mới với ASCII thuần túy

echo "Tạo lại file manifest.json..."

cat > build/manifest.json << 'EOF'
{
  "short_name": "Thon Trang Lien Nhat",
  "name": "Thon Trang Lien Nhat - HTX Nong Nghiep va Dich vu tong hop",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
EOF

echo "File manifest.json đã được tạo lại" 