#!/usr/bin/env bash
# DOC: Script to download youtube videos.


echo -n "Enter the video url: "
read -r url

echo -n "Enter the resolution. E.g. 360, 480, 1080: "
read -r size

# Original: yt-dlp -f 'bv*[height=360]+ba' https://youtu.be/lQNEW76KdYg -o '%(id)s.%(ext)s'

if [[ "$size" -eq 360 ]]
then
	yt-dlp -f 'bv*[height=360]+ba' "$url" -o '%(title)s.%(ext)s'
elif [[ "$size" -eq 480 ]]
then
	yt-dlp -f 'bv*[height=480]+ba' "$url" -o '
%(title)s.%(ext)s'
elif [[ "$size" -eq 216 ]]
then
	yt-dlp -f 'bv*[height=216]+ba' "$url" -o '
%(title)s.%(ext)s'
elif [[ "$size" -eq 240 ]]
then
	yt-dlp -f 'bv*[height=240]+ba' "$url" -o '
%(title)s.%(ext)s'
else
	echo "Enter 360 or 480 as size"
fi
