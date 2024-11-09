FROM node:22

# Set working directory
WORKDIR /app
ENV PORT 8080
ENV MODEL_PATH=https://storage.googleapis.com/asclepius-models-submissionmlgc-fatahillah/model/model.json
# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Start command
CMD ["npm", "run", "start"]
