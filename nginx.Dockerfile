# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY ./vue/package*.json ./
RUN npm install
COPY ./vue .
RUN npx vite build

# production stage
FROM nginx:stable-alpine as production-stage
WORKDIR /app
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# COPY ./certbot/www/ /var/www/certbot/

COPY --from=build-stage /app/dist /app/
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
