#!/usr/bin/env python3
''' Application entry point.
'''
from api.v1.views import create_app

app = create_app()

if __name__ == "__main__":
    app.run(host='0.0.0.0')
