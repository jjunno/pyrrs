# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:21-alpine

ENV TZ="Europe/Helsinki"

WORKDIR /app

COPY ./nodejs_public_rest/package*.json ./

RUN npm install

COPY ./nodejs_public_rest .

EXPOSE 3000

CMD [ "node", "server.js" ]
