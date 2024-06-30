from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from ..models.user import User
from ..models.blacklist import Blacklist
from .. import db
import jwt
from datetime import datetime, timedelta
from functools import wraps

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


@bp.route('/logout', methods=['POST'])
def logout():
    token = request.headers.get('Authorization').split(" ")[1]

    # Blacklist the token
    blacklisted_token = Blacklist(token=token)
    db.session.add(blacklisted_token)
    db.session.commit()

    return jsonify({"message": "Logout successful"}), 200


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            blacklisted_token = Blacklist.query.filter_by(token=token).first()
            if blacklisted_token:
                return jsonify({'message': 'Token has been blacklisted!'}), 401

            current_user = User.query.filter_by(id=data['user_id']).first()
        except Exception as e:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated


@bp.route('/dashboard', methods=['GET'])
@token_required
def dashboard(current_user):
    return jsonify({'message': f'Welcome to the dashboard, {current_user.username}!'})
