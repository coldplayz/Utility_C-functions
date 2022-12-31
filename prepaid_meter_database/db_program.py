#!/usr/bin/env python3
'''
Program for interfacing with the b2_prepaid_meter database.
'''

from sqlalchemy import create_engine, func, cast
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import sys
from sqlalchemy import create_engine
from user import Base, User
from appliance import Appliance
from user_appliance import UserAppliance
from transaction import Transaction
from bill import Bill
from payment import Payment
from flag import Flag

engine = create_engine(
        'mysql+mysqldb://Bel2:44384439@localhost/b2_prepaid_meter',
        pool_pre_ping=True)

Session = sessionmaker(bind=engine)


def display_flag(operation=None):
    ''' Display all operation flags, or a specific one.
        Args:
            operation (str): string representing the name of a table on which
            an applicable operation is being carried out. Defaults to None.
    '''
    sess = Session()
    try:
        if operation:
            # A specified operation
            qobj = sess.query(Flag.operation, Flag.flag).filter(Flag.operation == operation)
            row = qobj.one()  # get the single record returned

            print('operation\tflag')
            print('=========\t====')
            if len(row.operation) < 8:
                print(f'\n{row.operation}\t\t{row.flag}')
            else:
                print(f'\n{row.operation}\t{row.flag}')
        else:
            # Display all flags
            qobj = sess.query(Flag.operation, Flag.flag)
            rows = qobj.all()

            print('operation\tflag')
            print('=========\t====')
            for row in rows:
                if len(row.operation) < 8:
                    print(f'\n{row.operation}\t\t{row.flag}')
                else:
                    print(f'\n{row.operation}\t{row.flag}')
    except Exception as e:
        raise e
    finally:
        sess.close()


def set_flag(operation, flag):
    ''' Set the boolean flag for a table operation.
        Args:
            operation (str): table operation string
            flag (bool): True or False flag.
    '''
    sess = Session()
    try:
        # Get record to update
        qobj = sess.query(Flag).filter(Flag.operation == operation)
        # Retrieve the one returned object
        rec = qobj.one()
        # Modify returned object
        rec.flag = flag

        sess.add(rec)
        sess.commit()
    except Exception as e:
        raise e
    finally:
        sess.close()

# Parse command
try:
    cmd = sys.argv[1]
except IndexError:
    # Show commands list.
    with open('cmd_list', 'r', encoding='utf-8') as hlp:
        lines = hlp.readlines()
        print(f'{"".join(["#" for i in range(23)])}\n# Available commands. #\n#######################\n')
        for line in lines:
            print(line)
    sys.exit(0)

match cmd:
    case '-nu':
        # Create new User object
        newUser = User.new_user()
        # Set flag to indicate on-going user-creation operations
        set_flag('users', True)
        # Create database session
        sess = Session()
        try:
            sess.add(newUser)
            sess.commit()
        except Exception as e:
            raise e
        finally:
            sess.close()
    case '-uc':
        # Set flag to indicate completion of insertion operations on users table.
        set_flag('users', False)
    case '-na':
        # Add new appliance
        newAppliance = Appliance.new_appliance()
        set_flag('appliances', True)
        sess = Session()
        try:
            sess.add(newAppliance)
            sess.commit()
        except Exception as e:
            raise e
        finally:
            sess.close()
    case '-ac':
        set_flag('appliances', False)
    case '-df':
        # Display flag(s)
        try:
            op = sys.argv[2]
        except IndexError:
            op = None

        display_flag(operation=op)
    case '-sf':
        ''' Flag-setting is meant to be an
        internal logic, and not to have an external
        interface. This interface is meant for testing purposes.
        '''
        op = sys.argv[2]
        flag = True if sys.argv[3] == 'True' else False
        set_flag(op, flag)
    case _:
        pass
