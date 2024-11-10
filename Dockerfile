FROM node:18-slim

# Install required dependencies for tfjs-node
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0
ENV MODEL_PATH=https://storage.googleapis.com/asclepius-models-submissionmlgc-fatahillah/model/model.json

# Expose port
EXPOSE 8080

# Start command
CMD ["npm", "start"]