FROM node:16.18.1-bullseye-slim

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci --include=dev

RUN npm run build 

USER node

CMD ["dumb-init", "node", "build/main.js"]
