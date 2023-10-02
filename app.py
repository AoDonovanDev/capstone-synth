import os
import json

from flask import Flask, render_template, redirect, session, flash, g, request
from sqlalchemy.exc import IntegrityError
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User, Project
from forms import UserAddForm, LoginForm, NewProjectForm
from secret import secret

CURR_USER_KEY = "curr_user"

app = Flask(__name__)
print('server start')

app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', secret))
connect_db(app)
app.app_context().push()

app.config["SECRET_KEY"] = "abc123"
app.config["SESSION_COOKIE_SECURE"] = False
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False


toolbar = DebugToolbarExtension(app)






@app.before_request
def add_user_to_g():
    """If we're logged in, add curr user to Flask global."""

    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])

    else:
        g.user = None



@app.route('/')
def home():
    if g.user:
        user = User.query.get(session['curr_user'])
        projects = user.projects
        if not user.projects:
            form = NewProjectForm()
            return render_template('new.html', form=form)
        return render_template('sequencerv2.html', user=user, projects=projects, selectedProject=projects[0])
    else:
        print('splash')
        return render_template('splash.html')


def do_login(user):
    """Log in user."""

    session[CURR_USER_KEY] = user.id
    print('logged in')


def do_logout():
    """Logout user."""

    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]
    print('logged out')


@app.route('/signup', methods=["GET", "POST"])
def signup():
    """Handle user signup.

    Create new user and add to DB. Redirect to home page.

    If form not valid, present form.

    If the there already is a user with that username: flash message
    and re-present form.
    """
    print('signup')
    form = UserAddForm()

    if form.validate_on_submit():
        print('form valid')
        try:
            user = User.signup(
                username=form.username.data,
                password=form.password.data,
                email=form.email.data,
                image_url=form.image_url.data or User.image_url.default.arg,
            )
            db.session.commit()
            print('user created')

        except:
            print('exception')
            flash("Username already taken", 'danger')
            return render_template('signup.html', form=form)

        do_login(user)

        return redirect("/")

    else:
        return render_template('signup.html', form=form)
    
@app.route('/login', methods=["GET", "POST"])
def login():
    """Handle user login."""
    print('login')

    form = LoginForm()
    if form.validate_on_submit():
        try:
            user = User.authenticate(form.username.data, form.password.data)
            print('form valid')
            if 'csrf_token' in session:
                print('form csrf:', form.data['csrf_token'])
                print('session csrf:', session['csrf_token'])
            if user:
                do_login(user)
                flash(f"Hello, {user.username}!", "success")
                return redirect("/")
        except Exception as e:
            print(e, 'User model could not authenticate')
    flash("Invalid credentials.", 'danger')
    print('form not valid')
    print('form data:', form.data)
    print('form errors:', form.errors)
    if 'csrf_token' in session:
        print('form csrf:', form.data['csrf_token'])
        print('session csrf:', session['csrf_token'])
    return render_template('login.html', form=form)


@app.route('/logout')
def logout():
    """Handle logout of user."""

    do_logout()
    flash('you have logged out')
    return redirect('/')

@app.route('/save', methods=['post'])
def save():
    """ save current project data """
    proj_data = json.loads(request.values['projData'])
    name = proj_data['name']
    proj_data = json.dumps(proj_data)
    existing = Project.query.filter(Project.name == name).one_or_none()
    if existing:
            existing.proj_data = proj_data
            db.session.add(existing)
            db.session.commit()
            return redirect(f'/projects/{existing.id}')
    project = Project(proj_data = proj_data, user_id = g.user.id, name=name)
    db.session.add(project)
    db.session.commit()
    return redirect(f'/projects/{project.id}')

@app.route('/projects/<int:id>')
def project(id):
    project = Project.query.get(id)
    if g.user:
        user = User.query.get(session['curr_user'])
        projects = user.projects
        return render_template('sequencerv2.html', user=user, projects=projects, selectedProject=project)
    else:
        return render_template('splash.html')
    
@app.route('/new', methods=['get', 'post'])
def new():
    form = NewProjectForm()
    if not g.user:
        return render_template('splash.html')
    user = User.query.get(session['curr_user'])
    projects = user.projects
    if form.validate_on_submit():
        name = form.name.data
        tuning = form.tuning.data
        newProj = json.dumps({
            'name': name,
            'tuning': tuning
        })
        return render_template('sequencerv2.html',  newProj=newProj, user=user, projects=projects)
    return render_template('new.html', form=form)