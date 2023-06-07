#!/usr/bin/env bash
# Manage ssh into sandbox servers.

usage='Manage ssh into alx sandbox servers.
Usage:
	sandbox -h: display about and usage, and exit.
	sandbox -d: display details about the server currently aliased, and exit.
	sandbox -u: use the server currently aliased.
	sandbox -c: change aliased server.'

if [ "$1" = '-h' ]
then
	# Print help message
	echo -e "$usage"
elif [ "$1" = '-d' ]
then
	if [ -f ~/Utility_C-functions/sandbox/sandbox.about ]
	then
		# Display contents of file if exists
		cat ~/Utility_C-functions/sandbox/sandbox.about
	fi
elif [ "$1" = '-u' ]
then
	# Run the command
	sandbox2
elif [ "$1" = '-c' ]
then
	echo -n "Enter username: "
	read -r username

	echo -n "Enter host: "
	read -r host

	echo -n "Enter password: "
	read -r password

	echo -n "Describe the sandbox server: "
	read -r description
	echo "$description" > ~/Utility_C-functions/sandbox/sandbox.about

	# Join all read strings together
	val="sshpass -p $password ssh -o strictHostKeyChecking=no ${username}@${host}"

	# Modify /data/data/com.termux/files/usr/etc/bash.bashrc with new sandbox1 alias
	sb1=$(sudo grep  "sandbox1=" /etc/bash.bashrc)
	# echo "$sb1"

	if [ -n "$sb1" ]
	then
		sudo sed -i "s/$sb1/sandbox1='""${val}'/" /etc/bash.bashrc
	else
		echo -e "\n""sandbox1='""${val}'" | sudo tee -a /etc/bash.bashrc > /dev/null
	fi

	# Source the bashrc file
	srcbashrc
fi
