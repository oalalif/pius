FROM node:20

WORKDIR /app

COPY package*.json ./

RUN apt-get update && \
    apt-get install -y python3 build-essential && \
    npm install && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY . .

EXPOSE 8080

CMD ["npm", "start"]