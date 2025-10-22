FROM mysql:8.0

VOLUME /var/lib/mysql

ENV MYSQL_RANDOM_ROOT_PASSWORD=yes \
    MYSQL_DATABASE=db \ 
    MYSQL_USER=user \ 
    MYSQL_PASSWORD=secret \
    ADMIN_EMAIL=admin@example.com

COPY db/init/ /docker-entrypoint-initdb.d/
RUN ls -al /docker-entrypoint-initdb.d/

EXPOSE 3306
