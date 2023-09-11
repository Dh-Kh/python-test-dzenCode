FROM node:18.16.1

WORKDIR /frontend

COPY . .

RUN npm install -C /frontend

EXPOSE 3000

CMD ["npm", "start"]