# Using official Node.js image
FROM node:18-alpine

# Setting up working directory
WORKDIR /app

# Copying package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copying source code
COPY . .

# Exposing backend port
EXPOSE 5000

# Starting the application
CMD ["node", "index.js"]
