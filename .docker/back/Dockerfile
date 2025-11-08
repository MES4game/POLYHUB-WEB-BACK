# Stage 1: Build Express app
FROM node:24.11.0-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci \
    && npm run build -- --lint-skip --build-outDir=/build \
    && cp package*.json /build/ \
    && cd /build \
    && npm ci --omit=dev --omit=optional \
    && npm prune --production \
    && rm -f package*.json

# Stage 2: Serve with Node.js
FROM node:24.11.0-alpine

EXPOSE 3000
VOLUME /mounted

ENV HOST=localhost \
    PORT=3000 \
    NODE_ENV=production \
    SMTP_HOST=127.0.0.1 \
    SMTP_PORT=25 \
    SMTP_USER=admin \
    DB_HOST=127.0.0.1 \
    DB_PORT=3306 \
    DB_NAME=db \
    DB_USER=user

WORKDIR /app
COPY --chmod=555 --from=builder /build .

CMD ["node", "index.js"]
