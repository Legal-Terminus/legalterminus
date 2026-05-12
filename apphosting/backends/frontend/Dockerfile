# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY Frontend/package*.json ./

RUN npm ci

COPY Frontend/ .

RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve to run the production build
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
