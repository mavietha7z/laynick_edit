### Cập nhật và nâng cấp ubuntu

```
apt update
```

```
apt upgrade
```

### Tải và nâng cấp các package

<sub>Tải nginx và kiểm tra</sub>

```
apt install nginx
```

```
systemctl status nginx
```

<sub>Tải nodejs 18</sub>

```
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
```

<sub>Cấu hình và tải mongodb</sub>

```
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
```

`Output: OK`

```
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
```

```
apt update
```

```
apt install mongodb-org
```

```
systemctl start mongod.service
```

<sub>Tải pm2</sub>

```
npm i pm2 -g
```

### Tạo thư mục admin và cấp quyền

```
mkdir -p /var/www/admin/html
```

```
chown -R $USER:$USER /var/www/admin/html
```

```
chmod -R 755 /var/www/admin
```

### Tạo thư mục back và cấp quyền

```
mkdir -p /var/www/back/html
```

```
chown -R $USER:$USER /var/www/back/html
```

```
chmod -R 755 /var/www/back
```

### Cấu hình nginx app

```
vi /etc/nginx/sites-enabled/back
```

```
server {
        listen 80;
        listen [::]:80;
        server_name domain;

        root /var/www/back/html;
        index index.js index.html index.htm index.nginx-debian.html;

        location / {
                proxy_pass http://localhost:8080;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
}
```

```
vi /etc/nginx/sites-enabled/admin
```

```
server {
        listen 80;
        listen [::]:80;
        server_name domain;

        root /var/www/admin/html;
        index index.html index.htm index.nginx-debian.html;

        location / {
                try_files $uri /index.html;
        }
}
```

```
nginx -t
```

```
service nginx reload
```

### Sửa code trong source admin

<sub>Sửa url api</sub>

```
/src/utils/index.js
```

### Sửa code trong source back

<sub>Sửa đừng dấn src trong config & url api check login</sub>

```
/src/config/view.js
```

```
/src/config/index.js
```

<sub>Sửa SSL HTTP => HTTPS và sửa đường dẫn lưu ảnh</sub>

```
/src/controllers/image/upload.js
```

<sub>Sửa domain views</sub>

```
/src/views
```

<sub>Sửa url get images</sub>

```
/src/index.js
```

### Cấu hình mongodb

<sub>Tạo database</sub>

```
mongo
```

```
use tronang
```

## Upload code và chạy dự án
