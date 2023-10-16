#!/usr/bin/env python3
""" SQLAlchemy model.
"""
from db import DB
from models import Usage1, UseCase
from sqlalchemy.exc import DataError
from typing import List
import readline
import sys
import re
import click

db = DB()
# sys.exit(0)


class Attr:
    """ Class to manage GasDB attributes on insert.
    """
    valid_attr = ['use_case', 'duration_minute', 'heat_level', 'day_time', 'use_date', 'use_cases', 'setattr_call_count']
    setattr_call_count = 0  # bound to class
    use_cases = None  # bound to class

    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

    def __setattr__(self, name, value):
        # print('In __setattr__:', f'name: {name}', f'value: {value}', self.setattr_call_count)  # SCAFF
        if name == 'setattr_call_count' or name == 'use_cases':
            # temp attributes, not [important] property;
            # ...set without validation
            super().__setattr__(name, value)
            return

        if name.lstrip('_') not in self.valid_attr:
            raise AttributeError(f'invalid attribute: {name}')
        name = f'_{name}'

        if self.setattr_call_count == 0:
            self.__class__.setattr_call_count = 1
            # perform validation with the property setters
            # print('calling setattr in __setattr__')  # SCAFF
            # setattr(self, name, value)
            super().__setattr__(name, value)
        else:
            self.__class__.setattr_call_count = 0
            name = name.lstrip('_')
            # validation done in first recursion;
            # set value directly to avoid infinite recursion
            super().__setattr__(name, value)

    def get_cases(self):
        """ Memoized list of use_cases.

        If the use_cases table is updated, restart the process
        """
        # print('In _use_cases')  # SCAFF
        if self.use_cases is not None:
            return self.use_cases  # bound to class
        # else attribute not set yet; fetch and set one-time
        self.__class__.use_cases = db.get_use_cases(UseCase)
        # print(self._use_cases)  # SCAFF
        return self.use_cases

    @property
    def _use_case(self):
        """ use_case property."""
        return self.use_case

    @_use_case.setter
    def _use_case(self, value):
        # print('In _use_case')  # SCAFF
        if value in self.get_cases():
            self.use_case = value
        else:
            # reset __setattr__ call count before raising
            self.__class__.setattr_call_count = 0 if (self.setattr_call_count == 1) else 1
            raise ValueError(f'invalid use case value: {value}')

    @property
    def _duration_minute(self):
        """ duration_minute property."""
        return self.duration_minute

    @_duration_minute.setter
    def _duration_minute(self, value):
        # print('In _duration_minute')  # SCAFF
        if value.isdigit():
            self.duration_minute = int(value)
        else:
            # reset __setattr__ call count before raising
            self.__class__.setattr_call_count = 0 if (self.setattr_call_count == 1) else 1
            raise ValueError(f'{value} is not numeric')

    @property
    def _heat_level(self):
        """ heat_level property."""
        return self.heat_level

    @_heat_level.setter
    def _heat_level(self, value):
        # print('In _heat_level')  # SCAFF
        if value in ['low', 'average', 'high']:
            self.heat_level = value
        else:
            # reset __setattr__ call count before raising
            self.__class__.setattr_call_count = 0 if (self.setattr_call_count == 1) else 1
            raise ValueError(f'{value} is not an allowed Enum value for this field')

    @property
    def _day_time(self):
        """ day_time property."""
        return self.day_time

    @_day_time.setter
    def _day_time(self, value):
        # print('In _day_time', value)  # SCAFF
        if value in ['morning', 'afternoon', 'evening']:
            self.day_time = value
        else:
            # reset __setattr__ call count before raising
            self.__class__.setattr_call_count = 0 if (self.setattr_call_count == 1) else 1
            raise ValueError(f'{value} is not an allowed Enum value for this field')

    @property
    def _use_date(self):
        """ use_date property."""
        return self.use_date

    @_use_date.setter
    def _use_date(self, value):
        # print('In _use_date')  # SCAFF
        # valid date format: 20yy-mm-dd
        if re.match(r'20[0-9]{2}-[0-9]{2}-[0-9]{2}', value):
            self.use_date = value
        else:
            raise ValueError(f'invalid date format: {value}')


