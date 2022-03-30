FROM node:16 as base


WORKDIR /usr/app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
COPY .env.docker .env
COPY ormconfig.docker.json ormconfig.json
RUN yarn build

EXPOSE 8080
CMD [ "node", "./dist/src/app.js" ]
