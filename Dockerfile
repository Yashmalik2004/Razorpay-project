# Use official lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package descriptors first to leverage Docker layer caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (production-only if needed, but devDependencies are required for build tasks)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application files
COPY . .

# Expose server port (default 7002)
EXPOSE 7002

# Start the application
CMD ["npm", "start"]
