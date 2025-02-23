# Frontend Docker file
FROM node:18-alpine AS builder

WORKDIR /app

# Installation of dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copying source code
COPY . .

# Building frontend
RUN npm run build

# Serving using Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
