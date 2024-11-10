FROM node:18.16

WORKDIR /app

COPY package*.json ./

RUN npm install

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