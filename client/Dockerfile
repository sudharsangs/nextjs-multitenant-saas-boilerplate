FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./


COPY . .

RUN npm install --frozen-lockfile
RUN npm run build

EXPOSE 3000
CMD [ "node", "build" ]