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

# Cấp quyền và chạy script tạo lại manifest.json
chmod +x ./fix-manifest.sh
./fix-manifest.sh

echo "Build hoàn tất. Kiểm tra nội dung:"
ls -la build/
grep -c "<script" build/index.html
grep -c "<link.*stylesheet" build/index.html 