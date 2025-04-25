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

# Fix lỗi % ở cuối file - thích ứng cho macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' 's/%$//g' build/index.html
else
  # Linux
  sed -i 's/%$//g' build/index.html
fi

# Xóa manifest.json hiện tại và tạo mới
rm -f build/manifest.json

# Tạo manifest siêu tối giản
echo '{
  "name": "Thon Trang", 
  "short_name": "Thon Trang",
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
}' > build/manifest.json

# Xóa ký tự % ở cuối nếu có - thích ứng cho macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' 's/%$//g' build/manifest.json
else
  # Linux
  sed -i 's/%$//g' build/manifest.json
fi

echo "Build hoàn tất. Kiểm tra nội dung:"
ls -la build/
grep -c "<script" build/index.html
grep -c "<link.*stylesheet" build/index.html 