#!/usr/bin/env python3
''' Views and APIs for customers.'''
from api.v1.views import cus_auth_views, cus_apis, login_manager
from flask import (
        request, render_template, redirect, url_for, flash, abort, session)
from models import db, app, Customers, is_safe_url
from flask_login import (
        login_user, logout_user, login_required, current_user)
from werkzeug.security import check_password_hash

'''
# Create login manager for customers
cus_login_manager = LoginManager()
cus_login_manager.login_view = 'cus_auth_views.login'
cus_login_manager.init_app(app)
'''


@cus_auth_views.route('/login')
def cus_login():
    ''' Return the login form view.'''
    return render_template('cus_auth/login.html')


@cus_auth_views.route('/login', methods=['POST'])
def cus_login_post():
    ''' Authenticate posted login information, and log customer in.
    '''
    # Retrieve provided login information
    username = request.form.get('username')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False

    # Verify that customer is registered
    stmt = db.select(Customers).where(Customers.username==username)
    row = db.session.execute(stmt).first()  # returns Row object or None
    if row:
        # Valid username
        cus = row[0]
    else:
        cus = None

    # Handle failed authentication
    if not cus or not check_password_hash(cus.password, password):
        # Flash an error message to display
        flash("Invalid username and/or password")
        # Redirect to login page to try again
        return redirect(url_for('cus_auth_views.cus_login'))

    # Customer exists and is authenticated
    session['account_type'] = 'customer'
    login_user(cus, remember=remember)  # log in the user into session

    flash('Logged in successfully.')

    # Retrieve next URL, if available
    nextp = request.args.get('next')
    '''
    When a logged-out user tries to access a protected page (login_required),
    they get redirected to login, and a `next` query string parameter is
    attached to the URL of the POST login link. The value of this parameter is
    the URL the user attempted to visit before redirection.
    '''

    # Protect against Open Redirect attacks
    if not is_safe_url(nextp):
        abort(400, description="`next` URL not safe")

    return redirect(nextp or url_for('cus_auth_views.cus_profile'))


@cus_auth_views.route('/profile')
def cus_profile():
    ''' Customer profile endpoint.
    '''
    return f'<center style="background-color: green; color: white">This is your profile page of type -> {session["account_type"]}!</center>'


@cus_auth_views.route('/')
def cus_index():
    return render_template('index.html')


@cus_auth_views.route('/logout')
def cus_logout():
    logout_user()
    return redirect(url_for('cus_auth_views.cus_index'))


@cus_auth_views.route('/signup')
def cus_signup():
    return render_template('cus_auth/signup.html')
