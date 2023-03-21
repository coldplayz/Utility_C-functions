#!/usr/bin/env python3

from sqlalchemy.orm import DeclarativeBase, mapped_column, Session, relationship, aliased, Bundle
from sqlalchemy import create_engine, ForeignKey, Integer, String, func, desc, asc, select

from flask_sqlalchemy import SQLAlchemy
from flask import Flask

app = Flask(__name__)
db = SQLAlchemy()

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqldb://testUser:44384439@localhost/testdb"
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_pre_ping": True
        }

db.init_app(app)

'''
engine = create_engine("mysql+mysqldb://devUser:44384439@localhost/devdb", pool_pre_ping=True)

class Base(DeclarativeBase):
    pass
'''


class User(db.Model):
    __tablename__ = "user_accounts"  # optional

    id = db.mapped_column(db.Integer, primary_key=True)
    name = db.mapped_column(db.String(30), nullable=False)
    fullname = db.mapped_column(db.String(45), nullable=True)

    addresses = db.relationship("Address", backref="user", cascade="all, delete-orphan")


class Address(db.Model):
    __tablename__ = "user_addresses"

    id = db.mapped_column(db.Integer, primary_key=True)
    email = db.mapped_column(db.String(45))
    user_id = db.mapped_column(db.ForeignKey("user_accounts.id"))


# sess = Session(engine)


def createTable():
    # Base.metadata.create_all(engine)

    with app.app_context():
        db.create_all(bind_key=None)

        user1 = User(name="sponigebob", fullname="Spongebob Squarepants")
        user2 = User(name="coldplayz", fullname="Greenbel Eleghasim")

        add1 = Address(email="obisann@gmail.com")
        add1.user = user2
        db.session.add(add1)

        add2 = Address(email="spongebob@square.pants")
        add2.user = user1
        db.session.add(add2)

        add3 = Address(email="greenbel.chibuike@gmail.com")
        add3.user = user2
        db.session.add(add3)

        db.session.commit()
