#!/usr/bin/env bash
# Script for dumping mariadb-MySQL database


echo -n "Enter user name: "
read -r user

echo -n "Enter database name: "
read -r db

echo -n "Enter output file name (*.sql format): "
read -r out

echo -n "Enter password for $user: "

mysqldump -u "$user" -p "$db" > "$out"
