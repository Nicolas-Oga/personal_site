FROM node:12.16.1-alpine3.11

WORKDIR /personal_site

ADD package.json yarn.lock
RUN yarn install --force

ADD . $WORKDIR

CMD yarn build
