.PHONY: help dev dev-web dev-server dev-prism-mock dev-prism-proxy build build-web build-server lint lint-web install install-web install-server install-typespec

help:
	@printf "Available targets:\n"
	@printf "  make dev              Start server and web together\n"
	@printf "  make dev-web          Start Next.js frontend\n"
	@printf "  make dev-web-start    Start built Next.js frontend\n"
	@printf "  make dev-server       Start NestJS backend in watch mode\n"
	@printf "  make dev-prism-mock   Start Prism mock server\n"
	@printf "  make dev-prism-proxy  Start Prism proxy server\n"
	@printf "  make build            Build web and server\n"
	@printf "  make build-web        Build frontend only\n"
	@printf "  make build-server     Build backend only\n"
	@printf "  make lint             Run frontend lint\n"
	@printf "  make install          Install dependencies for all packages\n"

dev:
	@trap 'kill 0' INT TERM EXIT; \
	npm run start:dev --prefix server & \
	npm run dev --prefix web & \
	wait

dev-web:
	@npm run dev --prefix web

web-start:
	@npm run start --prefix web

dev-server:
	@npm run start:dev --prefix server

dev-prism-mock:
	@npm run api:mock --prefix web

dev-prism-proxy:
	@npm run api:proxy --prefix web

build: build-server build-web

build-web:
	@npm run build --prefix web

build-server:
	@npm run build --prefix server

lint: lint-web

lint-web:
	@npm run lint --prefix web

install: install-typespec install-server install-web

install-web:
	@npm install --prefix web

install-server:
	@npm install --prefix server

install-typespec:
	@npm install --prefix typespec
