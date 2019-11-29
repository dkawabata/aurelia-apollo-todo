FROM node:10.17.0-alpine

WORKDIR /app

COPY ./package.json .
COPY ./yarn.lock .

RUN apk update && \
  yarn global add aurelia-cli && \
  yarn
