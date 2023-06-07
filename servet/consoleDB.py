#!/usr/bin/env python3
''' Initialization code for Python3 interpreter.

    This enables you to quickly do dropping and creating of database tables.

    To use this, launch the Python interpreter as follows:
        `python3 -i ./consoleDB.py`
    then the following imports will be automatically made,
    and you can start using the imported objects.
'''
from api.v1.views import db, populate_db
from api.v1.views.application import app

# On importing the above, the database tables are automatically created.
''' To drop the existing tables:
    >>> with app.app_context():
    ...     db.drop_all()
    ... 
'''

''' To recreate the tables:
    >>> with app.app_context():
    ...     db.create_all()
    ... 
'''

''' To populate the database tables with predefined dummy data:
    >>> populate_db()

    The source code for the populate_db function can be found in `models/__init__.py`
'''
