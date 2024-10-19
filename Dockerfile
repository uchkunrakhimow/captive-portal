FROM node:20-alpine

ENV TZ=Asia/Tashkent
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ >/etc/timezone

WORKDIR /usr/src/radius
COPY . .
COPY ./radius/sql /etc/freeradius/mods-available/sql
COPY ./radius/default /etc/freeradius/sites-available/default

RUN npm install -g pm2@latest

CMD ["pm2-runtime", "./dist/index.js", "--no-autorestart"]
