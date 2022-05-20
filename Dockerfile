FROM node:alpine3.15 As development

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:alpine3.15 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --prod

COPY . .
RUN yarn global add typescript
RUN yarn global add ts-node

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
