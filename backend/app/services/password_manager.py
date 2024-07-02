# password_manager.py
import os
from cryptography.fernet import Fernet
from ..models.password import Password
from .. import db

ENCRYPTED_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', 'encrypted_files')
os.makedirs(ENCRYPTED_FILE_PATH, exist_ok=True)


def generate_key():
    return Fernet.generate_key()


def encrypt_file(file_content, key):
    fernet = Fernet(key)
    return fernet.encrypt(file_content)


def decrypt_file(encrypted_content, key):
    fernet = Fernet(key)
    return fernet.decrypt(encrypted_content)


def save_encrypted_file(file_content, filename, key):
    encrypted_content = encrypt_file(file_content, key)
    file_path = os.path.join(ENCRYPTED_FILE_PATH, filename)
    with open(file_path, 'wb') as f:
        f.write(encrypted_content)
    return file_path


def get_encrypted_file(file_path, key):
    with open(file_path, 'rb') as f:
        encrypted_content = f.read()
    return decrypt_file(encrypted_content, key)


def add_password(user_id, site, username, password, file, file_type):
    key = generate_key()
    file_content = file.read()
    filename = f"{user_id}_{site}_{file.filename}"
    file_path = save_encrypted_file(file_content, filename, key)

    new_password = Password(
        user_id=user_id,
        site=site,
        username=username,
        encrypted_password=encrypt_file(password.encode(), key),
        file_path=file_path,
        file_key=key,
        type=file_type
    )
    db.session.add(new_password)
    db.session.commit()
    return new_password


def get_passwords(user_id):
    return Password.query.filter_by(user_id=user_id).all()


def get_password(password_id, user_id):
    password = Password.query.filter_by(id=password_id, user_id=user_id).first()
    if password:
        decrypted_password = decrypt_file(password.encrypted_password, password.file_key)
        file_content = get_encrypted_file(password.file_path, password.file_key)
        return {
            'site': password.site,
            'username': password.username,
            'password': decrypted_password.decode(),
            'file_content': file_content,
            'type': password.type
        }
    return None
