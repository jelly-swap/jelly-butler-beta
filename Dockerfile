FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY yarn.lock ./

RUN yarn install 

# Bundle app source
COPY . .

ENV PORT=9003

EXPOSE 9003

# Stage 2 - Run the application
CMD [ "yarn", "start" ]