#!/usr/bin/env python3
''' Views and APIs for service providers.'''
from flask import (
        request, render_template, redirect,
        url_for, flash, abort, session, Blueprint,
        current_app, jsonify, make_response
        )
# from models import db, Customers, is_safe_url
from flask_login import (
        login_user, logout_user, login_required, current_user
        )
from api.v1.views import (
        db, ServiceProviders, ServiceCategories,
        ServiceProviderServices, Countries, States, Locations,
        Reviews, Customers
        )
from werkzeug.security import check_password_hash
from uuid import uuid4
from os import getenv

testing = getenv('testing', '')

# Blueprint for service provider authentication views
sp_apis = Blueprint(
        'sp_apis', __name__, url_prefix='/api/v1/serviceProviders'
        )


if testing:
    @sp_apis.route('/login')
    def login():
        ''' Return the login form view.'''
        return render_template('sp_apis/login.html')


@sp_apis.route('/login', methods=['POST', 'PUT'])
def login_post():
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
        if testing:
            # Redirect to login page to try again
            # return redirect(url_for('sp_auth_views.sp_login'))
            pass
        return make_response(jsonify({"logout": False}), 401)

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

    if testing:
        # return redirect(nextp or url_for('sp_apis.profile', id=sp.id))
        pass

    return make_response(jsonify({"login": True}), 200)


if testing:
    @sp_apis.route('/<id>/profile')
    @login_required
    def profile(id):
        ''' Service provider profile endpoint.
        '''
        # Retrieve all services offerred by the service provider
        stmt = db.select(ServiceProviderServices).join(ServiceProviders).where(ServiceProviders.id==id)
        services = db.session.scalars(stmt).all()

        return render_template('sp_apis/profile.html', services=services)


if testing:
    @sp_apis.route('/<id>/profile/edit')
    @login_required
    def profile_edit_get(id):
        ''' Returns service provider profile-editing form.
        '''
        # fetch all locations for testing; should later be removed
        from api.v1.views import Locations, db
        stmt = db.select(Locations)
        locations = db.session.scalars(stmt).all()
        return render_template('sp_apis/profile_edit.html', id=id, n=str(uuid4()), locations=locations)


@sp_apis.route('/<id>/profile/edit', methods=['POST', 'PUT'])
def profile_edit_put(id):
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
            if testing:
                # return redirect(url_for('sp_apis.profile_edit_get', id=id, n=str(uuid4())))
                pass
            return make_response(jsonify({"profile_edit": False}), 400)
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
            if testing:
                # return redirect(url_for('sp_apis.profile_edit_get', id=id, n=str(uuid4())))
                pass
            return make_response(jsonify({"profile_edit": False}), 400)
        existing_sp.email = email

    # Validate phone
    if phone:
        stmt = db.select(ServiceProviders).where(ServiceProviders.phone==phone)
        sp = db.session.scalars(stmt).first()
        if not existing_sp.phone==phone and sp:
            # phone number already exists
            flash('phone already exists. Please try another', 'phone_exists')
            if testing:
                # return redirect(url_for('sp_apis.profile_edit_get', id=id, n=str(uuid4())))
                pass
            return make_response(jsonify({"profile_edit": False}), 400)
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

    if testing:
        # return redirect(url_for('sp_apis.profile', id=id))
        pass

    return make_response(jsonify({"profile_edit": True}))


if testing:
    @sp_apis.route('/')
    def index():
        ''' Endpoint for site homepage.
        '''
        return render_template('base.html', n=str(uuid4()))


@sp_apis.route('/logout')
@login_required
def logout():
    ''' Log a sign-in user out of the session.
    '''
    logout_user()
    if testing:
        # return redirect(url_for('sp_auth_views.sp_index'))
        pass

    return make_response(jsonify({"logout": True}))


@sp_apis.route('/signup')
def signup_get():
    ''' Return signup form.'''
    # Retrieve all locations; for testing and should later be removed
    from api.v1.views import Locations, db
    stmt = db.select(Locations)
    locations = db.session.scalars(stmt).all()
    return render_template('sp_apis/signup.html', n=str(uuid4()), locations=locations)


