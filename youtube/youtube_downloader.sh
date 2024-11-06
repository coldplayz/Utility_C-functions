#!/usr/bin/env bash
# DOC: Script to download youtube videos.


echo -n "Enter the video url: "
read -r url

# format_table="$(yt-dlp --list-formats --cookies '/home/userland/yt/youtube-cookies.txt' $url)"
# echo -n "$format_table"
echo -n "File info:"
echo -n "$(node /home/userland/utilities/youtube/format-parser.js $url)"

echo -n "Enter the resolution. E.g. 216, 240, 360, 480, 1080: "
read -r size

# Original: yt-dlp -f 'bv*[height=360]+ba' https://youtu.be/lQNEW76KdYg -o '%(id)s.%(ext)s'

if [[ "$size" -eq 360 ]]
then
	yt-dlp -f 'bv*[height=360]+ba' --cookies '/home/userland/yt/youtube-cookies.txt' "$url" -o '%(title)s.%(ext)s'
elif [[ "$size" -eq 480 ]]
then
	yt-dlp -f 'bv*[height=480]+ba' --cookies '/home/userland/yt/youtube-cookies.txt' "$url" -o '
%(title)s.%(ext)s'
elif [[ "$size" -eq 216 ]]
then
	yt-dlp -f 'bv*[height=216]+ba' --cookies '/home/userland/yt/youtube-cookies.txt' "$url" -o '
%(title)s.%(ext)s'
elif [[ "$size" -eq 240 ]]
then
	yt-dlp -f 'bv*[height=240]+ba' --cookies '/home/userland/yt/youtube-cookies.txt' "$url" -o '
%(title)s.%(ext)s'
else
	yt-dlp -f "bv*[height=$size]+ba" --cookies '/home/userland/yt/youtube-cookies.txt' "$url" -o '%(title)s.%(ext)s'
fi
