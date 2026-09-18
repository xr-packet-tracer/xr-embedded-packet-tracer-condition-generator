FROM node:12.14.1

WORKDIR /app

COPY . /app

RUN npm install

CMD ["npm","start"]

EXPOSE 3000