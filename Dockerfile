FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV KAFKA_BROKER1=$KAFKA_BROKER1
ENV KAFKA_BROKER2=$KAFKA_BROKER2
ENV KAFKA_BROKER3=$KAFKA_BROKER3

CMD [ "node", "app.js" ]
