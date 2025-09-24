from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
import os
from PIL import Image
import io
import base64

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['UPLOAD_FOLDER'] = 'uploads'

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def image_to_ascii(image, width=80):
    ascii_chars = "@%#*+=-:. "
    
    image = image.convert('L')
    image = image.resize((width, int(width * image.height / image.width / 2)))
    
    pixels = image.getdata()
    ascii_str = ""
    
    for i, pixel in enumerate(pixels):
        ascii_str += ascii_chars[pixel // 32]
        if (i + 1) % image.width == 0:
            ascii_str += "\n"
    
    return ascii_str

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'Файл не выбран'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'Файл не выбран'}), 400
    
    if file and allowed_file(file.filename):
        try:
            image = Image.open(io.BytesIO(file.read()))
            ascii_art = image_to_ascii(image)
            
            return jsonify({
                'success': True,
                'ascii_art': ascii_art,
                'filename': secure_filename(file.filename)
            })
        except Exception as e:
            return jsonify({'error': f'Ошибка обработки изображения: {str(e)}'}), 500
    else:
        return jsonify({'error': 'Неподдерживаемый формат файла'}), 400

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5000)
