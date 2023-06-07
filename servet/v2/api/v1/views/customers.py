#!/usr/bin/env python3
''' Views and APIs for customers.'''
from flask import (
        request, render_template, redirect,
        url_for, flash, abort, session, Blueprint,
        current_app, jsonify, make_response
        )
# from models import db, Customers, is_safe_url
from flask_login import (
        login_user, logout_user, login_required, current_user
        )
from werkzeug.security import check_password_hash
from uuid import uuid4
from os import getenv

cus_apis = Blueprint(
        'cus_apis', __name__, url_prefix='/api/v1/customers')

testing = getenv('testing', '')


if testing:
    @cus_apis.route('/login')
    def login_get():
        ''' Return the login form view.'''
        return render_template('cus_apis/login.html')


@cus_apis.route('/login', methods=['POST'])
def login_post():
    ''' Authenticate posted login information, and log customer in.
    '''
    from api.v1.views import db, Customers, is_safe_url
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
        flash("Invalid username and/or password", "invalid_usr_pwd")
        if testing:
            # Redirect to login page to try again
            # return redirect(url_for('cus_apis.login_get'))
            pass
        return make_response(jsonify({"login": False}), 401)

    # Customer exists and is authenticated
    session['account_type'] = 'customer'
    login_user(cus, remember=remember)  # log in the user into session

    # flash('Logged in successfully.')

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

    if testing:
        # return redirect(nextp or url_for('cus_apis.profile', id=cus.id))
        pass

    return jsonify({"login": True})  # status code 200


if testing:
    @cus_apis.route('/<id>/profile')
    @login_required
    def profile(id):
        ''' Customer profile endpoint.
        '''
        return render_template('cus_apis/profile.html')


if testing:
    @cus_apis.route('/<id>/profile/edit')
    @login_required
    def profile_edit_get(id):
        ''' Returns customer profile editing form.
        '''
        return render_template('cus_apis/profile_edit.html', id=id, n=str(uuid4()))


@cus_apis.route('/<id>/profile/edit', methods=['POST', 'PUT'])
def profile_edit_put(id):
    ''' Processes form data to update a customer's record.
    '''
    from api.v1.views import db, Customers
    # Collect update details
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    email = request.form.get('email')  # unique
    phone = request.form.get('phone')  # unique
    username = request.form.get('username') # must be unique in storage
    # todo: validate and save image to file system :done VSFS
    image = request.files.get(
            'profile_pic')  # file object representing image data

    # Retrieve customer object from database
    stmt = db.select(Customers).where(Customers.id==id)
    existing_cus = db.session.scalars(stmt).first()

    # Validate username
    if username:
        stmt = db.select(Customers).where(Customers.username==username)
        cus = db.session.scalars(stmt).first()
        if not existing_cus.username==username and cus:
            # username already exists
            flash(
                    'username already exists. Please try another',
                    'username_exists'
                    )  # include message category
            if testing:
                # return redirect(url_for('cus_apis.profile_edit_get', id=id, n=str(uuid4())))
                pass
            return make_response(jsonify({"profile_edited": False}), 400)
        existing_cus.username = username

    if not username:
        old_username = existing_cus.username

    # Set image identifier
    if image.filename or username:
        # If the user does not select a file, the browser submits an...
        # ...empty file without a filename ('').
        if username:
            image_uri = current_app.config["CUS_IMAGE_RPATH"] + username + '.jpg'
        else:
            # New profile pic but old username
            image_uri = current_app.config["CUS_IMAGE_RPATH"] + old_username + '.jpg'
        # todo: implement deleting image files...
        # ...redundant as a result of a change of usernames
    else:
        image_uri = None

    # Validate email
    if email:
        stmt = db.select(Customers).where(Customers.email==email)
        cus = db.session.scalars(stmt).first()
        if not existing_cus.email==email and cus:
            # email already exists
            flash('email already exists. Please try another', 'email_exists')
            if testing:
                # return redirect(url_for('cus_apis.profile_edit_get', id=id, n=str(uuid4())))
                pass
            return make_response(jsonify({"profile_edited": False}), 400)
        existing_cus.email = email

    # Validate phone
    if phone:
        stmt = db.select(Customers).where(Customers.phone==phone)
        cus = db.session.scalars(stmt).first()
        if not existing_cus.phone==phone and cus:
            # phone number already exists
            flash('phone already exists. Please try another', 'phone_exists')
            if testing:
                # return redirect(url_for('cus_apis.profile_edit_get', id=id, n=str(uuid4())))
                pass
            return make_response(jsonify({"profile_edited": False}), 400)
        existing_cus.phone = phone

    # Update customer record with validated data
    if first_name:
        existing_cus.first_name = first_name
    if last_name:
        existing_cus.last_name = last_name
    if image_uri:
        existing_cus.image_uri = image_uri

    db.session.add(existing_cus)
    db.session.commit()

    # Save image to file system ONLY now
    if image.filename:
        image.save(
                current_app.config["CUS_IMAGE_PATH"] + username + '.jpg'
                )  # VSFS

    if testing:
        # return redirect(url_for('cus_apis.profile', id=id))
        pass

    return make_response(jsonify({"profile_edited": True}))


