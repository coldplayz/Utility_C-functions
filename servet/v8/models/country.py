#!/usr/bin/env python3
''' Model definition for countries table.'''
from api.v1.views import db


class Countries(db.Model):
    ''' Class definition for countries.
    '''
    # db will automatically assign `countries` to `__tablename__`

    # auto_increment implemented implicitly
    id = db.mapped_column(db.Integer, primary_key=True)
    name = db.mapped_column(db.String(15), nullable=False)
    country_code = db.mapped_column(db.String(4), nullable=False, unique=True)
    # Foreign keys

    # Table constraints
    __table_args__ = (
            db.CheckConstraint(
                'char_length(country_code) = 4',
                name='check_countryCode'),
            )

    # Relationships
    locations = db.relationship(
            "Locations",
            backref="country",
            cascade="all, delete-orphan"
            )
    states = db.relationship(
            "States",
            backref="country",
            cascade="all, delete-orphan"
            )
