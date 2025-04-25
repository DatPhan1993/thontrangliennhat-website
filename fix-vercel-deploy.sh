#!/bin/bash

echo "Bắt đầu quá trình tối ưu cho Vercel..."

# 1. Đảm bảo manifest.json không có vấn đề
echo "Sao chép manifest.json sang thư mục public/"
cp -f build/manifest.json public/manifest.json

# 2. Cập nhật file vercel.json để đảm bảo static files được phục vụ đúng
cat > vercel.json << 'EOF'
{
  "version": 2,
  "name": "thontrangliennhat-website",
  "framework": "create-react-app",
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "routes": [
    {
      "src": "/manifest.json",
      "dest": "/manifest.json",
      "headers": {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=0, must-revalidate"
      }
    },
    {
      "src": "/static/(.*)",
      "dest": "/static/$1",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.+\\.[a-zA-Z0-9]{5,}\\.(js|css))",
      "headers": { "cache-control": "public, max-age=31536000, immutable" },
      "dest": "/$1"
    },
    {
      "src": "/(.*\\.(json|js|css|png|jpg|jpeg|gif|ico|svg|webp))",
      "dest": "/$1"
    },
    {
      "src": "/api/(.*)",
      "dest": "https://api.thontrangliennhat.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_BASE_URL": "https://api.thontrangliennhat.com",
    "REACT_APP_API_URL": "https://api.thontrangliennhat.com/api"
  },
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "www.thontrangliennhat.com"
        }
      ],
      "destination": "https://thontrangliennhat.com/:path*",
      "permanent": true
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        },
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
EOF

# 3. Cập nhật public/.htaccess nếu cần thiết (cho Apache)
cat > public/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Phục vụ manifest.json trực tiếp
  RewriteRule ^manifest\.json$ - [L]
  
  # Phục vụ các file static trực tiếp
  RewriteRule ^static/(.*)$ static/$1 [L]
  
  # Phục vụ các file asset trực tiếp
  RewriteRule ^(.+\.[a-zA-Z0-9]{5,}\.(js|css))$ $1 [L]
  RewriteRule ^(.*\.(js|css|json|png|jpg|jpeg|gif|ico|svg|webp))$ $1 [L]
  
  # Các request còn lại chuyển về index.html
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Đặt các header bảo mật
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "DENY"
  Header set X-XSS-Protection "1; mode=block"
  Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header set Access-Control-Allow-Origin "*"
</IfModule>
EOF

# 4. Cập nhật build/.htaccess với nội dung tương tự
cp -f public/.htaccess build/.htaccess

echo "Đã hoàn tất tối ưu cho Vercel. Tiến hành commit và deploy..." 