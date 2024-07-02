import logging
from flask import Blueprint, request, jsonify, current_app, send_file
from ..models.password import Password
from .. import db
from ..services.stenography import (
    hide_password_in_image, retrieve_password_from_image,
    hide_password_in_audio, retrieve_password_from_audio,
    hide_password_in_text, retrieve_password_from_text
)
from ..services.password_manager import add_password, get_passwords, get_password
from ..utils.auth import token_required

bp = Blueprint('passwords', __name__, url_prefix='/api/passwords')


@bp.route('/', methods=['POST'])
@token_required
def add_password_route(current_user):
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    site = request.form.get('site')
    username = request.form.get('username')
    password = request.form.get('password')
    file_type = request.form.get('type')

    if not site or not username or not password or not file_type:
        return jsonify({"message": "Missing form data"}), 400

    try:
        if file_type == 'image':
            hidden_file_path, steg_key = hide_password_in_image(password, file)
        elif file_type == 'audio':
            hidden_file_path, steg_key = hide_password_in_audio(password, file)
        elif file_type == 'text':
            hidden_file_path, steg_key = hide_password_in_text(password, file)
        else:
            return jsonify({"message": "Invalid type specified"}), 400

        new_password = add_password(current_user.id, site, username, password, hidden_file_path, steg_key, file_type)
        return jsonify({"message": "Password added successfully", "id": new_password.id}), 201
    except Exception as e:
        logging.error(f"An error occurred while adding password: {e}", exc_info=True)
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


@bp.route('/', methods=['GET'])
@token_required
def get_passwords_route(current_user):
    try:
        passwords = get_passwords(current_user.id)
        return jsonify([{
            'id': p.id,
            'site': p.site,
            'username': p.username,
            'file_path': p.file_path,
            'type': p.type
        } for p in passwords]), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred while fetching passwords: {e}", exc_info=True)
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


@bp.route('/<int:id>', methods=['GET'])
@token_required
def get_password_route(current_user, id):
    try:
        password = get_password(id, current_user.id)
        if not password:
            return jsonify({"message": "Password not found"}), 404

        steg_key = password.encrypted_password

        if password.type == 'image':
            decrypted_password = retrieve_password_from_image(password.file_path, steg_key)
        elif password.type == 'audio':
            decrypted_password = retrieve_password_from_audio(password.file_path, steg_key)
        elif password.type == 'text':
            decrypted_password = retrieve_password_from_text(password.file_path, steg_key)
        else:
            return jsonify({"message": "Invalid type specified"}), 400

        return jsonify({
            'site': password.site,
            'username': password.username,
            'password': decrypted_password
        }), 200
    except Exception as e:
        logging.error(f"An error occurred while retrieving password: {e}", exc_info=True)
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


@bp.route('/file/<int:id>', methods=['GET'])
@token_required
def get_file(current_user, id):
    password = get_password(id, current_user.id)
    if not password:
        return jsonify({"message": "File not found"}), 404

    return send_file(password.file_path, as_attachment=True)