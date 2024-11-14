#!/bin/bash
FROM node:16.17.1-alpine

# Create and set the correct working directory
WORKDIR /usr/src/knowledgeGame

# Copy package.json and install dependencies
COPY package.json . 

# Clear any pre-existing package-lock.json
RUN rm -f package-lock.json

RUN npm install --verbose

# Copy all other files
COPY . .

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]