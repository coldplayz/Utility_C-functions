#!/usr/bin/env python3
''' Model definition for service-provider services table.'''
from api.v1.views import db
from datetime import datetime
from uuid import uuid4
from decimal import Decimal


class ServiceProviderServices(db.Model):
    ''' Class definition for service provider services.
    '''
    # auto_increment implemented implicitly for integer ids
    id = db.mapped_column(db.Integer, primary_key=True)
    service_description = db.mapped_column(db.Text(), nullable=False)
    rating = db.mapped_column(db.Numeric(2, 1), default=Decimal(0.0))
    image_uri = db.mapped_column(db.String(100))
    # Foreign keys
    serviceCategory_id = db.mapped_column(
            db.ForeignKey("service_categories.id"), nullable=False)
    serviceProvider_id = db.mapped_column(
            db.ForeignKey("service_providers.id"), nullable=False)

    # Relationships
    reviews = db.relationship(
            "Reviews",
            backref="serviceProvider_service",
            cascade="all, delete-orphan"
            )
