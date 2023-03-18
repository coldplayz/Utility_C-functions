#!/usr/bin/env python3
''' Initialization for the `models` package.'''
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from os import getenv, path
from secrets import token_hex

# Create the SQLAlchemy extension
db = SQLAlchemy()

# Create the app
app = Flask(__name__, template_folder='../api/v1/views/templates')
app.url_map.strict_slashes = False

# Create the login manager object
login_manager = LoginManager()

user = getenv('SERVET_USER')
pwd = getenv('SERVET_PWD')
host = getenv('SERVET_HOST')
port = getenv('SERVET_PORT')
dbase = getenv('SERVET_DB')

# Set necessary app configurations
app.config["SQLALCHEMY_DATABASE_URI"] =\
        f'mysql+mysqldb://{user}:{pwd}@{host}/{dbase}'  # engine connect str
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_pre_ping": True,
        }  # passed to sqlalchemy.create_engine()
app.config["SECRET_KEY"] = token_hex()  # for signing the session
app.config["SERVET_CUSTOMER_UPLOADS"] = '/static/images/customers'
app.config["SERVET_SP_UPLOADS"] = '/static/images/service_providers'
app.config["EXPLAIN_TEMPLATE_LOADING"] = True

# Initialize app with extension; ensure all app configs have been set already!
db.init_app(app)


# todo: also init app with LoginManager instance

from models.country import Countries
from models.customer import Customers
from models.location import Locations
from models.review import Reviews
from models.service_provider_service import ServiceProviderServices
from models.service_category import ServiceCategories
from models.service_provider import ServiceProviders
from models.state import States

# todo: import all models, then create tables with db.create_all() :done
with app.app_context():
    db.create_all(bind_key=None)  # use default engine (URI above) as bind


def populate_db():
    ''' Populate the newly created tables with dummy data, as for testing.
    '''
    # Create two countries
    co1 = Countries(name='Nigeria', country_code='+234')
    co2 = Countries(name='Kenya', country_code='+254')

    # Create three states
    st1 = States(name='Lagos')  # Nigerian
    st1.country = co1  # country relationship; will auto-fill foreign key attr
    st2 = States(name='Rivers')  # Nigerian
    st2.country = co1
    st3 = States(name='County1')  # Kenyan
    st3.country = co2

    # Create four locations
    lo1 = Locations(name='Ikeja')  # Nigerian
    lo1.state = st1  # state relationship
    lo1.country = co1  # country relationship
    lo2 = Locations(name='Oshodi')  # Nigerian
    lo2.state = st1
    lo2.country = co1
    lo3 = Locations(name='Port Harcourt')  # Nigerian
    lo3.state = st2
    lo3.country = co1
    lo4 = Locations(name='SubCounty1')  # Kenyan
    lo4.state = st3  # county relationship
    lo4.country = co2

    # Create three service categories
    sc1 = ServiceCategories(name='Plumbing')
    sc2 = ServiceCategories(name='Hair Dressing')
    sc3 = ServiceCategories(name='Dry Cleaning')
    with app.app_context():
        db.session.add_all([sc1, sc2, sc3])
        db.session.commit()

    # Create two service providers
    sp1 = ServiceProviders(first_name='Rahab', last_name='Mary', phone='+254703891377', whatsapp='+254703891377', email='rahabmagiri@gmail.com', username='scaarif', password='pwd1')
    sp1.image_uri = path.join(app.config["SERVET_SP_UPLOADS"], 'sp1.jpg')
    sp1.location = lo4
    #sp1.service_categories.append(
    sp2 = ServiceProviders(first_name='Greenbel', last_name='Eleghasim', phone='+2348103665556', whatsapp='+2348103665556', email='obisann@gmail.com', username='coldplayz', password='pwd2')
    sp2.image_uri = path.join(app.config["SERVET_SP_UPLOADS"], 'sp2.jpg')
    sp2.location = lo1
    # perhaps id is needed by ServiceProviderServices
    with app.app_context():
        db.session.add_all([sp1, sp2])
        db.session.commit()

    # Create three service-provider services
    sps1 = ServiceProviderServices(service_description='I offer affordable and high-quality hair-dressing services')
    sps1.service_category = sc2
    sps1.service_provider = sp1
    sps2 = ServiceProviderServices(service_description='If there is one professional you need for your plumbing jobs, it is me!')
    sps2.service_category = sc1
    sps2.service_provider = sp2
    sps3 = ServiceProviderServices(service_description='5-star dry-cleaning and laundry services.')
    sps3.service_category = sc3
    sps3.service_provider = sp2
    with app.app_context():
        db.session.add_all([sps1, sps2, sps3])
        db.session.commit()

    # Create reviews

    # Create two customers
    cus1 = Customers(first_name='customer', last_name='one', email='customerone@gmail.com', username='c1', password='c1pwd')
    cus2 = Customers(first_name='customer', last_name='two', email='customertwo@gmail.com', username='c2', password='c2pwd')
    with app.app_context():
        db.session.add_all([cus1, cus2])
        db.session.commit()

    # Persist data to database
    with app.app_context():
        db.session.add_all([co1, co2])
        db.session.commit()  # so id is available for FK reference

        db.session.add_all([st1, st2, st3])
        db.session.commit()

        db.session.add_all([lo1, lo2, lo3, lo4])
        db.session.commit()

        '''
        db.session.add_all([sc1, sc2, sc3])
        db.session.commit()
        '''

        '''
        db.session.add_all([sp1, sp2])
        db.session.commit()
        '''

        '''
        db.session.add_all([sps1, sps2, sps3])
        db.session.commit()
        '''
