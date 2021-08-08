FROM node:16

WORKDIR /app/

ENTRYPOINT ["npm", "run", "electron:watch"]

COPY package*.json .

COPY electron/package*.json electron/

RUN npm install && cd electron && npm install

COPY . /app/
