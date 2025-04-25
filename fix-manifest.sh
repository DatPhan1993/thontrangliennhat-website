#!/bin/bash

# Script để tạo lại file manifest.json với đầy đủ thông tin

echo "Tao lai file manifest.json day du..."

cat > build/manifest.json << 'EOF'
{
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

# Sửa đường dẫn trong index.html từ tuyệt đối sang tương đối
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' 's|href="/|href="./|g' build/index.html
  sed -i '' 's|src="/|src="./|g' build/index.html
  # Xóa ký tự % nếu có
  cat build/index.html | tr -d '%' > build/temp.html && mv build/temp.html build/index.html
else
  # Linux
  sed -i 's|href="/|href="./|g' build/index.html
  sed -i 's|src="/|src="./|g' build/index.html
  # Xóa ký tự % nếu có
  cat build/index.html | tr -d '%' > build/temp.html && mv build/temp.html build/index.html
fi

echo "File manifest.json da duoc tao day du va index.html da duoc sua duong dan tuong doi" 