# Build Stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production=false
COPY . .
RUN npm run build

# Runtime Stage
FROM node:18-alpine
WORKDIR /app

# Only copy production dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY .env .env

EXPOSE 3000

# Start the app in production mode
CMD ["npm", "run", "start"]
