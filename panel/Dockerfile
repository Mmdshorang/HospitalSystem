# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@latest

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies ignoring peer deps
RUN pnpm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM nginx:alpine AS production

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
