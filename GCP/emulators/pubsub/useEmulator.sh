#!/usr/bin/env bash

# Start pubsub emulator locally to listen on all interfaces
gcloud beta emulators pubsub start --project=demo-project --host-port=0.0.0.0:8085

# Automatically set environment variables for the emulator running on SAME machine
$(gcloud beta emulators pubsub env-init)




# USING THE EMULATOR

# Get the Pub/Sub Python samples from GitHub by cloning the full Python repository (https://github.com/googleapis/python-pubsub).
# In your cloned repository, navigate to the samples/snippets directory. You complete the rest of these steps in this directory.
# From within the samples/snippets directory, install the dependencies [in a venv] you need to run the example:
# pip install -r requirements.txt

# Create a topic
python publisher.py PUBSUB_PROJECT_ID create TOPIC_ID
# E.g. python publisher.py demo-project create refresh-referral-reward

# Create a pull subscription
# python subscriber.py PUBSUB_PROJECT_ID create TOPIC_ID SUBSCRIPTION_ID

# Create a push sub
# python subscriber.py PUBSUB_PROJECT_ID create-push TOPIC_ID SUBSCRIPTION_ID PUSH_ENDPOINT
# E.g. python subscriber.py demo-project create-push refresh-referral-reward pushSub1 http://localhost:8000/v2/referrals/rewarded

# Publish messages to the topic
# python publisher.py PUBSUB_PROJECT_ID publish TOPIC_ID
# python publisher.py PUBSUB_PROJECT_ID publish-with-custom-attributes TOPIC_ID
# E.g. python3 publisher.py demo-project publish-with-custom-attributes refresh-referral-reward

# Read messages from pull sub
# python subscriber.py PUBSUB_PROJECT_ID receive SUBSCRIPTION_ID