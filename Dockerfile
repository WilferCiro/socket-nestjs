FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build

FROM node:alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only-prod

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]