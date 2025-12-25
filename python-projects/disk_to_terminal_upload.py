import http.server
import socketserver
import cgi

PORT = 8000
UPLOAD_DIR = "."  # Saves to the current directory

class UploadHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        r, info = self.deal_post_data()
        print(r, info, "by: ", self.client_address)
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        if r:
            self.wfile.write(b"<strong>Upload successful!</strong><br>")
        else:
            self.wfile.write(b"<strong>Upload failed.</strong><br>")
        self.wfile.write(b'<a href="/">Click to go back.</a>')

    def deal_post_data(self):
        ctype, pdict = cgi.parse_header(self.headers.get('content-type'))
        if ctype == 'multipart/form-data':
            fs = cgi.FieldStorage(fp=self.rfile, headers=self.headers, environ={'REQUEST_METHOD':'POST'})
        else:
            return (False, "Unsupported content type.")

        fs_up = fs['file']
        filename = fs_up.filename
        if not fs_up.file:
            return (False, "File data not received.")

        try:
            with open(filename, "wb") as o_file:
                o_file.write(fs_up.file.read())
            return (True, "File '%s' uploaded successfully." % filename)
        except Exception as e:
            return (False, "Error saving file: %s" % str(e))

    def do_GET(self):
        # Serve the upload form on GET requests
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b'''
                <html>
                <body>
                    <h2>Upload a file to the server:</h2>
                    <form enctype="multipart/form-data" method="post">
                        <input type="file" name="file" />
                        <input type="submit" value="upload" />
                    </form>
                </body>
                </html>
            ''')
        else:
            http.server.SimpleHTTPRequestHandler.do_GET(self)

with socketserver.TCPServer(("", PORT), UploadHandler) as httpd:
    print("Serving at port", PORT)
    print("Open http://localhost:8000 in your browser.")
    httpd.serve_forever()
