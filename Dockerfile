# Build Stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production=false
COPY . .
RUN npm run build
EXPOSE 3000
# Start the app in production mode
CMD ["npm", "run", "start"]
