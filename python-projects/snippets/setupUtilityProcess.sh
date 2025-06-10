#!/usr/bin/env bash

# Activate virtual env (venv) for python execution
# shellcheck disable=SC1091
source demo-pubsub/bin/activate

# Start gcloud PubSub emulator
# shellcheck disable=SC2091
$(gcloud beta emulators pubsub env-init)

# Create topics
python publisher.py demo-project create process-mobile-airtime
python publisher.py demo-project create process-mobile-internet
python publisher.py demo-project create process-electricity
python publisher.py demo-project create process-cable
python publisher.py demo-project create process-bet

# BASE_URL='https://admin-94o4cdal.uc.gateway.dev'
BASE_URL='http://localhost:8000/v2'
echo baseUrl: "$BASE_URL"

# Create push subscription to topics
python subscriber.py demo-project create-push process-mobile-airtime airtimeSub "$BASE_URL"/bills/mobile/processAirtime
python subscriber.py demo-project create-push process-mobile-internet internetSub "$BASE_URL"/bills/mobile/processInternet
python subscriber.py demo-project create-push process-electricity electricitySub "$BASE_URL"/bills/electricity/process
python subscriber.py demo-project create-push process-cable cableSub "$BASE_URL"/bills/cableTv/process
python subscriber.py demo-project create-push process-bet betSub "$BASE_URL"/bills/bet/process

# Next: see useEmulator.sh for message publishing
# E.g. python3 publisher.py demo-project publish-with-custom-attributes process-mobile-airtime