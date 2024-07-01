import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///stegavault.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY')
    ENCRYPTED_FILE_PATH = 'backend/app/static/encrypted_files'
    os.makedirs(ENCRYPTED_FILE_PATH, exist_ok=True)
