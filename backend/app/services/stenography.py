from stegano import lsb


def hide_password(password, image_path):
    secret = lsb.hide(image_path, password)
    output_path = f"hidden_{image_path}"
    secret.save(output_path)
    return output_path


def retrieve_password(image_path):
    return lsb.reveal(image_path)
