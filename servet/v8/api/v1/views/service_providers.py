#!/usr/bin/env python3
''' Views and APIs for service providers.'''
from flask import (
        request, render_template, redirect,
        url_for, flash, abort, session, Blueprint,
        current_app
        )
# from models import db, Customers, is_safe_url
from flask_login import (
        login_user, logout_user, login_required, current_user
        )
from werkzeug.security import check_password_hash
from uuid import uuid4

# Blueprint for service provider authentication views
sp_auth_views = Blueprint(
        'sp_auth_views', __name__, url_prefix='/serviceProviders'
        )


@sp_auth_views.route('/login')
def sp_login():
    ''' Return the login form view.'''
    return render_template('sp_auth/login.html')


@sp_auth_views.route('/login', methods=['POST'])
def sp_login_post():
    ''' Authenticate posted login information, and log servuce provider in.
    '''
    from api.v1.views import db, ServiceProviders, is_safe_url
    # Retrieve provided login information
    username = request.form.get('username')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False

    # Verify that service provider is registered
    stmt = db.select(ServiceProviders).where(ServiceProviders.username==username)
    row = db.session.execute(stmt).first()  # returns Row object or None
    if row:
        # Valid username
        sp = row[0]
    else:
        sp = None

    # Handle failed authentication
    if not sp or not check_password_hash(sp.password, password):
        # Flash an error message to display
        flash("Invalid username and/or password", "invalid_usr_pwd")
        # Redirect to login page to try again
        return redirect(url_for('sp_auth_views.sp_login'))

    # Service provider exists and is authenticated
    session['account_type'] = 'service_provider'
    login_user(sp, remember=remember)  # log in the user into session

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

    return redirect(nextp or url_for('sp_auth_views.sp_profile', id=sp.id))


@sp_auth_views.route('/<id>/profile')
@login_required
def sp_profile(id):
    ''' Service provider profile endpoint.
    '''
    return render_template('sp_auth/profile.html')


@sp_auth_views.route('/<id>/profile/edit')
@login_required
def sp_profile_get(id):
    ''' Returns service provider profile-editing form.
    '''
    # fetch all locations for testing; should later be removed
    from api.v1.views import Locations, db
    stmt = db.select(Locations)
    locations = db.session.scalars(stmt).all()
    return render_template('sp_auth/profile_edit.html', id=id, n=str(uuid4()), locations=locations)


@sp_auth_views.route('/<id>/profile/edit', methods=['POST'])
def sp_profile_put(id):
    ''' Processes form data to update a service provider's record.
    '''
    from api.v1.views import db, ServiceProviders
    # Collect update details
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    email = request.form.get('email')  # unique
    phone = request.form.get('phone')  # unique
    username = request.form.get('username') # must be unique in storage
    location_id = request.form.get('location')
    whatsapp = request.form.get('whatsapp')
    # todo: validate and save image to file system :done VSFS
    image = request.files.get(
            'profile_pic')  # file object representing image data

    # Retrieve service provider object from database
    stmt = db.select(ServiceProviders).where(ServiceProviders.id==id)
    existing_sp = db.session.scalars(stmt).first()

    # Validate username
    if username:
        stmt = db.select(ServiceProviders).where(ServiceProviders.username==username)
        sp = db.session.scalars(stmt).first()
        if not existing_sp.username==username and sp:
            # username already exists
            flash(
                    'username already exists. Please try another',
                    'username_exists'
                    )  # include message category
            return redirect(url_for('sp_auth_views.sp_profile_get', id=id, n=str(uuid4())))
        existing_sp.username = username

    if not username:
        old_username = existing_sp.username

    # Set image identifier
    if image.filename or username:
        # If the user does not select a file, the browser submits an...
        # ...empty file without a filename ('').
        if username:
            image_uri = current_app.config["SP_IMAGE_RPATH"] + username + '.jpg'
        else:
            # New profile pic but old username
            image_uri = current_app.config["SP_IMAGE_RPATH"] + old_username + '.jpg'
        # todo: implement deleting image files...
        # ...redundant as a result of a change of usernames
    else:
        image_uri = None

    # Validate email
    if email:
        stmt = db.select(ServiceProviders).where(ServiceProviders.email==email)
        sp = db.session.scalars(stmt).first()
        if not existing_sp.email==email and sp:
            # email already exists
            flash('email already exists. Please try another', 'email_exists')
            return redirect(url_for('sp_auth_views.sp_profile_get', id=id, n=str(uuid4())))
        existing_sp.email = email

    # Validate phone
    if phone:
        stmt = db.select(ServiceProviders).where(ServiceProviders.phone==phone)
        sp = db.session.scalars(stmt).first()
        if not existing_sp.phone==phone and sp:
            # phone number already exists
            flash('phone already exists. Please try another', 'phone_exists')
            return redirect(url_for('sp_auth_views.sp_profile_get', id=id, n=str(uuid4())))
        existing_sp.phone = phone

    # Update service provider record with validated data
    if first_name:
        existing_sp.first_name = first_name
    if last_name:
        existing_sp.last_name = last_name
    if image_uri:
        existing_sp.image_uri = image_uri
    if location_id:
        existing_sp.location_id = int(location_id)
    if whatsapp:
        existing_sp.whatsapp = whatsapp

    db.session.add(existing_sp)
    db.session.commit()

    # Save image to file system ONLY now
    if image.filename:
        image.save(
                current_app.config["SP_IMAGE_PATH"] + username + '.jpg'
                )  # VSFS

    return redirect(url_for('sp_auth_views.sp_profile', id=id))


