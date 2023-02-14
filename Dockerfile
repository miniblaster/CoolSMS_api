FROM node:16.15-alpine

VOLUME ["/api"]
WORKDIR /api

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
RUN yarn

COPY ./tsconfig.json ./tsconfig.json
RUN yarn build

ENTRYPOINT ["yarn", "start:prod"]