@sp_apis.route('/signup', methods=['POST'])
def signup_post():
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
        if testing:
            # return redirect(url_for('sp_apis.signup_get', id=str(uuid4())))
            pass
        return make_response(jsonify({"signup": False}), 400)
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
        if testing:
            # return redirect(url_for('sp_apis.signup_get', id=str(uuid4())))
            pass
        return make_response(jsonify({"signup": False}), 400)

    # Validate phone
    stmt = db.select(ServiceProviders).where(ServiceProviders.phone==phone)
    sp = db.session.scalars(stmt).first()
    if sp:
        # phone number already exists
        flash('phone already exists. Please try another', 'phone_exists')
        if testing:
            # return redirect(url_for('sp_apis.signup_get', id=str(uuid4())))
            pass
        return make_response(jsonify({"signup": False}), 400)

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

    if testing:
        # return redirect(url_for('sp_apis.login'))
        pass

    return make_response(jsonify({"signup": True}))


@sp_apis.route('<id>/static/<path:uri>')
def static_get(id, uri):
    ''' Endpoint for static file requests.
    '''
    return redirect(url_for('static', filename=uri))


################----JSON APIs----###############

@sp_apis.route('/<sp_id>/services')
@login_required
def service_one_get(sp_id):
    ''' Returns the IDs of a service-provider's services.
    '''
    # Fetch service IDs
    stmt = db.select(ServiceProviderServices.id).join(ServiceProviders).where(ServiceProviders.id==sp_id)
    ids_list = db.session.scalars(stmt).all()
    '''
    since only one column is selected, use scalars() to fetch first items
    '''

    return jsonify(ids_list)


@sp_apis.route('/<sp_id>/services/create', methods=['POST'])
@login_required
def service_create_post(sp_id):
    ''' Process form data to create a new service-provider service.
    '''
    # Retrieve form data
    service_description = request.form.get('service_description')
    serviceCategory_id = request.form.get('service_category')  # for F.Key
    image = request.files.get('profile_pic')

    # Create new service-provider service object
    new_sps = ServiceProviderServices(service_description=service_description, serviceProvider_id=sp_id, serviceCategory_id=serviceCategory_id)
    ''' defer saving image_uri until ID is available.'''

    # Commit to get ID before processing image
    db.session.add(new_sps)
    db.session.commit()

    # Get new record's ID
    new_id = new_sps.id

    # Use the id to save the image and its URI
    if image.filename:
        # filename will be empty if no file selected
        image_uri = current_app.config["SPS_IMAGE_RPATH"] + str(new_id) + '.jpg'
        new_sps.image_uri = image_uri
        # Persist to database
        db.session.add(new_sps)
        db.session.commit()
        image.save(current_app.config["SPS_IMAGE_PATH"] + str(new_id) + '.jpg')

    json_data = {"sps_id": new_id}

    return jsonify(json_data)


if testing:
    @sp_apis.route('/<sp_id>/services/create')
    @login_required
    def service_create_get(sp_id):
        ''' Returns the service-creation form.
        '''
        # get all service categories; for testing
        stmt = db.select(ServiceCategories)
        categories = db.session.scalars(stmt).all()

        return render_template('sps_apis/service_create.html', categories=categories, n=str(uuid4()))


@sp_apis.route('/<sp_id>/services/<int:sps_id>/edit', methods=['POST', 'PUT'])
@login_required
def service_edit_put(sp_id, sps_id):
    ''' Process form data to update service-provider service.
    '''
    # Retrieve form data
    service_description = request.form.get('service_description')
    serviceCategory_id = request.form.get('service_category')  # for F.Key
    image = request.files.get('profile_pic')

    # Retrieve existing service-provider service object
    stmt = db.select(ServiceProviderServices).where(ServiceProviderServices.id==sps_id)
    existing_sps = db.session.scalars(stmt).one()  # expecting only one entity

    if service_description:
        existing_sps.service_description = service_description
    if serviceCategory_id:
        existing_sps.serviceCategory_id = int(serviceCategory_id)

    # Use the id to save the image and its URI
    if image.filename:
        # new image; filename will be empty if not so
        image_uri = current_app.config["SPS_IMAGE_RPATH"] + str(new_id) + '.jpg'
        existing_sps.image_uri = image_uri
        image.save(current_app.config["SPS_IMAGE_PATH"] + str(new_id) + '.jpg')

    # Persist to database
    db.session.add(existing_sps)
    db.session.commit()

    json_data = {"sps_edit": True}

    return jsonify(json_data)


if testing:
    @sp_apis.route('/<sp_id>/services/<int:sps_id>/edit')
    @login_required
    def service_edit_get(sp_id, sps_id):
        ''' Returns a service-editing form.
        '''
        # get all service categories; for testing
        stmt = db.select(ServiceCategories)
        categories = db.session.scalars(stmt).all()

        return render_template('sp_apis/service_edit.html', categories=categories, sps_id=sps_id, n=str(uuid4()))
