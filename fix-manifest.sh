#!/bin/bash

# Script để tạo lại file manifest.json hoàn toàn mới với ASCII thuần túy

echo "Tao lai file manifest.json toi gian..."

cat > build/manifest.json << 'EOF'
{
  "short_name": "Thon Trang",
  "name": "Thon Trang",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
EOF

# Xóa ký tự % nếu có - thích ứng cho macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' 's/%$//g' build/manifest.json
else
  # Linux
  sed -i 's/%$//g' build/manifest.json
fi

echo "File manifest.json da duoc tao moi toi gian" 