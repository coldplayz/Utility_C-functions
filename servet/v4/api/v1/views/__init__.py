#!/usr/bin/env python3
''' Initialization for the application package.'''
from flask import Flask, session, request
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from os import getenv, path
from secrets import token_hex
from urllib.parse import urlparse, urljoin

# Create the SQLAlchemy extension
db = SQLAlchemy()

from models.country import Countries
from models.customer import Customers
from models.location import Locations
from models.review import Reviews
from models.service_provider_service import ServiceProviderServices
from models.service_category import ServiceCategories
from models.service_provider import ServiceProviders
from models.state import States
from models import populate_db


def create_app():
    ''' Implements the app factory pattern of creating application object.
    '''
    # Create app object
    app = Flask(__name__)

    '''
    # Create the app
    app = Flask(
            __name__,
            template_folder='../api/v1/views/templates',
            static_folder='../api/v1/views/static'
            )
    '''

    app.url_map.strict_slashes = False

    user = getenv('SERVET_USER')
    pwd = getenv('SERVET_PWD')
    host = getenv('SERVET_HOST')
    port = getenv('SERVET_PORT')
    dbase = getenv('SERVET_DB')

    # Set necessary app configurations
    app.config["SQLALCHEMY_DATABASE_URI"] =\
            f'mysql+mysqldb://{user}:{pwd}@{host}/{dbase}'  # engine conn. str
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
            "pool_pre_ping": True,
            }  # passed to sqlalchemy.create_engine()
    app.config["SECRET_KEY"] = token_hex()  # for signing the session
    app.config["SERVET_CUSTOMER_UPLOADS"] = '/static/images/customers'
    app.config["SP_IMAGE_FOLDER"] = '/static/service_providers/images/'
    app.config["CUS_IMAGE_FOLDER"] = '/static/customers/images/'
    app.config["SPS_IMAGE_FOLDER"] =\
            '/static/service_provider_services/images/'
    app.config["EXPLAIN_TEMPLATE_LOADING"] = True

    # Init app with extension; ensure all app configs have been set already!
    db.init_app(app)

    # Create and configure the login manager object
    login_manager = LoginManager()
    login_manager.blueprint_login_views = {
            'cus_auth_views': 'cus_auth_views.cus_login',
            'sp_auth_views': 'sp_auth_views.sp_login'
            }
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        ''' Retrieves and returns a specific customer object for the login manager
        '''
        with app.app_context():
            '''
            - app. context is required to use the session/engine.
            - user_id is a string; need to cast
              to appropriate type for get query.
            - user_id is provided from the session as managed by login manager.
            '''
            if session['account_type'] == 'customer':
                # Return customer object or None
                return db.session.get(Customers, user_id)

        # else return service-provider object
        return db.session.get(ServiceProviders, user_id)

    # todo: import all models, then create tables with db.create_all() :done
    with app.app_context():
        db.create_all(bind_key=None)  # use default engine (URI above) as bind

    # Import and register blueprints
    from api.v1.views.customers import cus_auth_views
    app.register_blueprint(cus_auth_views)

    return app


# Function for validating `next` URLs in query strings
def is_safe_url(target):
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and \
            ref_url.netloc == test_url.netloc












'''
#!/usr/bin/env python3
from flask import Blueprint

# Blueprint for customer authentication views
cus_auth_views = Blueprint(
        'cus_auth_views', __name__, url_prefix='/customers')

# Blueprint for service provider authentication views
sp_auth_views = Blueprint(
        'sp_auth_views', __name__, url_prefix='/serviceProviders')

# Customer API blueprint
cus_apis = Blueprint('cus_apis', __name__, url_prefix='/api/v1/customers')

# Service provider API blueprint
sp_apis = Blueprint(
        'sp_apis', __name__, url_prefix='/api/v1/serviceProviders')

# Service-provider service API blueprint
sps_apis = Blueprint('sps_apis', __name__, url_prefix='api/v1/services')

from models import login_manager
login_manager.blueprint_login_views = {
        'cus_auth_views': 'cus_auth_views.cus_login',
        'sp_auth_views': 'sp_auth_views.sp_login'
        }

from api.v1.views.customers import *
'''
