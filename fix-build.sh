#!/bin/bash

# Sửa lỗi ký tự % ở cuối file
sed -i '' 's/%$//g' build/index.html
sed -i '' 's/%$//g' build/manifest.json

# Tạo bản sao của file
cp build/index.html build/index.html.bak

# Xử lý file index.html để xóa các script và stylesheet trùng lặp
# Chỉ giữ lại một script và một stylesheet duy nhất
cat build/index.html.bak | 
  perl -pe 's/<script defer="defer" src="static\/js\/[^"]+"><\/script>//g' | 
  perl -pe 's/<link href="static\/css\/[^"]+" rel="stylesheet">//g' > build/index.html

echo "Fixed files in build folder"

# Kiểm tra nội dung file index.html có các script và stylesheet
echo "Checking for duplicate scripts and stylesheets:"
grep -c "<script" build/index.html
grep -c "<link.*stylesheet" build/index.html

# Kiểm tra xem còn ký tự % ở cuối các file không
echo "Checking for trailing % character:"
tail -c 10 build/index.html 
tail -c 10 build/manifest.json 