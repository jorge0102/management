FROM node:18

WORKDIR /usr/src/app/backend

COPY package*.json ./

RUN npm install

COPY . /usr/src/app/backend 

RUN chmod +x createEnv.sh

RUN ./createEnv.sh

RUN npm add @prisma/client fastify fastify-zod zod zod-to-json-schema fastify-jwt fastify-swagger

EXPOSE 3000

CMD npm run create-db && npm run seed && npm run dev
