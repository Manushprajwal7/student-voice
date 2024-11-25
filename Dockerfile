# Base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only necessary files for dependency installation
COPY package*.json ./

# Install dependencies (including devDependencies for build stage)
RUN npm install

# Copy all necessary files for the build
COPY . .

# Build the application
RUN npm run build

# Use a production image for serving the app
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy necessary files from the builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install only production dependencies
RUN npm install --production

# Expose the application port
EXPOSE 3000

# Use environment variables at runtime
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start"]
