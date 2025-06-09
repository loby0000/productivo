# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Set NODE_ENV to development during build
ENV NODE_ENV=development

COPY package*.json ./

# Install all dependencies including dev dependencies
RUN npm ci && \
    # Verify vite is available
    npm ls vite

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
