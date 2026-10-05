FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat curl

# 1. Install all dependencies for build
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2. Build Next.js standalone application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# 3. Production Runner image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy Next.js standalone output and assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/server ./server

# Install full production dependencies (express, mysql2, cors, aws-sdk, etc.)
COPY package*.json ./
RUN npm ci --omit=dev

# Startup script
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 3000

CMD ["./start.sh"]
