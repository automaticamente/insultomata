FROM node:alpine

RUN apk update && apk add imagemagick
RUN npm install pm2@latest -g

WORKDIR /bot

ADD package.json .
RUN npm install

ADD . /bot

CMD pm2 start ecosystem.config.js && pm2 logs