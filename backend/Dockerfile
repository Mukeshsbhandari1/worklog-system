FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Generate Prisma client and seed database
RUN npm run prisma:generate

# Expose port
EXPOSE 5000

# Run migrations and seed, then start server
CMD npm run seed && npm run dev
