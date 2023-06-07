#!/usr/bin/env python3
''' Model definition for customers table.'''
from api.v1.views import db
from datetime import datetime
from uuid import uuid4
from werkzeug.security import generate_password_hash
from flask_login import UserMixin


class Customers(UserMixin, db.Model):
    ''' Class definition for customers.
    '''
    # db will automatically assign `customers` to `__tablename__`

    # auto_increment implemented implicitly for integer ids
    id = db.mapped_column(
            db.String(60), primary_key=True)
    first_name = db.mapped_column(db.String(15), nullable=False)
    last_name = db.mapped_column(db.String(15), nullable=False)
    phone = db.mapped_column(db.String(15), unique=True)
    email = db.mapped_column(db.String(30), nullable=False, unique=True)
    image_uri = db.mapped_column(db.String(100))
    username = db.mapped_column(db.String(15), nullable=False, unique=True)
    password = db.mapped_column(db.String(100), nullable=False)
    created_at = db.mapped_column(
            db.DateTime, nullable=False)
    updated_at = db.mapped_column(
            db.DateTime,
            nullable=False,
            onupdate=datetime.utcnow
            )
    # Foreign keys

    # Relationships
    reviews = db.relationship(
            "Reviews",
            backref="customer",
            cascade="all, delete-orphan"
            )

    # Table constraints
    __table_args__ = (
            db.CheckConstraint('image_uri LIKE "%.jpg"', name='check_image_extention'),
            )

    def __init__(self, *args, **kwargs):
        self.id = str(uuid4())
        self.created_at = datetime.utcnow()
        self.updated_at = self.created_at
        super().__init__(*args, **kwargs)


    def __setattr__(self, name, value):
        if name == 'password':
            value = generate_password_hash(value, method='sha256')
        super().__setattr__(name, value)
