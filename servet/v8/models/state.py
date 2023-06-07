#!/usr/bin/env python3
''' Model definition for states table.'''
from api.v1.views import db


class States(db.Model):
    ''' Class definition for states.
    '''
    # db will automatically assign `states` to `__tablename__`

    # auto_increment implemented implicitly
    id = db.mapped_column(db.Integer, primary_key=True)
    name = db.mapped_column(db.String(15), nullable=False)
    # Foreign keys
    country_id = db.mapped_column(
            db.ForeignKey("countries.id"), nullable=False)

    # Relationships
    locations = db.relationship(
            "Locations",
            backref="state",
            cascade="all, delete-orphan"
            )

    # Table constraints
    __table_args__ = (
            db.UniqueConstraint('name', 'country_id', name='uq_name_country'),
            )
