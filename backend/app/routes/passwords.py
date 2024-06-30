from flask import Blueprint, request, jsonify, current_app
from ..models.password import Password
from .. import db
from ..services.stenography import hide_password, retrieve_password  # Use relative import
from ..services.encryption import encrypt_password, decrypt_password
from ..utils.auth import token_required

bp = Blueprint('passwords', __name__, url_prefix='/api/passwords')

@bp.route('/', methods=['POST'])
@token_required
def add_password(current_user):
    data = request.get_json()
    encrypted_password = encrypt_password(data['password'])
    image_path = hide_password(encrypted_password, data['image'])

    new_password = Password(
        user_id=current_user.id,
        site=data['site'],
        username=data['username'],
        encrypted_password=encrypted_password,
        image_path=image_path
    )
    db.session.add(new_password)
    db.session.commit()
    return jsonify({"message": "Password added successfully"}), 201

@bp.route('/', methods=['GET'])
@token_required
def get_passwords(current_user):
    passwords = Password.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        'id': p.id,
        'site': p.site,
        'username': p.username,
        'image_path': p.image_path
    } for p in passwords]), 200

@bp.route('/<int:id>', methods=['GET'])
@token_required
def get_password(current_user, id):
    password = Password.query.filter_by(id=id, user_id=current_user.id).first()
    if not password:
        return jsonify({"message": "Password not found"}), 404

    encrypted_password = retrieve_password(password.image_path)
    decrypted_password = decrypt_password(encrypted_password)

    return jsonify({
        'site': password.site,
        'username': password.username,
        'password': decrypted_password
    }), 200
