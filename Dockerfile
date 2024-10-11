FROM node:22.8.0-alpine

RUN apk add --no-cache bash && \
    npm i -g @nestjs/cli typescript ts-node

COPY package*.json /tmp/app/
WORKDIR /tmp/app
RUN npm install

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app

WORKDIR /usr/src/app

CMD ["npm", "run", "start"]