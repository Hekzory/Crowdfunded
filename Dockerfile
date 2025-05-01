FROM denoland/deno:alpine-2.3.1 AS base

WORKDIR /app

ENV DENO_NO_UPDATE_CHECK=1

# Copy dependency files
COPY package.json deno.json deno.lock ./

# Copy source files
COPY . .

# Build the Next.js application
RUN deno install
RUN deno run build

# Runtime image
FROM denoland/deno:alpine-2.3.1

WORKDIR /app

# Copy built app from previous stage
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/next.config.ts ./
COPY --from=base /app/deno.json ./
COPY --from=base /app/deno.lock ./

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Start the app
CMD ["deno", "run", "--allow-net", "--allow-read", "start"]
