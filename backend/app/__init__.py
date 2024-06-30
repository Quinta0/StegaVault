import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()


def create_app():
    app = Flask(__name__)

    # Ensure instance directory exists
    instance_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'instance')
    if not os.path.exists(instance_path):
        os.makedirs(instance_path)

    # Use an absolute path for the SQLite database
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(instance_path, "stegavault.db")}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default_secret_key')

    db.init_app(app)
    bcrypt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    with app.app_context():
        from .routes import auth, passwords
        app.register_blueprint(auth.bp)
        app.register_blueprint(passwords.bp)

        db.create_all()

    return app
