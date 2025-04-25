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

# Fix lỗi % ở cuối file
sed -i 's/%$//g' build/index.html
sed -i 's/%$//g' build/manifest.json

# Đảm bảo manifest.json không có ký tự đặc biệt
cat > build/manifest.json << EOL
{
  "short_name": "Thôn Trang Liên Nhất",
  "name": "Thôn Trang Liên Nhất - HTX Nông Nghiệp và Dịch vụ tổng hợp",
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
EOL

echo "Build hoàn tất. Kiểm tra nội dung:"
ls -la build/
grep -c "<script" build/index.html
grep -c "<link.*stylesheet" build/index.html 