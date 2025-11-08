#!/bin/sh
mysql -u "${MYSQL_USER}" -p"${MYSQL_PASSWORD}" "${MYSQL_DATABASE}" -e "UPDATE \`users\` SET \`email\`='${ADMIN_EMAIL}' WHERE \`id\` = 1;"
