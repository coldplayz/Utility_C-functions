#!/usr/bin/env python3
'''
Template class for table models.
'''

from sqlalchemy import Computed, create_engine, Column, Integer, SmallInteger, String, Boolean, DateTime, Numeric, ForeignKey, func, cast, ForeignKeyConstraint, CheckConstraint
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
# from sqlalchemy.ext.declarative import declarative_base
from user import Base

'''
engine = create_engine(
        'mysql+mysqldb://Bel2:44384439@localhost/b2_prepaid_meter',
        pool_pre_ping=True)
'''

class Appliance(Base):
    # Define table name
    __tablename__ = 'appliances'

    ''' Define column-attributes.
        Format:
            col_name = Column(data_type, ...)
    '''
    applianceID = Column(Integer, primary_key=True)
    applianceName = Column(String(50), nullable=False)
    wattage = Column(SmallInteger, nullable=False)
    absCost = Column(Numeric(5, 2), nullable=False)
    relCost = Column(Numeric(5, 2), nullable=False)
    adjRelCost = Column(Numeric(5, 2), nullable=False)

    # Relationships
    appliance_users = relationship("UserAppliance", backref='appliance', cascade="all, delete-orphan")

    ''' Define table-level constraints.
        Format:
            __table_args__ = (comma-separated list of table constraints)
    '''
    # Code here
