#!/usr/bin/env bash
# Setup script for the project - Latent

# =======MongoDB=======

if [ ! "$(command -v mongod)" ]
then
  # no MongoDB; install it
  # install gnupg if not available
  sudo apt-get install gnupg

  # Import the MongoDB GPG Key
  curl -fsSL https://pgp.mongodb.com/server-4.2.asc | \
     sudo gpg -o /usr/share/keyrings/mongodb-server-4.2.gpg \
     --dearmor

  # Add the MongoDB repository to the sources list
  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-4.2.gpg ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list

  # Update system packages
  sudo apt-get update

  # Install MongoDB
  sudo apt-get install -y mongodb-org=4.2.18 mongodb-org-server=4.2.18 mongodb-org-shell=4.2.18 mongodb-org-mongos=4.2.18 mongodb-org-tools=4.2.18

  # prevent unintended upgrades
  echo "mongodb-org hold" | sudo dpkg --set-selections
  echo "mongodb-org-server hold" | sudo dpkg --set-selections
  echo "mongodb-org-shell hold" | sudo dpkg --set-selections
  echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
  echo "mongodb-org-tools hold" | sudo dpkg --set-selections

  # Start MongoDB service
  # sudo service mongod start

  # Uninstall ---------------------
  # sudo service mongod stop
  # sudo apt-get purge mongodb-org*
  # sudo rm -r /var/log/mongodb
  # sudo rm -r /var/lib/mongodb
fi
