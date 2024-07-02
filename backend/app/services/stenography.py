from cryptography.fernet import Fernet
from stegano import lsb
import wave
import textwrap
import os
from PIL import Image
import io

ENCRYPTED_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', 'encrypted_files')
os.makedirs(ENCRYPTED_FILE_PATH, exist_ok=True)


# Image Steganography
def hide_password_in_image(password, image_file):
    try:
        key = Fernet.generate_key()
        fernet = Fernet(key)
        encrypted_password = fernet.encrypt(password.encode()).decode()

        image = Image.open(image_file)
        secret = lsb.hide(image, encrypted_password)
        output_path = os.path.join(ENCRYPTED_FILE_PATH, f"hidden_{image_file.filename}")
        secret.save(output_path)
        return output_path, key.decode()
    except Exception as e:
        raise ValueError(f"Failed to hide password in image: {e}")


def retrieve_password_from_image(image_path, key):
    try:
        fernet = Fernet(key.encode())
        encrypted_password = lsb.reveal(image_path)
        return fernet.decrypt(encrypted_password.encode()).decode()
    except Exception as e:
        raise ValueError(f"Failed to retrieve password from image: {e}")


# Audio Steganography
def hide_password_in_audio(password, audio_file):
    try:
        key = Fernet.generate_key()
        fernet = Fernet(key)
        encrypted_password = ''.join(format(ord(char), '08b') for char in fernet.encrypt(password.encode()).decode())

        audio = wave.open(audio_file, mode='rb')
        frames = bytearray(list(audio.readframes(audio.getnframes())))
        audio.close()

        for i in range(len(encrypted_password)):
            frames[i] = (frames[i] & 254) | int(encrypted_password[i])

        output_path = os.path.join(ENCRYPTED_FILE_PATH, f"hidden_{audio_file.filename}")
        with wave.open(output_path, 'wb') as audio:
            audio.setparams(audio.getparams())
            audio.writeframes(frames)
        return output_path, key.decode()
    except Exception as e:
        raise ValueError(f"Failed to hide password in audio: {e}")


def retrieve_password_from_audio(audio_path, key):
    try:
        audio = wave.open(audio_path, mode='rb')
        frames = bytearray(list(audio.readframes(audio.getnframes())))
        audio.close()

        binary_password = ''.join(str((frames[i] & 1)) for i in range(len(frames)))
        password = textwrap.fill(binary_password, 8)
        encrypted_password = ''.join(chr(int(char, 2)) for char in password.split())

        fernet = Fernet(key.encode())
        return fernet.decrypt(encrypted_password.encode()).decode()
    except Exception as e:
        raise ValueError(f"Failed to retrieve password from audio: {e}")


# Text Steganography
def hide_password_in_text(password, text_file):
    try:
        key = Fernet.generate_key()
        fernet = Fernet(key)
        encrypted_password = fernet.encrypt(password.encode()).decode()

        text_content = text_file.read().decode('utf-8')
        hidden_text = text_content + "\n<!-- " + encrypted_password + " -->"
        output_path = os.path.join(ENCRYPTED_FILE_PATH, f"hidden_{text_file.filename}")
        with open(output_path, 'w') as f:
            f.write(hidden_text)
        return output_path, key.decode()
    except Exception as e:
        raise ValueError(f"Failed to hide password in text: {e}")


def retrieve_password_from_text(text_path, key):
    try:
        with open(text_path, 'r') as f:
            text_content = f.read()
        encrypted_password = text_content.split("<!-- ")[1].split(" -->")[0]

        fernet = Fernet(key.encode())
        return fernet.decrypt(encrypted_password.encode()).decode()
    except Exception as e:
        raise ValueError(f"Failed to retrieve password from text: {e}")
