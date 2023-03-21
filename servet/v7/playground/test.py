#!/usr/bin/env python3

from sqlalchemy.orm import DeclarativeBase, mapped_column, Session, relationship, aliased, Bundle
from sqlalchemy import create_engine, ForeignKey, Integer, String, func, desc, asc, select

engine = create_engine("mysql+mysqldb://devUser:44384439@localhost/devdb", pool_pre_ping=True)

class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "user_accounts"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(30), nullable=False)
    fullname = mapped_column(String(45), nullable=True)

    addresses = relationship("Address", backref="user", cascade="all, delete-orphan")


class Address(Base):
    __tablename__ = "user_addresses"

    id = mapped_column(Integer, primary_key=True)
    email = mapped_column(String(45))
    user_id = mapped_column(ForeignKey("user_accounts.id"))


sess = Session(engine)


def createTable():
    Base.metadata.create_all(engine)

    user1 = User(name="spongebob", fullname="Spongebob Squarepants")
    user2 = User(name="coldplayz", fullname="Greenbel Eleghasim")

    add1 = Address(email="obisann@gmail.com")
    add1.user = user2
    sess.add(add1)

    add2 = Address(email="spongebob@square.pants")
    add2.user = user1
    sess.add(add2)

    add3 = Address(email="greenbel.chibuike@gmail.com")
    add3.user = user2
    sess.add(add3)

    sess.commit()
