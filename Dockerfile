FROM node:12.16.1-alpine

RUN mkdir -p /home/node/app/node_modules && mkdir -p /home/node/app/logs && chown -R node:node /home/node/app 
RUN apk update && apk add yarn python g++ make && rm -rf /var/cache/apk/*

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN yarn install 

COPY --chown=node:node . .

EXPOSE 9003

CMD [ "yarn", "start" ]