# Build stage
FROM node:22-alpine AS builder

# Build under /app/Portal (NOT /app) and place the repo-root `shared/` dir as a
# sibling at /app/shared. The Portal imports the framework-agnostic workflow
# modules via the `@shared/*` alias, which resolves to `../shared` in both
# tsconfig.app.json and vite.config.ts. Flattening Portal/src to /app would shift
# that `../shared` by one level and `shared/` wouldn't be in the image at all →
# "Cannot find module '@shared/workflows/*'" during the in-container build.
WORKDIR /app/Portal

# Copy Portal dependencies
COPY Portal/package*.json ./

# Install dependencies
RUN npm ci

# Copy the shared workflow modules (resolved as ../shared from Portal/).
COPY shared /app/shared

# Copy Portal source and config files
COPY Portal/src ./src
COPY Portal/public ./public
COPY Portal/index.html ./
COPY Portal/vite.config.ts ./
COPY Portal/tsconfig.json ./
COPY Portal/tsconfig.app.json ./
COPY Portal/tsconfig.node.json ./
COPY Portal/postcss.config.js ./
COPY Portal/tailwind.config.js ./

# Build Portal with build args
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_API_BASE_URL
ARG VITE_PORTAL_STANDALONE

ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_PORTAL_STANDALONE=$VITE_PORTAL_STANDALONE
ENV NODE_ENV=production

RUN echo "Building Portal with Vite..." && echo "VITE_PORTAL_STANDALONE=$VITE_PORTAL_STANDALONE" && npm run build && echo "✅ Build completed" && ls -la dist/

# Runtime stage
FROM node:22-alpine

WORKDIR /app

# Create package.json for runtime
RUN cat > package.json << 'EOF'
{
  "type": "module",
  "dependencies": {
    "express": "^4.19.2"
  }
}
EOF

# Install express
RUN npm install --omit=dev

# Copy built Portal from builder (build now runs in /app/Portal)
COPY --from=builder /app/Portal/dist ./dist
COPY Portal/server.js ./server.js

EXPOSE 8080

CMD ["node", "server.js"]
