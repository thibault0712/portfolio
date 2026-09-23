# ============================================
# Stage 1: Dependencies Installation Stage
# ============================================

# IMPORTANT: Docker Hardened Image (DHI) Version Maintenance
# This Dockerfile uses dhi.io/node. Regularly validate and update to the latest DHI versions in the catalog for security and compatibility.

FROM dhi.io/node:26-alpine3.24-dev AS dependencies

# Set working directory
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Install project dependencies with frozen lockfile for reproducible builds
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/usr/local/share/.cache/yarn \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    if [ -f package-lock.json ]; then \
    npm ci --no-audit --no-fund; \
    elif [ -f yarn.lock ]; then \
    corepack enable yarn && yarn install --frozen-lockfile --production=false; \
    elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm install --frozen-lockfile; \
    else \
    echo "No lockfile found." && exit 1; \
    fi

# ============================================
# Stage 2: Build Next.js application in standalone mode
# ============================================

FROM dhi.io/node:26-alpine3.24-dev AS builder

# Set working directory
WORKDIR /app

ARG WORDPRESS_URL
ENV WORDPRESS_URL=$WORDPRESS_URL

# Copy project dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source code
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
# If you want to speed up Docker rebuilds, you can cache the build artifacts
# by adding: --mount=type=cache,target=/app/.next/cache
# This caches the .next/cache directory across builds, but it also prevents
# .next/cache/fetch-cache from being included in the final image, meaning
# cached fetch responses from the build won't be available at runtime.
RUN if [ -f package-lock.json ]; then \
    npm run build; \
    elif [ -f yarn.lock ]; then \
    corepack enable yarn && yarn build; \
    elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm build; \
    else \
    echo "No lockfile found." && exit 1; \
    fi

# ============================================
# Stage 3: Run Next.js application
# ============================================

FROM dhi.io/node:26-alpine3.24 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Copy production assets using --chown directly
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Aligned EXPOSE port with ENV PORT (8080)
EXPOSE 8080

CMD ["node", "server.js"]