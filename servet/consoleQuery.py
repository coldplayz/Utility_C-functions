#!/usr/bin/env python3
from api.v1.views import db, populate_db, ServiceCategories, ServiceProviders, ServiceProviderServices, Locations, States, Countries, Reviews, Customers
from api.v1.views.application import app

stmt = db.select(ServiceProviders.first_name, ServiceProviders.last_name, ServiceProviderServices.image_uri, ServiceProviderServices.rating, ServiceProviderServices.service_description).select_from(ServiceProviderServices).join(Reviews, isouter=True).join(ServiceCategories).join(ServiceProviders).join(Locations).join(States).join(Countries).where(Locations.id==2)

stmt2 = db.select(ServiceProviders.first_name, ServiceProviders.last_name, ServiceCategories.name, ServiceProviderServices.image_uri, ServiceProviderServices.rating, ServiceProviderServices.service_description).select_from(ServiceProviderServices).join(ServiceCategories).join(ServiceProviders).where(ServiceProviderServices.id==2)

stmt3 = db.select(Reviews.review_content, Reviews.created_at, Customers.first_name, Customers.last_name).join(Customers).join(ServiceProviderServices).where(ServiceProviderServices.id==2)
