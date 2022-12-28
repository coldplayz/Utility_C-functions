#!/usr/bin/env bash

echo -n "Enter destination directory (relative to ~/storage/shared/Documents/) - optional ===> "
read dest

echo

if [[ -n "$dest" ]]
then
	if [[ "$dest" = 'p' ]]
	then
		# [p]revious directory
		dest=$(cat ~/Utility_C-functions/todocs/last.dest)
		echo "Destination directory ==> $dest"
	else
		# New destination directory; save path
		echo "$dest" > ~/Utility_C-functions/todocs/last.dest
	fi
fi

echo

echo -n "Enter source file(s) - required ===> "
read src
if [[ -z "$src" ]]
then
	echo ">>>>Please enter a source file<<<<"
	exit 1
fi

if [[ -n "$dest" ]]
then
	cp -r $src ~/storage/shared/Documents/"$dest"
else
	cp -r $src ~/storage/shared/Documents/
fi
