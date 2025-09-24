from http.server import BaseHTTPRequestHandler
import json
import base64
import io
from PIL import Image
import cgi

def image_to_ascii(image_data, width=80, style='standard'):
    try:
        image = Image.open(io.BytesIO(image_data))
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        aspect_ratio = image.height / image.width
        height = int(width * aspect_ratio * 0.5)
        
        image = image.resize((width, height))
        
        ascii_chars = {
            'standard': '@%#*+=-:. ',
            'detailed': '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
            'minimal': '@#*+-. ',
            'artistic': '█▓▒░┌┐└┘│─├┤┬┴┼╭╮╯╰╱╲╳ '
        }
        
        chars = ascii_chars.get(style, ascii_chars['standard'])
        
        ascii_art = ""
        for y in range(height):
            for x in range(width):
                r, g, b = image.getpixel((x, y))
                gray = int(0.299 * r + 0.587 * g + 0.114 * b)
                char_index = int(gray * (len(chars) - 1) / 255)
                ascii_art += chars[char_index]
            ascii_art += "\n"
        
        return ascii_art
    except Exception as e:
        raise Exception(f"Error processing image: {str(e)}")

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/ascii':
            try:
                content_type = self.headers.get('Content-Type', '')
                if 'multipart/form-data' in content_type:
                    form = cgi.FieldStorage(
                        fp=self.rfile,
                        headers=self.headers,
                        environ={'REQUEST_METHOD': 'POST'}
                    )
                    
                    if 'image' not in form:
                        self.send_error(400, "No image file provided")
                        return
                    
                    file_item = form['image']
                    if not file_item.filename:
                        self.send_error(400, "No file selected")
                        return
                    
                    image_data = file_item.file.read()
                    width = int(form.getvalue('width', 80))
                    style = form.getvalue('style', 'standard')
                    
                    ascii_art = image_to_ascii(image_data, width, style)
                    
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    response = {
                        'success': True,
                        'ascii_art': ascii_art,
                        'width': width,
                        'style': style
                    }
                    
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                else:
                    self.send_error(400, "Invalid content type")
            except Exception as e:
                self.send_error(500, f"Server error: {str(e)}")
        else:
            self.send_error(404, "Not found")
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
