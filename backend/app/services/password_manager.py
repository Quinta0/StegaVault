import os
from cryptography.fernet import Fernet
from ..models.password import Password
from .. import db

ENCRYPTED_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', 'encrypted_files')
os.makedirs(ENCRYPTED_FILE_PATH, exist_ok=True)


def generate_key():
    return Fernet.generate_key()


def encrypt_password(password, key):
    fernet = Fernet(key)
    return fernet.encrypt(password.encode())


def decrypt_password(encrypted_password, key):
    fernet = Fernet(key)
    return fernet.decrypt(encrypted_password).decode()


def add_password(user_id, site, username, password, file_path, steg_key, file_type):
    new_password = Password(
        user_id=user_id,
        site=site,
        username=username,
        encrypted_password=steg_key,
        file_path=file_path,
        type=file_type
    )
    db.session.add(new_password)
    db.session.commit()
    return new_password


def get_passwords(user_id):
    return Password.query.filter_by(user_id=user_id).all()


def get_password(password_id, user_id):
    return Password.query.filter_by(id=password_id, user_id=user_id).first()
