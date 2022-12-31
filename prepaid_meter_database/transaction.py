#!/usr/bin/env python3
'''
Transaction class for table models.
'''

from sqlalchemy import Computed, create_engine, Column, Integer, SmallInteger, String, Boolean, Date, Numeric, ForeignKey, func, cast, ForeignKeyConstraint, CheckConstraint
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
# from sqlalchemy.ext.declarative import declarative_base
from user import Base

'''
engine = create_engine(
        'mysql+mysqldb://Bel2:44384439@localhost/b2_prepaid_meter',
        pool_pre_ping=True)
'''

class Transaction(Base):
    # Define table name
    __tablename__ = 'transactions'

    ''' Define column-attributes.
        Format:
            col_name = Column(data_type, ...)
    '''
    transactionID = Column(Integer, primary_key=True)
    transactionAmt = Column(Integer, nullable=False)
    totalOldDebt = Column(Integer, nullable=False)
    totalNetRecharge = Column(Integer, Computed('transactionAmt - totalOldDebt', persisted=True))
    created_on = Column(Date, default=datetime.now().date)

    # Relationships
    transactionBills = relationship("Bill", backref='transaction', cascade="all, delete-orphan")
    transactionUserAppliances = relationship("UserAppliance", backref='transaction', cascade="all, delete-orphan")
    transactionPayments = relationship("Payment", backref='transaction', cascade="all, delete-orphan")

    ''' Define table-level constraints.
        Format:
            __table_args__ = (comma-separated list of table constraints)
    '''
    # Code here
