#!/bin/bash
FROM node:16.17.1-buster-slim

# Create and set the correct working directory
WORKDIR /usr/src/knowledgeGame

# Copy package.json and install dependencies
COPY package.json . 
RUN npm install

# Copy all other files
COPY . .

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]