# SoulHug Agent Dockerfile
# Purpose: Test with isolated NPM packages to identify if local workspace is causing issues

FROM node:20-alpine

# Install pnpm via npm (more reliable than corepack)
RUN npm install -g pnpm@9

WORKDIR /app

# Copy only package files first (for better caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ui/package.json ./packages/ui/

# Install dependencies from NPM registry only
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the frontend application
RUN pnpm build

# Expose ports
EXPOSE 5800 80

# Environment variables
ENV NODE_ENV=production
ENV PORT=5800
ENV HTTP_PORT=80

# Start the server using tsx (since server is TypeScript)
CMD ["npx", "tsx", "src/server.ts"]
