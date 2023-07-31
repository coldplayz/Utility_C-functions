#!/usr/bin/env bash
# Rename a file, removing whitespaces.

files=$(ls)

IFS=$'\n'

for f in $files
do
	if [[ "$f" == *" "* ]]
	then
		# echo $f
		# space present
		new_name=$(echo "$f" | tr ' ' '_')
		mv *"$f"* "$new_name"
	fi
done
