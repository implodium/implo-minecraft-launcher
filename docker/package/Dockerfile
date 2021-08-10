FROM node:16

RUN apt update && apt install -y wine64

WORKDIR /app/

ENV TARGET "$TARGET"

COPY package*.json .

COPY angular/package*.json angular/

COPY electron/package*.json electron/

RUN npm install && (cd angular && npm install) && (cd electron && npm install)

COPY . .

ENTRYPOINT ["sh", "-c", "npm run docker:package:$TARGET"]
