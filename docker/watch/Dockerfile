FROM node:16.6.1-alpine3.14

WORKDIR /app/

ENTRYPOINT ["npm", "run", "docker:watch"]

COPY package*.json .

COPY electron/package*.json electron/

COPY angular/package*.json angular/

RUN npm install && (cd electron && npm install) && (cd angular && npm install)

COPY . .
