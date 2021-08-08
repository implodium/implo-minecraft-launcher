FROM node:16
WORKDIR /app/
RUN apt update && apt install -y wine64
ENV TARGET "$TARGET"
CMD npm run docker:package:$TARGET
