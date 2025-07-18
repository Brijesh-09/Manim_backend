FROM node:20-alpine

WORKDIR  /primary-backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 8000

CMD ["node" ,"index.js"]