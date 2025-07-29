# Use the official Node.js runtime as a parent image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force

# Production stage
FROM node:18-alpine AS production

# Create app directory
WORKDIR /app

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S appuser -u 1001

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY . .

# Create uploads directory and set permissions
RUN mkdir -p uploads && chown -R appuser:nodejs uploads

# Remove unnecessary files for production
RUN rm -rf src/ angular.json karma.conf.js tsconfig*.json tslint.json browserslist e2e/

# Change ownership of the app directory
RUN chown -R appuser:nodejs /app

# Switch to non-root user
USER appuser

# Expose the port the app runs on
EXPOSE 8080

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["node", "app.js"]