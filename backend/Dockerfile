FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Expose port
EXPOSE 3000
CMD ["node", "server.js"]
# Set environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 3000
