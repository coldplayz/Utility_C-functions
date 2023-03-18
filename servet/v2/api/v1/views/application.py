#!/usr/bin/env python3
''' Application entry point.
'''
from api.v1.views import cus_auth_views, app
from models import populate_db

app.register_blueprint(cus_auth_views)

if __name__ == "__main__":
    app.run(host='0.0.0.0')
