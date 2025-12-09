FROM node:20-alpine

WORKDIR /index

COPY . .

RUN npm install && npm run build

EXPOSE 4000

CMD [ "npm", "run", "dev"] 