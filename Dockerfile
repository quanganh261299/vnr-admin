# Sử dụng image node chính thức với phiên bản LTS
FROM node:16-alpine AS build

# Đặt thư mục làm việc là /app
WORKDIR /app

# Sao chép file package.json và package-lock.json vào thư mục /app
COPY package.json package-lock.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng
RUN npm run build

# Sử dụng image Nginx chính thức để phục vụ ứng dụng React
FROM nginx:stable-alpine

# Sao chép các file build của React vào thư mục html của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Mở cổng 80 cho container
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]
