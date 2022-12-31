#!/usr/bin/env python3
'''
Class for appliance cost table model.
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

class UserAppliance(Base):
    # Define table name
    __tablename__ = 'userAppliances'

    ''' Define column-attributes.
        Format:
            col_name = Column(data_type, ...)
    '''
    applianceID = Column(Integer, ForeignKey("appliances.applianceID", ondelete='CASCADE', onupdate='CASCADE'), primary_key=True)
    userID = Column(Integer, ForeignKey("users.userID", ondelete='CASCADE', onupdate='CASCADE'), primary_key=True)
    transactionID = Column(Integer, ForeignKey("transactions.transactionID", ondelete='CASCADE', onupdate='CASCADE'))
    costAdjNum = Column(SmallInteger, nullable=False)
    adjustmentDate = Column(Date, default=datetime.now().date)

    ''' Define table-level constraints.
        Format:
            __table_args__ = (comma-separated list of table constraints)
    '''
    # Code here
