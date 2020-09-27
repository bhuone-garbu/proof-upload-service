FROM node:14-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
COPY dist /app/dist

RUN npm install --production
CMD npm start
