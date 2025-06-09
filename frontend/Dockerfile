FROM node:alpine as build

WORKDIR /frontend

COPY . .

RUN npm install
RUN npm run build

FROM nginx:latest

COPY --from=build /frontend/dist/frontend/browser /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80