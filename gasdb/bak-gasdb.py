#!/usr/bin/env python3
""" SQLAlchemy model.
"""
from db import DB
from models import Usage1
from sqlalchemy.exc import DataError
import readline


class Attr:
    """ Class to manage GasDB attributes on insert.
    """
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)


class GasDB:
    """ Interface for communicating with the `gas_usage` database.
    """
    def add_usage_refill_N(self):
        """ Collect field data.
        """
        # attr = {}

        use_case: str = input('use_case: ')
        duration_minute: int = int(input('duration_minute: '))
        heat_level: str = input('heat_level: ')
        day_time: str = input('day_time: ')

        use_date = input('use_date: ')
        use_date = use_date if use_date else None

        # attr.update(use_case=use_case, duration_minute=duration_minute, heat_level=heat_level)

        # define attributes to be saved, one-time;
        # no other attributes are allowed to be added hereafter
        attr = Attr(use_case=use_case, duration_minute=duration_minute, heat_level=heat_level, day_time=day_time, use_date=use_date)

        inp = input(f'\n{attr.__dict__}\n\nDo you want to save this data? y or n: ')

        while inp == 'n' or inp == '':
            print('\nEnter your changes. Format:\n\tkey1=value1,Key2=value2')
            changes = input('\nEnter changes: ')

            if changes:
                # parse input in a form that Dict.update can take
                parsed_changes_tmp = changes.split(',')
                parsed_changes = [tuple(item.split('=')) for item in parsed_changes_tmp]

                invalid_attrs = []
                for k, v in parsed_changes:
                    # save all valid attributes, collecting invalid ones
                    if hasattr(attr, k):
                        setattr(attr, k, v)
                    else:
                        invalid_attrs.append(k)
                if invalid_attrs:
                    print(f'\nInvalid attributes: {invalid_attrs}')

            inp = input(f'\n{attr.__dict__}\n\nDo you want to save this data? y or n: ')

        if inp == 'y':
            print('Collation complete! Next...')
            db = DB()
            try:
                db.add_usage(Usage1, **attr.__dict__)
            except DataError as exc:
                print(f'ERROR:', exc.orig)
        else:
            print('Not saved: invalid response input')


gasdb = GasDB()
gasdb.add_usage_refill_N()
inp = input('\nDo you want to save more records? y or n: ')
while inp == 'y':
    gasdb.add_usage_refill_N()
    inp = input('\nDo you want to save more records? y or n: ')

'''
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
