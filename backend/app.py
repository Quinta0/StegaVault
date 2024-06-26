from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
from stegano import lsb
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def hide_password(image_path, output_path, message):
    secret_image = lsb.hide(image_path, message)
    secret_image.save(output_path)
    return output_path

def retrieve_password(image_path):
    message = lsb.reveal(image_path)
    return message

@app.route('/hide_password', methods=['POST'])
def hide_password_route():
    image = request.files['image']
    output_path = os.path.join(UPLOAD_FOLDER, secure_filename(request.form['output_path']))
    password = request.form['password']
    image_path = os.path.join(UPLOAD_FOLDER, secure_filename(image.filename))
    image.save(image_path)
    hidden_image_path = hide_password(image_path, output_path, password)
    return send_file(hidden_image_path, mimetype='image/png')

@app.route('/retrieve_password', methods=['POST'])
def retrieve_password_route():
    image = request.files['image']
    image_path = os.path.join(UPLOAD_FOLDER, secure_filename(image.filename))
    image.save(image_path)
    password = retrieve_password(image_path)
    return jsonify({'password': password})

if __name__ == '__main__':
    app.run(debug=True)




