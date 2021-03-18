FROM node:14-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json /app
COPY . /app/.

RUN npm install --production
CMD npm start
