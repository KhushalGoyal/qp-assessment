# Use Node 16 alpine as parent image
FROM node:18-alpine

# Change the working directory on the Docker image to /app
WORKDIR /app

# Copy package.json and package-lock.json to the /app directory
COPY package.json package-lock.json ./

# Install, Testing and Building dependencies
RUN npm install

# Copy the rest of project files into this image
COPY . .

RUN npm run build 
RUN npm run test

COPY .env ./build

# Expose application port
EXPOSE 3000

# Adding pm2 to run
RUN npm install pm2 -g

# Start the application
CMD cd ./build;pm2-runtime index.js