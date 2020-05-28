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

# FROM nginx
# MAINTAINER vue-demo
# COPY dist/  /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf

# FROM node
# MAINTAINER vue-ssr
# # 将根目录下的文件都copy到container（运行此镜像的容器）文件系统的app文件夹下
# # ADD . /app/
# # cd到app文件夹下
# # WORKDIR /app
# # COPY package*.json ./
# RUN yarn install
# RUN yarn build:mac
# COPY dist/  /usr/share/node
# COPY server/  /usr/share/server
# EXPOSE 3000
# CMD yarn start

# FROM node as build-stage
# WORKDIR /app
# COPY package*.json ./
# RUN yarn install
# COPY . .
# RUN yarn build:mac

# FROM node as production-stage
# MAINTAINER vue-ssr
# COPY --from=build-stage /app/dist /usr/share/node
# COPY server/ /usr/share/node/server
# COPY package.json /usr/share/node
# WORKDIR /usr/share/node
# EXPOSE 3000
# CMD ["yarn", "start"]


FROM node
MAINTAINER vue-ssr
COPY dist/  /usr/share/node
COPY server/ /usr/share/node/server
COPY package.json /usr/share/node
WORKDIR /usr/share/node
EXPOSE 3000
CMD ["yarn", "start"]