class InputDecoder:
    """ Decode cryptic inputs representing usage records.
    """
    USE_CASE_MAP = dict(
            B2='boil 1m water',
            B1='boil water',
            C5='cook 2 indomie',
            C6='cook augmented ogbono',
            C7='cook beans',
            C8='cook egusi soup',
            C4='cook ogbono soup',
            C9='cook okra soup',
            CA='cook yam',
            F2='fry egg sauce',
            F1='fry pancakes',
            P1='parboil beans',
            P2='parboil fish',
            W5='warm augmented ogbono',
            W6='warm beans',
            W7='warm egg sauce',
            W8='warm egusi soup',
            W4='warm ogbono soup',
            W1='warm okra soup',
            W2='warm augmented okra',
            W3='warm yam and beans',
            C1='cook yam and beans',
            C2='cook augmented okra',
            C3='cook 3 indomie',
            M='miscellaneous',
            W9='warm potato and beans',
            WA='warm corn',
            WB='warm rice',
            WC='warm augmented egusi',
            WD='warm vegetable soup',
            WE='warm rice and beans',
            CB='cook egg and potato',
            CC='cook potato and beans',
            CE='cook rice',
            CF='cook augmented egusi',
            CG='cook vegetable soup',
            CH='cook rice and beans',
            P3='parboil potato',
            )

    DAY_TIME_MAP = dict(
            M='morning',
            A='afternoon',
            E='evening',
            )

    def __setattr__(self, name, value):
        if name in ['use_date', 'heat_level']:
            super().__setattr__(name, value)
        else:
            raise ValueError(f'{name} not allowed to be set on InputDecoder object')

    def get_attr_objs(self, code_list: List[str]):
        """ Processes a list of coded inputs and returns a list of Attr objects.

        Args:
            - code_list (List[str]): a list of strings of
              ...the form: useCase:dayTime:durationMinute

        Notes:
            - use_date and heat_level should have already
              ...been set as self attributes before invoking this method.
        """
        attr_objs: List[Attr] = []
        attr_names = ['use_case', 'day_time', 'duration_minute']

        for code in code_list:
            # decode
            attr = Attr()
            attr_vals = code.split(':')
            # decode attr values
            attr_vals[0] = self.USE_CASE_MAP.get(attr_vals[0], attr_vals[0])
            attr_vals[1] = self.DAY_TIME_MAP.get(attr_vals[1], attr_vals[1])

            for attr_name, attr_val in zip(attr_names, attr_vals):
                setattr(attr, attr_name, attr_val)

            attr.use_date = self.use_date
            attr.heat_level = self.heat_level
            attr_objs.append(attr)

        return attr_objs


class GasDB:
    """ Interface for communicating with the `gas_usage` database.
    """
    def add_usage_refill_N(self):
        """ Collect field data.
        """
        # prompt for data lists
        useDate_heatLevel: List[str] = eval(input('Enter use date and heat level\nFormat: [<use date>, <heat level>]: '))
        # useDate_heatLevel = ['2023-06-08', 'average']
        print(useDate_heatLevel)  # SCAFF
        uc_dt_dm: List[str] = eval(input('Enter other data. E.g: [\'B1:M:15\', \'W4:M:12\', \'W4:A:10\']\nFormat: [\'<use case>:<day time>:<duration_minute>\', ...]: '))
        # uc_dt_dm = ['B1:M:15', 'W4:M:12', 'W4:A:10']
        print(uc_dt_dm)  # SCAFF

        decoder = InputDecoder()

        decoder.use_date = useDate_heatLevel[0]
        decoder.heat_level = useDate_heatLevel[1]

        attr_objs = decoder.get_attr_objs(uc_dt_dm)

        # print([attr_obj.__dict__ for attr_obj in attr_objs])  # SCAFF
        # return

        for attr in attr_objs:
            # persist each record
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
                        try:
                            if hasattr(attr, k):
                                click.secho(f'EDITOR: name: {k}, value: {v}', fg='green')  # SCAFF
                                setattr(attr, k, v)
                            else:
                                invalid_attrs.append(k)
                        except ValueError as e:
                            click.secho(f'\n{e.args[0]}', fg='red')
                    if invalid_attrs:
                        click.secho(f'\nInvalid attributes: {invalid_attrs}', fg='red')

                inp = input(f'\n{attr.__dict__}\n\nDo you want to save this data? y or n: ')

            if inp == 'y':
                print('Collation complete! Next...')
                # db = DB()
                try:
                    db.add_usage(Usage1, **attr.__dict__)
                except DataError as exc:
                    print(f'ERROR:', exc.orig)
            else:
                print('Not saved: invalid response input')


gasdb = GasDB()
gasdb.add_usage_refill_N()
inp = input('\nDo you want to save more days\' records? y or n: ')
while inp == 'y':
    gasdb.add_usage_refill_N()
    inp = input('\nDo you want to save more days\' records? y or n: ')

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
