FROM node:16

WORKDIR /app/

ENTRYPOINT ["npm", "run", "angular:watch"]

COPY package*.json .

COPY angular/package*.json angular/

RUN npm install && cd angular && npm install

COPY . /app/
