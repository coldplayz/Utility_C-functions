#!/usr/bin/env python3
"""DB module
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.session import Session
from sqlalchemy.exc import InvalidRequestError
from sqlalchemy.orm.exc import NoResultFound
# from models import Usage2
from typing import Dict
import sqlalchemy
import bcrypt

from models import Base


class DB:
    """DB class
    """

    def __init__(self) -> None:
        """Initialize a new DB instance
        """
        self._engine = create_engine('mysql+mysqldb://testuser:44384439@localhost/gas_usage', echo=False)
        # Base.metadata.drop_all(self._engine)
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

    def add_usage(self, cls, **kwargs):
        """ Records new usage.
        """
        # create a usage object
        usage = cls(**kwargs)
        # retrieve a database session
        sess = self._session
        # save User to database
        sess.add(usage)
        sess.commit()



'''
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
