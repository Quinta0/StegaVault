from stegano import lsb
import wave
import textwrap


# Image Steganography
def hide_password_in_image(password, image_file):
    try:
        secret = lsb.hide(image_file, password)
        output_path = f"hidden_{image_file.filename}"
        secret.save(output_path)
        return output_path
    except Exception as e:
        raise ValueError(f"Failed to hide password in image: {e}")


def retrieve_password_from_image(image_path):
    try:
        return lsb.reveal(image_path)
    except Exception as e:
        raise ValueError(f"Failed to retrieve password from image: {e}")


# Audio Steganography
def hide_password_in_audio(password, audio_file):
    try:
        # Convert password to binary
        binary_password = ''.join(format(ord(char), '08b') for char in password)
        audio = wave.open(audio_file, mode='rb')
        frames = bytearray(list(audio.readframes(audio.getnframes())))
        audio.close()

        # Embed the password in the least significant bit of each audio frame
        for i in range(len(binary_password)):
            frames[i] = (frames[i] & 254) | int(binary_password[i])

        output_path = f"hidden_{audio_file.filename}"
        with wave.open(output_path, 'wb') as audio:
            audio.setparams(audio.getparams())
            audio.writeframes(frames)
        return output_path
    except Exception as e:
        raise ValueError(f"Failed to hide password in audio: {e}")


def retrieve_password_from_audio(audio_path):
    try:
        audio = wave.open(audio_path, mode='rb')
        frames = bytearray(list(audio.readframes(audio.getnframes())))
        audio.close()

        binary_password = ''.join(str((frames[i] & 1)) for i in range(len(frames)))
        password = textwrap.fill(binary_password, 8)
        return ''.join(chr(int(char, 2)) for char in password.split())
    except Exception as e:
        raise ValueError(f"Failed to retrieve password from audio: {e}")


# Text Steganography
def hide_password_in_text(password, text_file):
    try:
        text_content = text_file.read().decode('utf-8')
        hidden_text = text_content + "\n<!-- " + password + " -->"
        output_path = f"hidden_{text_file.filename}"
        with open(output_path, 'w') as f:
            f.write(hidden_text)
        return output_path
    except Exception as e:
        raise ValueError(f"Failed to hide password in text: {e}")


def retrieve_password_from_text(text_path):
    try:
        with open(text_path, 'r') as f:
            text_content = f.read()
        return text_content.split("<!-- ")[1].split(" -->")[0]
    except Exception as e:
        raise ValueError(f"Failed to retrieve password from text: {e}")
