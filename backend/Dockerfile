# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Install dependencies and prisma CLI
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci
RUN npx prisma generate

# Copy source code
COPY . .

# Production Stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install OpenSSL for Prisma in the runner
RUN apk add --no-cache openssl

ENV NODE_ENV=production

# Copy only production essentials from the builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma.config.ts ./

# Only needed if you want docker default port mapping, Cloud Run defines PORT dynamically
EXPOSE 8080

CMD ["npm", "start"]
