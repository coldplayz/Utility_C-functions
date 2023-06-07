#!/usr/bin/env python3
''' Model definition for service categories table.'''
from api.v1.views import db


class ServiceCategories(db.Model):
    ''' Class definition for service categories.
    '''
    # db will automatically assign `service_categories` to `__tablename__`

    # auto_increment implemented implicitly
    id = db.mapped_column(db.Integer, primary_key=True)
    name = db.mapped_column(db.String(15), nullable=False)

    # Relationships
    service_providers = db.relationship(
            "ServiceProviderServices",
            backref="service_category",
            cascade="all, delete-orphan"
            )
