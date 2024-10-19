# Используем официальный образ FreeRADIUS как базовый
FROM freeradius/freeradius-server:latest

ENV TZ=Asia/Tashkent
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ >/etc/timezone

# Устанавливаем необходимые пакеты
RUN apt-get update && apt-get install -y \
    vim \
    nano \
    net-tools \
    iputils-ping

# Копируем файлы конфигурации FreeRADIUS
COPY . .
COPY ./clients.conf /etc/freeradius/clients.conf
COPY ./sql /etc/freeradius/mods-available/sql
COPY ./default /etc/freeradius/sites-enabled/default 
RUN ln -s /etc/freeradius/mods-available/sql /etc/freeradius/mods-enabled/sql
#RUN mysql -u radius -p rootpasswd < /etc/freeradius/mods-config/sql/main/mysql/schema.sql

# Открываем порты 1812 и 1813 для RADIUS-сервиса (UDP и TCP)
EXPOSE 1812/udp 1812/tcp
EXPOSE 1813/udp 1813/tcp

# Команда для запуска FreeRADIUS
CMD ["freeradius", "-f", "-X"]
