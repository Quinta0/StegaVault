from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from ..models.user import User
from .. import db
import jwt
from datetime import datetime, timedelta
from flask import current_app

bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Check if user already exists
    user = User.query.filter_by(username=data['username']).first()
    if user:
        return jsonify({"message": "Username already exists"}), 400

    # Create new user
    new_user = User(
        username=data['username'],
        password_hash=generate_password_hash(data['password'])
    )

    # Add user to database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    user = User.query.filter_by(username=data['username']).first()

    if user and check_password_hash(user.password_hash, data['password']):
        # Generate token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, current_app.config['SECRET_KEY'])

        return jsonify({
            "message": "Login successful",
            "token": token
        }), 200

    return jsonify({"message": "Invalid username or password"}), 401
