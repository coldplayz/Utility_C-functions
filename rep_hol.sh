#!/usr/bin/env bash

file="$1"

if [[ -z "$file" ]]
then
	echo "Supply a valid file"
	exit 1
fi

sed -i 's/holberton/school/' "$file"
