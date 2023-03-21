#!/usr/bin/env python3
''' Model definition for reviews table.'''
from models import db
from datetime import datetime
from uuid import uuid4
from decimal import Decimal


class Reviews(db.Model):
    ''' Class definition for reviews.
    '''
    # db will automatically assign `reviews` to `__tablename__`

    # auto_increment implemented implicitly for integer ids
    id = db.mapped_column(db.Integer, primary_key=True)
    review_content = db.mapped_column(db.Text())
    upvotes = db.mapped_column(db.Integer, default=0)
    total_votes = db.mapped_column(db.Integer, default=0)
    created_at = db.mapped_column(db.DateTime)
    updated_at = db.mapped_column(
            db.DateTime, onupdate=datetime.utcnow)
    # Foreign keys
    serviceProviderService_id = db.mapped_column(
            db.ForeignKey("service_provider_services.id"),
            nullable=False
            )
    customer_id = db.mapped_column(
            db.ForeignKey("customers.id"), nullable=False)

    # Relationships


    def __init__(self, *args, **kwargs):
        self.created_at = datetime.utcnow()
        self.updated_at = self.created_at
        super().__init__(*args, **kwargs)
