#!/usr/bin/env python3
""" SQLAlchemy model.
"""
from sqlalchemy import Integer, String, Enum, DateTime, TIMESTAMP, Column
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()


class Usage1(Base):
    """ User class to model user objects.
    """
    __tablename__ = 'usage_refill_1'

    id = Column(Integer, primary_key=True)
    use_case = Column(String(255), nullable=False)
    duration_minute = Column(Integer, nullable=False)
    heat_level = Column(Enum('low', 'average', 'high'))
    day_time = Column(Enum('morning', 'afternoon', 'evening'))
    use_date = Column(TIMESTAMP, default=datetime.utcnow)


''''
class Usage2(Base):
    """ User class to model user objects.
    """
    __tablename__ = 'usage_refill_2'

    id = Column(Integer, primary_key=True)
    use_case = Column(String(255), nullable=False)
    duration_minute = Column(Integer, nullable=False)
    heat_level = Column(Enum('low', 'average', 'high'))
    day_time = Column(Enum('morning', 'afternoon', 'evening'))
    use_date = Column(TIMESTAMP, default=datetime.utcnow)
'''


'''
"""DB module
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.session import Session
from sqlalchemy.exc import InvalidRequestError
from sqlalchemy.orm.exc import NoResultFound
from typing import Dict
from user import User
import sqlalchemy
import bcrypt

from user import Base


class DB:
    """DB class
    """

    def __init__(self) -> None:
        """Initialize a new DB instance
        """
        self._engine = create_engine("sqlite:///a.db", echo=False)
        Base.metadata.drop_all(self._engine)
        Base.metadata.create_all(self._engine)
        self.__session = None

    @property
    def _session(self) -> Session:
        """Memoized session object
        """
        if self.__session is None:
            DBSession = sessionmaker(bind=self._engine)
            self.__session = DBSession()
        return self.__session

    def add_user(self, email: str, hashed_password: str) -> User:
        """ Creates and returns a new User.
        """
        # create a user object
        user = User(email=email, hashed_password=hashed_password)
        # retrieve a database session
        sess = self._session
        # save User to database
        sess.add(user)
        sess.commit()

        return user

    def find_user_by(self, **kwargs: Dict) -> User:
        """ Filters User objects based on kwargs, and returns the first.
        """
        sess = self._session

        # InvalidRequestError will be raised for non-existent attributes
        try:
            if not kwargs:
                raise Exception
            user = sess.query(User).filter_by(**kwargs).first()
        except Exception:
            raise InvalidRequestError

        if user is None:
            raise NoResultFound

        return user

    def update_user(self, user_id: int, **kwargs: dict) -> None:
        """ Updates a User record.
        """
        sess = self._session

        try:
            user = self.find_user_by(id=user_id)
        except NoResultFound:
            raise ValueError

        # User object exists based on ID
        for k, v in kwargs.items():
            if not hasattr(user, k):
                # attribute non-existent
                raise ValueError

            # else attribute exists; update
            setattr(user, k, v)
        sess.add(user)
        sess.commit()
'''
