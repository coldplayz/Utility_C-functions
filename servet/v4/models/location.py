#!/usr/bin/env python3
''' Model definition for locations table.'''
from api.v1.views import db


class Locations(db.Model):
    ''' Class definition for locations.
    '''
    # db will automatically assign `locations` to `__tablename__`

    # auto_increment implemented implicitly
    id = db.mapped_column(db.Integer, primary_key=True)
    name = db.mapped_column(db.String(15), nullable=False)
    # Foreign keys
    state_id = db.mapped_column(db.ForeignKey("states.id"), nullable=False)
    country_id = db.mapped_column(
            db.ForeignKey("countries.id"), nullable=False)

    # Relationships
    service_providers = db.relationship(
            "ServiceProviders",
            backref="location",
            cascade="all, delete-orphan"
            )

    # Table constraints
    __table_args__ = (
            db.UniqueConstraint('name', 'state_id', name='uq_name_state'),
            )
