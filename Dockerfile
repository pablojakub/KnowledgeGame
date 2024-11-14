FROM node:16.17.1-buster-slim

WORKDIR /usr/src/knowledgeGame

COPY package.json . 
RUN npm install

COPY . .

EXPOSE 3000
CMD ["node", "app.js"]