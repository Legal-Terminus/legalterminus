# Node 26, pinned by digest so a re-tagged upstream image cannot change what
# ships. Keep in step with `node-version` in .github/workflows — CI must build
# and test on the version the containers run.
FROM node:26-alpine@sha256:143494b1da2945f061539253adc65e4f1569ddf07da2d384c022c791a9d90a4a

WORKDIR /app

# Mirror the repo layout (backend/ next to shared/) so the backend's relative
# imports into the framework-agnostic workflow modules — e.g.
# `../../../shared/workflows/compileDefinition.js` from backend/src/controllers —
# resolve identically in the container as they do locally. Flattening backend/src
# to /app/src would shift those paths by one level → ERR_MODULE_NOT_FOUND on
# startup, and the container would never bind PORT (Cloud Run health check fails).

# Install backend deps at /app (not /app/backend) so node_modules sits at
# /app/node_modules — reachable by Node's upward resolution from BOTH
# /app/backend/src/* and /app/shared/* (the shared modules import `xstate`).
COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/src ./backend/src
COPY backend/uploads ./backend/uploads
COPY shared ./shared

EXPOSE 8080

CMD ["node", "backend/src/server.js"]
