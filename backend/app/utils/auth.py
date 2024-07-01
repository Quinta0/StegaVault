from functools import wraps
from flask import request, jsonify
import jwt
from ..models.user import User
from flask import current_app
from ..models.blacklist import Blacklist


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            current_app.logger.error("Token is missing")
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_app.logger.info(f"Token decoded successfully for user_id: {data['user_id']}")
            current_user = User.query.filter_by(id=data['user_id']).first()
            if not current_user:
                current_app.logger.error(f"User not found in database for id: {data['user_id']}")
                raise Exception('User not found')
            current_app.logger.info(f"User authenticated: {current_user.id}")
        except Exception as e:
            current_app.logger.error(f"Token is invalid: {str(e)}")
            return jsonify({'message': f'Token is invalid! {str(e)}'}), 401
        return f(current_user, *args, **kwargs)
    return decorated