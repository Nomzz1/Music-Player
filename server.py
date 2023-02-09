from os import path, listdir, fsencode, fsdecode
from flask import Flask, render_template, request, redirect
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = "static\music"
ALLOWED_EXTENSIONS = {'mp3'} 

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods = ["POST", "GET"])
def home():
    if request.method == "POST":
        if 'fileInput' not in request.files:
            return redirect(request.url)
        fileList = request.files.getlist('fileInput')
        for file in fileList:
            if file.filename == '':
                return redirect(request.url)
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(path.join(app.config['UPLOAD_FOLDER'], filename))
    
    songList = []
    directory = fsencode(UPLOAD_FOLDER)
    for i in listdir(directory):
        songList.append(fsdecode(i))
    songList = sorted(songList)
    songLen = len(songList)
    return render_template("index.html", songList = songList, songLen = songLen)

@app.route('/form', methods = ["POST", "GET"])
def form():
    return render_template("form.html")

if __name__ == '__main__':
    app.run(debug = True, host = "0.0.0.0")