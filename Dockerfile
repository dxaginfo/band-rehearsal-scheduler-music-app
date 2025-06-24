# Base Node image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install production dependencies for the backend
FROM base AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production

# Build the backend
FROM backend-deps AS backend-builder
COPY backend ./

# Install production dependencies for the frontend
FROM base AS frontend-deps
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production

# Build the frontend
FROM frontend-deps AS frontend-builder
COPY frontend ./
RUN npm run build

# Production image
FROM base
WORKDIR /app

# Copy backend dependencies and files
COPY --from=backend-deps /app/backend/node_modules /app/backend/node_modules
COPY --from=backend-builder /app/backend /app/backend

# Copy built frontend
COPY --from=frontend-builder /app/frontend/build /app/backend/public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Run the app
CMD ["node", "backend/src/server.js"]