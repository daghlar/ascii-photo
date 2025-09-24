import http.server
import socketserver
import urllib.parse
import json
import base64
import os
from PIL import Image
import io

class ASCIIHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            with open('templates/index.html', 'r', encoding='utf-8') as f:
                self.wfile.write(f.read().encode('utf-8'))
        elif self.path == '/style.css':
            self.send_response(200)
            self.send_header('Content-type', 'text/css')
            self.end_headers()
            with open('static/style.css', 'r', encoding='utf-8') as f:
                self.wfile.write(f.read().encode('utf-8'))
        elif self.path == '/script.js':
            self.send_response(200)
            self.send_header('Content-type', 'application/javascript')
            self.end_headers()
            with open('static/script.js', 'r', encoding='utf-8') as f:
                self.wfile.write(f.read().encode('utf-8'))
        elif self.path == '/languages.js':
            self.send_response(200)
            self.send_header('Content-type', 'application/javascript')
            self.end_headers()
            with open('static/languages.js', 'r', encoding='utf-8') as f:
                self.wfile.write(f.read().encode('utf-8'))
        else:
            super().do_GET()
    
    def do_POST(self):
        if self.path == '/upload':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                boundary = self.headers['Content-Type'].split('boundary=')[1]
                parts = post_data.split(b'--' + boundary.encode())
                
                file_data = None
                width = 80
                style = 'standard'
                
                for part in parts:
                    if b'Content-Disposition: form-data' in part:
                        if b'name="file"' in part:
                            file_start = part.find(b'\r\n\r\n') + 4
                            file_data = part[file_start:-2]
                        elif b'name="width"' in part:
                            width_start = part.find(b'\r\n\r\n') + 4
                            width = int(part[width_start:-2])
                        elif b'name="style"' in part:
                            style_start = part.find(b'\r\n\r\n') + 4
                            style = part[style_start:-2].decode('utf-8')
                
                if file_data:
                    image = Image.open(io.BytesIO(file_data))
                    ascii_art = self.image_to_ascii(image, width, style)
                    
                    response = {
                        'success': True,
                        'ascii_art': ascii_art,
                        'filename': 'uploaded_image'
                    }
                else:
                    response = {'error': 'Файл не найден'}
                
            except Exception as e:
                response = {'error': f'Ошибка обработки: {str(e)}'}
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
    
    def image_to_ascii(self, image, width=80, style='standard'):
        ascii_styles = {
            'standard': "@%#*+=-:. ",
            'detailed': "@%#*+=-:. ",
            'minimal': "@#*+-. ",
            'artistic': "█▓▒░· "
        }
        
        ascii_chars = ascii_styles.get(style, ascii_styles['standard'])
        
        image = image.convert('RGBA')
        image = image.resize((width, int(width * image.height / image.width / 2)), Image.Resampling.LANCZOS)
        
        pixels = image.getdata()
        ascii_str = ""
        
        for i, pixel in enumerate(pixels):
            r, g, b, a = pixel
            
            if a < 128:
                ascii_str += " "
            else:
                brightness = int(0.299 * r + 0.587 * g + 0.114 * b)
                char_index = min(brightness // (256 // len(ascii_chars)), len(ascii_chars) - 1)
                ascii_str += ascii_chars[char_index]
            
            if (i + 1) % image.width == 0:
                ascii_str += "\n"
        
        return ascii_str

if __name__ == "__main__":
    PORT = 8080
    with socketserver.TCPServer(("", PORT), ASCIIHandler) as httpd:
        print(f"Сервер запущен на http://localhost:{PORT}")
        print("Нажмите Ctrl+C для остановки")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nСервер остановлен")
