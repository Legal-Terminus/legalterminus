FROM node:22-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/src ./src
COPY backend/uploads ./uploads

EXPOSE 8080

CMD ["node", "src/server.js"]