@sp_auth_views.route('/')
def sp_index():
    ''' Endpoint for site homepage.
    '''
    return render_template('baseSP.html')


@sp_auth_views.route('/logout')
@login_required
def sp_logout():
    ''' Log a sign-in user out of the session.
    '''
    logout_user()
    return redirect(url_for('sp_auth_views.sp_index'))


@sp_auth_views.route('/signup')
def sp_signup():
    ''' Return signup form.'''
    # Retrieve all locations; for testing and should later be removed
    from api.v1.views import Locations, db
    stmt = db.select(Locations)
    locations = db.session.scalars(stmt).all()
    return render_template('sp_auth/signup.html', val=str(uuid4()), locations=locations)


@sp_auth_views.route('/signup', methods=['POST'])
def sp_signup_post():
    ''' Process service provider registration.
    '''
    from api.v1.views import db, ServiceProviders
    # Collect registration details
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    email = request.form.get('email')  # unique
    phone = request.form.get('phone')  # unique
    username = request.form.get('username') # must be unique in storage
    password = request.form.get('password')
    location_id = request.form.get('location')
    whatsapp = request.form.get('whatsapp')
    # todo: validate and save image to file system :done VSFS
    image = request.files.get(
            'profile_pic')  # file object representing image data

    # Validate username
    stmt = db.select(ServiceProviders).where(ServiceProviders.username==username)
    sp = db.session.scalars(stmt).first()
    if sp:
        # username already exists
        flash(
                'username already exists. Please try another',
                'username_exists'
                )  # include message category
        return redirect(url_for('sp_auth_views.sp_signup', id=str(uuid4())))
    # else set image identifier
    if image.filename:
        # If the user does not select a file, the browser submits an...
        # ...empty file without a filename ('').
        image_uri = current_app.config["SP_IMAGE_RPATH"] + username + '.jpg'
    else:
        image_uri = None

    # Validate email
    stmt = db.select(ServiceProviders).where(ServiceProviders.email==email)
    sp = db.session.scalars(stmt).first()
    if sp:
        # username already exists
        flash('email already exists. Please try another', 'email_exists')
        return redirect(url_for('sp_auth_views.sp_signup', id=str(uuid4())))

    # Validate phone
    stmt = db.select(ServiceProviders).where(ServiceProviders.phone==phone)
    sp = db.session.scalars(stmt).first()
    if sp:
        # phone number already exists
        flash('phone already exists. Please try another', 'phone_exists')
        return redirect(url_for('sp_auth_views.sp_signup', id=str(uuid4())))

    # Persist validated data to database
    new_sp = ServiceProviders(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            username=username,
            password=password,
            image_uri=image_uri,
            location_id=int(location_id),
            whatsapp=whatsapp
            )
    db.session.add(new_sp)
    db.session.commit()

    # Save image to file system ONLY now
    if image.filename:
        image.save(
                current_app.config["SP_IMAGE_PATH"] + username + '.jpg'
                )  # VSFS

    return redirect(url_for('sp_auth_views.sp_login'))


@sp_auth_views.route('<id>/static/<path:uri>')
def sp_static(id, uri):
    ''' Endpoint for static file requests.
    '''
    return redirect(url_for('static', filename=uri))
