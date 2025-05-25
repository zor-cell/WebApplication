FROM node:alpine

WORKDIR /frontend

COPY ../frontend .

RUN npm install -g @angular/cli
RUN npm install

EXPOSE 4200

CMD ["npm", "start"]