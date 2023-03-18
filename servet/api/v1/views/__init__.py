#!/usr/bin/env python3
''' views package initialization file.'''
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

from api.v1.views.customers import *
