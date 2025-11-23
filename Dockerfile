# Build stage
FROM node:lts-alpine AS builder

# Upgrade system packages to fix vulnerabilities
RUN apk -U upgrade

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:lts-alpine AS production

# Upgrade system packages to fix vulnerabilities
RUN apk -U upgrade

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built assets from builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/application.yaml ./

# Create uploads directory
RUN mkdir -p uploads

# Expose application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]

