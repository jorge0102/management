FROM node:18

WORKDIR /usr/src/app/frontend

COPY package*.json ./

RUN npm install

COPY . /usr/src/app/frontend

RUN chmod +x createEnv.sh

RUN ./createEnv.sh

EXPOSE 3000

CMD npm run dev
