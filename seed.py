from app import db
from models import User, Project


db.drop_all()
db.create_all()
