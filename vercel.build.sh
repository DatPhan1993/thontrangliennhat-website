#!/bin/bash

# Tạo thư mục build nếu chưa tồn tại
mkdir -p build

# Cố gắng build React app
npm run build:react

# Kiểm tra kết quả build
if [ $? -ne 0 ]; then
  echo "Build thất bại, sử dụng phương án dự phòng"
  
  # Sao chép các file cần thiết
  cp public/direct-index.html build/index.html
  cp public/test.html build/test.html
  
  # Sao chép các asset
  mkdir -p build/static
  cp -r public/* build/
fi

# Xóa manifest.json hiện tại và tạo mới
rm -f build/manifest.json

# Tạo manifest đầy đủ
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

# Sửa đường dẫn trong index.html từ tuyệt đối sang tương đối
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' 's|href="/|href="./|g' build/index.html
  sed -i '' 's|src="/|src="./|g' build/index.html
  # Xóa ký tự % nếu có
  cat build/index.html | tr -d '%' > build/temp.html && mv build/temp.html build/index.html
  # Xóa ký tự % ở manifest nếu có
  sed -i '' 's/%$//g' build/manifest.json
else
  # Linux
  sed -i 's|href="/|href="./|g' build/index.html
  sed -i 's|src="/|src="./|g' build/index.html
  # Xóa ký tự % nếu có
  cat build/index.html | tr -d '%' > build/temp.html && mv build/temp.html build/index.html
  # Xóa ký tự % ở manifest nếu có
  sed -i 's/%$//g' build/manifest.json
fi

echo "Build hoàn tất với manifest đầy đủ và đường dẫn tương đối. Kiểm tra nội dung:"
ls -la build/
grep -c "<script" build/index.html
grep -c "<link.*stylesheet" build/index.html 