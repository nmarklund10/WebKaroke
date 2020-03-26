from flask import Flask, url_for, request, render_template
app = Flask(__name__)

@app.route('/')
@app.route('/<name>')
def hello(name=None):
    return render_template('home.html', name=name)

@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html', msg=error), 404