if testing:
    @cus_apis.route('/')
    def index():
        ''' Endpoint for site homepage.
        '''
        return render_template('base.html')


@cus_apis.route('/logout')
@login_required
def logout():
    ''' Log a sign-in user out of the session.
    '''
    logout_user()
    if testing:
        # return redirect(url_for('cus_apis.index'))
        pass

    return make_response(jsonify({"logout": True}))


if testing:
    @cus_apis.route('/signup')
    def signup_get():
        ''' Return signup form.'''
        return render_template('cus_apis/signup.html', n=str(uuid4()))


@cus_apis.route('/signup', methods=['POST', 'PUT'])
def signup_post():
    ''' Process customer registration.
    '''
    from api.v1.views import db, Customers
    # Collect registration details
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    email = request.form.get('email')  # unique
    phone = request.form.get('phone')  # unique
    username = request.form.get('username') # must be unique in storage
    password = request.form.get('password')
    # todo: validate and save image to file system :done VSFS
    image = request.files.get(
            'profile_pic')  # file object representing image data

    # Validate username
    stmt = db.select(Customers).where(Customers.username==username)
    cus = db.session.scalars(stmt).first()
    if cus:
        # username already exists
        flash(
                'username already exists. Please try another',
                'username_exists'
                )  # include message category
        if testing:
            # return redirect(url_for('cus_apis.signup_get', id=str(uuid4())))
            pass
        return make_response(jsonify({"signup": False}), 400)
    # else set image identifier
    if image.filename:
        # If the user does not select a file, the browser submits an...
        # ...empty file without a filename ('').
        image_uri = current_app.config["CUS_IMAGE_RPATH"] + username + '.jpg'
    else:
        image_uri = None

    # Validate email
    stmt = db.select(Customers).where(Customers.email==email)
    cus = db.session.scalars(stmt).first()
    if cus:
        # username already exists
        flash('email already exists. Please try another', 'email_exists')
        if testing:
            # return redirect(url_for('cus_apis.signup_get', id=str(uuid4())))
            pass
        return make_response(jsonify({"signup": False}), 400)

    # Validate phone
    stmt = db.select(Customers).where(Customers.phone==phone)
    cus = db.session.scalars(stmt).first()
    if cus:
        # phone number already exists
        flash('phone already exists. Please try another', 'phone_exists')
        if testing:
            # return redirect(url_for('cus_apis.signup_get', id=str(uuid4())))
            pass
        return make_response(jsonify({"signup": False}), 400)

    # Persist validated data to database
    new_cus = Customers(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            username=username,
            password=password,
            image_uri=image_uri
            )
    db.session.add(new_cus)
    db.session.commit()

    # Save image to file system ONLY now
    if image.filename:
        image.save(
                current_app.config["CUS_IMAGE_PATH"] + username + '.jpg'
                )  # VSFS

    if testing:
        # return redirect(url_for('cus_apis.login_get'))
        pass

    return make_response(jsonify({"signup": True}), 200)


@cus_apis.route('<id>/static/<path:uri>')
def static_get(id, uri):
    ''' Endpoint for static file requests.
    '''
    return redirect(url_for('static', filename=uri))
