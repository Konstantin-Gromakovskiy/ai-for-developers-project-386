FROM node:24-bookworm-slim AS web-deps

WORKDIR /app/web
COPY web/package.json web/package-lock.json ./
RUN npm ci

FROM node:24-bookworm-slim AS server-deps

WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci

FROM node:24-bookworm-slim AS builder

WORKDIR /app
COPY --from=web-deps /app/web/node_modules ./web/node_modules
COPY --from=server-deps /app/server/node_modules ./server/node_modules
COPY web ./web
COPY server ./server
COPY docker ./docker
COPY Makefile ./Makefile

ENV NEXT_PUBLIC_API_BASE_URL=

WORKDIR /app/server
RUN npm run build

WORKDIR /app/web
RUN npm run build

FROM node:24-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

EXPOSE 3000

COPY --from=builder /app/web ./web
COPY --from=builder /app/server ./server
COPY --from=builder /app/docker ./docker

CMD ["node", "./docker/start-container.mjs"]
