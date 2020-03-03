FROM node:lts

WORKDIR /personal_site

ADD package.json yarn.lock ./
RUN yarn install --force

ADD . $WORKDIR

CMD yarn build
