FROM mysql:9.5.0

VOLUME /var/lib/mysql

ENV MYSQL_DATABASE=db \ 
    MYSQL_USER=user \ 
    ADMIN_EMAIL=admin@example.com

COPY --chmod=775 db/init/ /docker-entrypoint-initdb.d/
