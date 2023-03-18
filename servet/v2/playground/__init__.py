#!/usr/bin/env python3
''' Initialization for the `models` package.'''
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from os import getenv

from models.country import Countries
from models.customer import Customers
from models.location import Locations
from models.review import Reviews
from models.service_provider_service import ServiceProviderServices
from models.service_category import ServiceCategories
from models.service_provider import ServiceProviders

# Create the SQLAlchemy extension
db = SQLAlchemy()

# Create the app
app = Flask(__name__)

user = getenv('SERVET_USER')
pwd = getenv('SERVET_PWD')
host = getenv('SERVET_HOST')
port = getenv('SERVET_PORT')
dbase = getenv('SERVET_DB')

# Set necessary app configurations
app.config["SQLALCHEMY_DATABASE_URI"] =\
        f'mysql+mysqldb://{user}:{pwd}@{host}/{dbase}'  # engine connect str
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_pre_ping": True
        }  # passed to sqlalchemy.create_engine()

# Initialize app with extension; ensure all app configs have been set already!
db.init_app(app)

# todo: import all models, then create tables with db.create_all() :done
db.create_all(bind_key=None)  # use default engine (URI above) as bind

# todo: also init app with LoginManager instance
