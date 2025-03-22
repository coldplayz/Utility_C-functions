#!/usr/bin/env bash
# DOC: Script to download youtube videos.


echo -n "Enter the video url: "
read -r url

out="$(node ~/utilities/youtube/format-parser.js $url)"

if [[ $? -eq 1 ]] # error status code from node process
then
  exit 1
fi

echo -n -e "$out"

echo

echo -n "Enter the resolution. E.g. 216, 240, 360, 480, 1080: "
read -r size

# Original: yt-dlp -f 'bv*[height=360]+ba' https://youtu.be/lQNEW76KdYg -o '%(id)s.%(ext)s'

#if [[ "$size" -eq 360 ]]
#then
#	yt-dlp -f 'bv*[height=360]+ba' --cookies '/home/userland/yt/youtube-cookies.txt' "$url" -o '%(title)s.%(ext)s'
#elif [[ "$size" -eq 480 ]]
#then
#	yt-dlp -f 'bv*[height=480]+ba' --cookies '/home/userland/yt/youtube-cookies.txt' "$url" -o '
#%(title)s.%(ext)s'
#elif [[ "$size" -eq 216 ]]
#then
#	yt-dlp -f 'bv*[height=216]+ba' --cookies '/home/userland/yt/youtube-cookies.txt' "$url" -o '
#%(title)s.%(ext)s'
#elif [[ "$size" -eq 240 ]]
#then
#	yt-dlp -f 'bv*[height=240]+ba' --cookies '/home/userland/yt/youtube-cookies.txt' "$url" -o '
#%(title)s.%(ext)s'
#else
#	yt-dlp -f "bv*[height=$size]+ba" --cookies '/home/userland/yt/youtube-cookies.txt' "$url" -o '%(title)s.%(ext)s'
#fi

timestamp="$(date +%Y-%m-%dT%H-%M-%S)"
logfile="$timestamp".log
echo Log file: "$logfile"

yt-dlp -f "bv*[height=$size]+ba" --cookies '/home/userland/yt/youtube-cookies.txt' "$url" -o '%(title)s.%(ext)s' >> "$logfile" && echo $timestamp DONE! &

# echo $timestamp DONE!
# tail -f <log file path> # stream logs real-time
