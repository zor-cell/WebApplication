FROM node:alpine as build

WORKDIR /frontend

# copy dependencies
COPY package.json package-lock.json ./
RUN npm install

# copy source code
COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /frontend/dist/frontend/browser /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80