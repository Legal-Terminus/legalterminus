# Build Frontend
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy Frontend files
COPY Frontend/package*.json ./
RUN npm ci

# Copy Frontend source
COPY Frontend/src ./src
COPY Frontend/public ./public
COPY Frontend/index.html ./
COPY Frontend/vite.config.js ./
COPY Frontend/tailwind.config.js ./
COPY Frontend/postcss.config.js ./
# Accept VITE_ vars as build args (injected by CI pipeline or apphosting.yaml secrets)
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
# Build React app
RUN npm run build

# Build Backend + serve Frontend
FROM node:22-alpine

WORKDIR /app

# Copy Backend files
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy Backend source
COPY backend/src ./src

# Copy built Frontend to Backend public folder (for static serving)
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose port
EXPOSE 5000

# Start Express server
CMD ["node", "src/server.js"]
