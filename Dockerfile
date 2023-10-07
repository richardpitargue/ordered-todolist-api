FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
COPY .env.production ./.env

EXPOSE 5000

CMD [ "node", "app.js" ]
