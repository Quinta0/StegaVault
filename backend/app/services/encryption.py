from cryptography.fernet import Fernet

key = Fernet.generate_key()
fernet = Fernet(key)


def encrypt_password(password):
    return fernet.encrypt(password.encode()).decode()


def decrypt_password(encrypted_password):
    return fernet.decrypt(encrypted_password.encode()).decode()
