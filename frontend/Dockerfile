FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy configuration files
COPY vite.config.ts tsconfig.json tsconfig.node.json tailwind.config.ts postcss.config.js ./

# Copy source code
COPY src ./src
COPY index.html ./

# Expose port
EXPOSE 3000

# Start development server
CMD npm run dev -- --host
