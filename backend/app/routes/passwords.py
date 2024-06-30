import logging
from flask import Blueprint, request, jsonify
from ..models.password import Password
from .. import db
from ..services.stenography import (
    hide_password_in_image, retrieve_password_from_image,
    hide_password_in_audio, retrieve_password_from_audio,
    hide_password_in_text, retrieve_password_from_text
)
from ..services.encryption import encrypt_password, decrypt_password
from ..utils.auth import token_required

bp = Blueprint('passwords', __name__, url_prefix='/api/passwords')


@bp.route('/', methods=['POST'])
@token_required
def add_password(current_user):
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    site = request.form.get('site')
    username = request.form.get('username')
    password = request.form.get('password')
    type = request.form.get('type')

    if not site or not username or not password or not type:
        return jsonify({"message": "Missing form data"}), 400

    encrypted_password = encrypt_password(password)

    try:
        if type == 'image':
            image_path = hide_password_in_image(encrypted_password, file)
        elif type == 'audio':
            image_path = hide_password_in_audio(encrypted_password, file)
        elif type == 'text':
            image_path = hide_password_in_text(encrypted_password, file)
        else:
            return jsonify({"message": "Invalid type specified"}), 400

        new_password = Password(
            user_id=current_user.id,
            site=site,
            username=username,
            encrypted_password=encrypted_password,
            image_path=image_path,
            type=type  # Ensure the type is saved
        )
        db.session.add(new_password)
        db.session.commit()
        return jsonify({"message": "Password added successfully"}), 201
    except Exception as e:
        logging.error(f"An error occurred while adding password: {e}", exc_info=True)
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


@bp.route('/', methods=['GET'])
@token_required
def get_passwords(current_user):
    try:
        passwords = Password.query.filter_by(user_id=current_user.id).all()
        return jsonify([{
            'id': p.id,
            'site': p.site,
            'username': p.username,
            'image_path': p.image_path
        } for p in passwords]), 200
    except Exception as e:
        logging.error(f"An error occurred while fetching passwords: {e}", exc_info=True)
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


@bp.route('/<int:id>', methods=['GET'])
@token_required
def get_password(current_user, id):
    try:
        password = Password.query.filter_by(id=id, user_id=current_user.id).first()
        if not password:
            return jsonify({"message": "Password not found"}), 404

        if password.type == 'image':
            encrypted_password = retrieve_password_from_image(password.image_path)
        elif password.type == 'audio':
            encrypted_password = retrieve_password_from_audio(password.image_path)
        elif password.type == 'text':
            encrypted_password = retrieve_password_from_text(password.image_path)
        else:
            return jsonify({"message": "Invalid type specified"}), 400

        decrypted_password = decrypt_password(encrypted_password)

        return jsonify({
            'site': password.site,
            'username': password.username,
            'password': decrypted_password
        }), 200
    except Exception as e:
        logging.error(f"An error occurred while retrieving password: {e}", exc_info=True)
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
