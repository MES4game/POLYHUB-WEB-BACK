# Stage 1: Build Express app
FROM node:24-alpine AS builder
WORKDIR /app
COPY . .
RUN ls -al \
    && npm install -g npm@latest \
    && npm ci \
    && npm run build:run

# Stage 2: Final image
FROM node:24-alpine

VOLUME /mounted

ENV DB_NAME=db \
    DB_USER=user \
    DB_PASS=secret

COPY --from=docker_config_folder entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /app
RUN rm -rf ./*
COPY --from=builder /app/build .
RUN ls -al \
    && ls -al /

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh", "3000"]
