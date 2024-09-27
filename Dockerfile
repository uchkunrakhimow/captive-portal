FROM node:22

ENV TZ=Asia/Tashkent
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ >/etc/timezone

WORKDIR /usr/src/radius-server
COPY . .
COPY ./radius/sql /etc/freeradius/mods-available/sql
COPY ./radius/default /etc/freeradius/sites-available/default
RUN apt update && apt install iputils-ping -y
RUN npm install -g npm@latest && npm install -g pm2@latest

CMD ["pm2-runtime", "./dist/server.js", "--no-autorestart"]
