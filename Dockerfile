# FROM node:lts-alpine as build-stage
# WORKDIR /app
# COPY package*.json ./
# RUN yarn install
# COPY . .
# RUN yarn build

# FROM nginx as production-stage
# MAINTAINER vue-demo
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf
# RUN echo 'echo init ok!!'

FROM nginx
MAINTAINER vue-demo
COPY dist/  /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# FROM node
# MAINTAINER vue-node
# WORKDIR /node
# COPY package*.json ./
# RUN yarn install
# COPY . .
# EXPOSE 3000
# CMD yarn start