from flask import Flask, render_template, redirect, session, flash
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config["SECRET_KEY"] = "abc123"
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False

app.app_context().push()

toolbar = DebugToolbarExtension(app)

@app.route('/')
def home():
    return render_template('base.html')