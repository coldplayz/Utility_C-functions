#!/usr/bin/env python3
''' Application entry point.
'''
from flask import Flask

app = Flask(__name__)

from api.v1.views import cus_auth_views
import models

app.register_blueprint(cus_auth_views)

if __name__ == "__main__":
    app.run(host='0.0.0.0')
