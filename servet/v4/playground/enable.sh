#!/usr/bin/env bash
# Enable http proxying

val=$(grep "http_proxy=" f)

sed -i "s/$val/export http_proxy=10.199.212.2:8080/" f
