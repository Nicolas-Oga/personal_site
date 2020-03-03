FROM node:12.16.1-alpine3.11

WORKDIR /personal_site

COPY package.json yarn.lock ./
RUN yarn install --force

COPY . ./

CMD yarn build
