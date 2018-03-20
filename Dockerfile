FROM node:alpine

RUN apk update && apk add imagemagick

WORKDIR /bot

ADD package.json .
RUN npm install

ADD . /bot

CMD node .