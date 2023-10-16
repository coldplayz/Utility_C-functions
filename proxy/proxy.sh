#!/usr/bin/env bash
# Comment and uncomment https_proxy

if [[ "$1" == '-h' ]]
then
  echo 'Usage: proxy OPTION'
  echo -e '\nOptions:'
  echo -e '\t-c\tcomment out https_proxy in $HOME/.bashrc'
  echo -e '\t-u\tuncomment https_proxy in $HOME/.bashrc'
fi

if [[ "$1" == '-c' ]]
then
  # comment out https_proxy in $HOME/.bashrc
  sed -i -E 's/(^export https_proxy=.*)/# \1/' ~/.bashrc
fi

if [[ "$1" == '-u' ]]
then
  # uncomment https_proxy in $HOME/.bashrc
  sed -i -E 's/^# (export https_proxy=.*)/\1/' ~/.bashrc
fi

source /home/userland/.bashrc
