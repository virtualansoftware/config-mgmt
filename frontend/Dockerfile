FROM node:16.13.2-alpine AS build

WORKDIR /opt/app-root/src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]