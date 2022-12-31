#!/usr/bin/env python3
'''
User class for table models.
'''

from sqlalchemy import Computed, create_engine, Column, Integer, SmallInteger, String, Boolean, DateTime, Numeric, ForeignKey, func, cast, ForeignKeyConstraint, CheckConstraint
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
# from user import Base

'''
engine = create_engine(
        'mysql+mysqldb://Bel2:44384439@localhost/b2_prepaid_meter',
        pool_pre_ping=True)
'''

Base = declarative_base()

class User(Base):
    # Define table name
    __tablename__ = 'users'

    ''' Define column-attributes.
        Format:
            col_name = Column(data_type, ...)
    '''
    userID = Column(Integer(), primary_key=True)
    userName = Column(String(50), nullable=False)
    whatsapp = Column(String(11))
    phone_1 = Column(String(11))
    phone_2 = Column(String(11))
    sex = Column(String(1), nullable=False)
    roomIdx = Column(SmallInteger(), nullable=False)
    currRate = Column(Numeric(5, 2), default=0)
    isResident = Column(Boolean, default=True)

    # Relationships
    userBills = relationship("Bill", backref='user', cascade="all, delete-orphan")
    userAppliances = relationship("UserAppliance", backref="user", cascade="all, delete-orphan")
    userPayments = relationship("Payment", backref="user", cascade="all, delete-orphan")

    ''' Define table-level constraints.
        Format:
            __table_args__ = (comma-separated list of table constraints)
    '''
    __table_args__ = (
            CheckConstraint(
                'char_length(whatsapp) = 11',
                name='check_whatsapp'),
            CheckConstraint(
                'char_length(phone_1) = 11',
                name='check_phone_1'),
            CheckConstraint(
                'char_length(phone_2) = 11',
                name='check_phone_2'))


    @classmethod
    def new_user(cls):
        ''' Creates and returns a new User object representing a users record.
        '''

        # Collect attributes
        uname = input("Enter userName: ")
        wapp = input(f"Enter {uname if len(uname) > 0 else 'userName'}'s whatsapp: ")
        phone1 = input(f"Enter {uname if len(uname) > 0 else 'userName'}'s phone_1: ")
        phone2 = input(f"Enter {uname if len(uname) > 0 else 'userName'}'s phone_2: ")
        sx = input(f"Enter {uname if len(uname) > 0 else 'userName'}'s sex: ")
        rmIdx = input(f"Enter {uname if len(uname) > 0 else 'userName'}'s roomIdx (0-based): ")
        isRsdnt = input(f"Is {uname if len(uname) > 0 else 'userName'} still resident? True/False: ")

        # Create object
        user = cls(
                userName=(uname if len(uname) > 0 else None),
                whatsapp=(wapp if len(wapp) > 0 else None),
                phone_1=(phone1 if len(phone1) > 0 else None),
                phone_2=(phone2 if len(phone2) > 0 else None),
                sex=(sx if len(sx) > 0 else None),
                roomIdx=(int(rmIdx) if len(rmIdx) > 0 else None),
                isResident=(bool(isRsdnt) if len(isRsdnt) > 0 else None)
                )

        return user
