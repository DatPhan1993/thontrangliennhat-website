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

# Xóa manifest.json hiện tại và chạy fix-manifest.sh
rm -f build/manifest.json
chmod +x ./fix-manifest.sh
./fix-manifest.sh

# Thêm một bước nữa để đảm bảo manifest.json không có ký tự đặc biệt
# Kiểm tra manifest.json có ký tự đặc biệt không
if grep -q "[^[:ascii:]]" build/manifest.json; then
  echo "Phát hiện ký tự không phải ASCII, tạo lại file manifest.json"
  
  # Tạo manifest siêu tối giản trong trường hợp còn lỗi
  echo '{
  "name": "Thon Trang", 
  "short_name": "Thon Trang",
  "start_url": ".",
  "display": "standalone"
}' > build/manifest.json
fi

echo "Build hoàn tất. Kiểm tra nội dung:"
ls -la build/
grep -c "<script" build/index.html
grep -c "<link.*stylesheet" build/index.html 